from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Amenity(BaseModel):
    name: str
    distance: str
    icon: str
    category: str

class PropertyFeature(BaseModel):
    bedrooms: int
    bathrooms: int
    area: int
    parking: int
    floor: str
    energy_rating: str

class FinancingOption(BaseModel):
    bank: str
    rate: str
    term: str
    down_payment: str

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    location: str
    address: str
    description: str
    price_from: int
    price_to: int
    currency: str = "EUR"
    status: str
    is_new_launch: bool = False
    launch_date: Optional[str] = None
    completion_date: Optional[str] = None
    features: PropertyFeature
    amenities: List[Amenity]
    images: List[str]
    floor_plan_url: Optional[str] = None
    virtual_tour_url: Optional[str] = None
    video_url: Optional[str] = None
    financing_options: List[FinancingOption]
    highlights: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    property_interest: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactFormCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    property_interest: Optional[str] = None
    message: str

class MortgageCalculation(BaseModel):
    property_price: float
    down_payment_percent: float
    interest_rate: float
    loan_term_years: int

class MortgageResult(BaseModel):
    loan_amount: float
    monthly_payment: float
    total_payment: float
    total_interest: float
    down_payment: float

# Cyprus Bank Rates (Updated Dec 2025)
CYPRUS_MORTGAGE_RATES = [
    {"bank": "Bank of Cyprus", "rate": 3.64, "min_down_payment": 20, "max_term": 30},
    {"bank": "Hellenic Bank", "rate": 3.75, "min_down_payment": 15, "max_term": 30},
    {"bank": "Alpha Bank Cyprus", "rate": 3.55, "min_down_payment": 20, "max_term": 25},
    {"bank": "Eurobank Cyprus", "rate": 3.80, "min_down_payment": 25, "max_term": 25},
    {"bank": "RCB Bank", "rate": 3.90, "min_down_payment": 20, "max_term": 20},
]

# Sample Properties Data with actual Cyprus-style images
SAMPLE_PROPERTIES = [
    {
        "id": "duet-residency",
        "name": "DUET Residency",
        "slug": "duet-residency",
        "location": "Kato Polemidia, Limassol",
        "address": "15 Harmony Avenue, Kato Polemidia",
        "description": "DUET Residency is our latest flagship development featuring twin luxury towers with stunning architectural design. Premium 2 & 3 bedroom apartments with panoramic city and sea views, smart home technology, and exclusive amenities including infinity pool and rooftop garden.",
        "price_from": 245000,
        "price_to": 520000,
        "currency": "EUR",
        "status": "coming_soon",
        "is_new_launch": True,
        "launch_date": "2026-03-15",
        "completion_date": "2028-06-30",
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 145,
            "parking": 2,
            "floor": "1-12",
            "energy_rating": "A+"
        },
        "amenities": [
            {"name": "Limassol General Hospital", "distance": "1.5 km", "icon": "hospital", "category": "essential"},
            {"name": "TEPAK University", "distance": "2.8 km", "icon": "school", "category": "essential"},
            {"name": "Alphamega Supermarket", "distance": "0.4 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Bus Station", "distance": "0.2 km", "icon": "bus", "category": "essential"},
            {"name": "Dasoudi Beach", "distance": "4.2 km", "icon": "waves", "category": "lifestyle"},
            {"name": "MyMall Limassol", "distance": "2.5 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Municipal Park", "distance": "1.2 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Fitness First Gym", "distance": "0.6 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Taverna Olympus", "distance": "0.3 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1730646342796-51c1b5627d9d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1655019545925-ddad6147d575?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1704741751068-c40d8ccf868c?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/duet-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=duet",
        "video_url": "https://www.youtube.com/embed/duet",
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "30 years", "down_payment": "20%"},
            {"bank": "Hellenic Bank", "rate": "3.75%", "term": "30 years", "down_payment": "15%"},
            {"bank": "Alpha Bank Cyprus", "rate": "3.55%", "term": "25 years", "down_payment": "20%"}
        ],
        "highlights": ["Twin Towers Design", "Infinity Pool", "Smart Home", "Rooftop Garden", "Sea Views"]
    },
    {
        "id": "verso-residence",
        "name": "Verso Residence",
        "slug": "verso-residence",
        "location": "Kato Polemidia, Limassol",
        "address": "25 Makarios Avenue, Kato Polemidia",
        "description": "A stunning contemporary development featuring premium 2 & 3 bedroom apartments with panoramic city views. Verso Residence represents the pinnacle of modern living in Limassol, combining sophisticated design with unparalleled comfort.",
        "price_from": 195000,
        "price_to": 385000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": True,
        "launch_date": "2025-12-15",
        "completion_date": "2027-06-30",
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 125,
            "parking": 2,
            "floor": "1-8",
            "energy_rating": "A"
        },
        "amenities": [
            {"name": "Limassol General Hospital", "distance": "1.2 km", "icon": "hospital", "category": "essential"},
            {"name": "TEPAK University", "distance": "2.5 km", "icon": "school", "category": "essential"},
            {"name": "Alphamega Supermarket", "distance": "0.5 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Bus Station", "distance": "0.3 km", "icon": "bus", "category": "essential"},
            {"name": "Dasoudi Beach", "distance": "3.8 km", "icon": "waves", "category": "lifestyle"},
            {"name": "MyMall Limassol", "distance": "2.1 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Municipal Park", "distance": "1.5 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Fitness First Gym", "distance": "0.8 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Taverna Olympus", "distance": "0.4 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1762449826563-5373ef0f3568?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1763980014986-e1eef48b4e4d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1703091854773-23fb8dd50173?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/verso-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=example",
        "video_url": "https://www.youtube.com/embed/example",
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "25 years", "down_payment": "20%"},
            {"bank": "Hellenic Bank", "rate": "3.75%", "term": "30 years", "down_payment": "15%"}
        ],
        "highlights": ["Sea Views", "Smart Home", "Private Garden", "Underground Parking"]
    },
    {
        "id": "elias-residence",
        "name": "Elias Residence",
        "slug": "elias-residence",
        "location": "Agios Athanasios, Limassol",
        "address": "12 Elias Street, Agios Athanasios",
        "description": "Elias Residence offers sophisticated living spaces designed for discerning buyers. Each apartment features premium finishes, spacious balconies, and access to exclusive communal amenities including a rooftop garden.",
        "price_from": 245000,
        "price_to": 420000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": True,
        "launch_date": "2026-01-20",
        "completion_date": "2027-09-15",
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 140,
            "parking": 2,
            "floor": "1-6",
            "energy_rating": "A+"
        },
        "amenities": [
            {"name": "American Medical Center", "distance": "1.8 km", "icon": "hospital", "category": "essential"},
            {"name": "Grammar School", "distance": "1.2 km", "icon": "school", "category": "essential"},
            {"name": "Carrefour", "distance": "0.7 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Metro Station", "distance": "0.5 km", "icon": "train", "category": "essential"},
            {"name": "Ladies Mile Beach", "distance": "2.5 km", "icon": "waves", "category": "lifestyle"},
            {"name": "Kings Avenue Mall", "distance": "1.8 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Botanical Gardens", "distance": "2.0 km", "icon": "trees", "category": "lifestyle"},
            {"name": "CrossFit Limassol", "distance": "1.0 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "La Maison Fleur", "distance": "0.6 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1761386017822-0d9d41fd5725?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1755865871764-d70a62cd0a67?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1622632984392-bfc18e38a38d?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/elias-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=example2",
        "video_url": None,
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "25 years", "down_payment": "20%"},
            {"bank": "Alpha Bank", "rate": "3.55%", "term": "20 years", "down_payment": "25%"}
        ],
        "highlights": ["Rooftop Garden", "Premium Finishes", "Spacious Balconies", "24/7 Security"]
    },
    {
        "id": "sotia-residence",
        "name": "Sotia Residence",
        "slug": "sotia-residence",
        "location": "Mesa Geitonia, Limassol",
        "address": "8 Sotia Avenue, Mesa Geitonia",
        "description": "An exclusive boutique development of only 12 apartments, Sotia Residence offers intimate luxury living. Perfect for families seeking tranquility without compromising on accessibility to urban amenities.",
        "price_from": 175000,
        "price_to": 295000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": False,
        "launch_date": None,
        "completion_date": "2026-03-01",
        "features": {
            "bedrooms": 2,
            "bathrooms": 1,
            "area": 95,
            "parking": 1,
            "floor": "1-4",
            "energy_rating": "A"
        },
        "amenities": [
            {"name": "Ygia Polyclinic", "distance": "2.0 km", "icon": "hospital", "category": "essential"},
            {"name": "Pascal English School", "distance": "1.5 km", "icon": "school", "category": "essential"},
            {"name": "Lidl", "distance": "0.4 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Bus Stop", "distance": "0.2 km", "icon": "bus", "category": "essential"},
            {"name": "Governor's Beach", "distance": "8.5 km", "icon": "waves", "category": "lifestyle"},
            {"name": "The Mall of Cyprus", "distance": "45 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Limassol Zoo", "distance": "3.5 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Gold's Gym", "distance": "1.2 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Ocean Basket", "distance": "0.8 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1622632983007-d5fd73d2d169?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1645683971142-7716faf55ca6?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1623857792265-cc4d16c0ebd8?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/sotia-floorplan.pdf",
        "virtual_tour_url": None,
        "video_url": None,
        "financing_options": [
            {"bank": "Hellenic Bank", "rate": "3.75%", "term": "30 years", "down_payment": "15%"}
        ],
        "highlights": ["Boutique Development", "Family Friendly", "Quiet Neighborhood", "Near Schools"]
    },
    {
        "id": "mamas-eagle-gardens",
        "name": "Mamas Eagle Gardens",
        "slug": "mamas-eagle-gardens",
        "location": "Germasogeia, Limassol",
        "address": "45 Eagle Drive, Germasogeia",
        "description": "Mamas Eagle Gardens is a prestigious gated community featuring luxurious villas and maisonettes. Set amidst landscaped gardens with stunning mountain views, this development offers the ultimate in privacy and comfort.",
        "price_from": 450000,
        "price_to": 850000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": False,
        "launch_date": None,
        "completion_date": "2025-12-01",
        "features": {
            "bedrooms": 4,
            "bathrooms": 3,
            "area": 220,
            "parking": 2,
            "floor": "G+1",
            "energy_rating": "A+"
        },
        "amenities": [
            {"name": "Mediterranean Hospital", "distance": "3.5 km", "icon": "hospital", "category": "essential"},
            {"name": "Heritage Private School", "distance": "2.0 km", "icon": "school", "category": "essential"},
            {"name": "Sklavenitis", "distance": "1.2 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Bus Terminal", "distance": "1.5 km", "icon": "bus", "category": "essential"},
            {"name": "Germasogeia Beach", "distance": "4.0 km", "icon": "waves", "category": "lifestyle"},
            {"name": "Makariou Shopping District", "distance": "2.8 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Germasogeia Dam", "distance": "1.0 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Lifestyle Fitness", "distance": "2.2 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Karatello Italian", "distance": "1.8 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/mamas-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=mamas",
        "video_url": "https://www.youtube.com/embed/mamas",
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "25 years", "down_payment": "30%"},
            {"bank": "Eurobank Cyprus", "rate": "3.80%", "term": "20 years", "down_payment": "25%"}
        ],
        "highlights": ["Gated Community", "Private Pool", "Mountain Views", "Landscaped Gardens"]
    },
    {
        "id": "vladimiros-residence",
        "name": "Vladimiros Residence",
        "slug": "vladimiros-residence",
        "location": "Zakaki, Limassol",
        "address": "18 Marina Boulevard, Zakaki",
        "description": "Located near the new Limassol Marina, Vladimiros Residence offers contemporary waterfront living. These exclusive apartments feature premium marine-grade finishes and direct access to the promenade.",
        "price_from": 320000,
        "price_to": 580000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": True,
        "launch_date": "2026-02-01",
        "completion_date": "2028-01-15",
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 150,
            "parking": 2,
            "floor": "1-10",
            "energy_rating": "A+"
        },
        "amenities": [
            {"name": "Apollonion Hospital", "distance": "2.8 km", "icon": "hospital", "category": "essential"},
            {"name": "Foley's Grammar School", "distance": "3.0 km", "icon": "school", "category": "essential"},
            {"name": "Metro Supermarket", "distance": "0.8 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Marina Bus Stop", "distance": "0.1 km", "icon": "bus", "category": "essential"},
            {"name": "Limassol Marina Beach", "distance": "0.3 km", "icon": "waves", "category": "lifestyle"},
            {"name": "Marina Shops", "distance": "0.2 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Molos Promenade", "distance": "0.5 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Marina Fitness Club", "distance": "0.4 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Pier One Restaurant", "distance": "0.2 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1570605544454-42578ceab106?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1760163287866-ab68025b4c96?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1664993118544-72b2531c8157?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/vladimiros-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=vlad",
        "video_url": "https://www.youtube.com/embed/vlad",
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "25 years", "down_payment": "20%"},
            {"bank": "RCB Bank", "rate": "3.90%", "term": "30 years", "down_payment": "15%"}
        ],
        "highlights": ["Waterfront Location", "Marina Access", "Sea Views", "Premium Finishes"]
    },
    {
        "id": "meca-twins",
        "name": "Meca Twins",
        "slug": "meca-twins",
        "location": "Agios Nikolaos, Limassol",
        "address": "22 Twin Towers Avenue, Agios Nikolaos",
        "description": "An iconic twin-tower development that redefines the Limassol skyline. Meca Twins offers luxurious penthouse living with panoramic 360-degree views of the Mediterranean Sea and Troodos Mountains.",
        "price_from": 380000,
        "price_to": 1200000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": False,
        "launch_date": None,
        "completion_date": "2027-12-01",
        "features": {
            "bedrooms": 4,
            "bathrooms": 3,
            "area": 200,
            "parking": 3,
            "floor": "1-25",
            "energy_rating": "A+"
        },
        "amenities": [
            {"name": "German Oncology Center", "distance": "4.0 km", "icon": "hospital", "category": "essential"},
            {"name": "International School", "distance": "2.5 km", "icon": "school", "category": "essential"},
            {"name": "Papantoniou", "distance": "1.0 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Central Bus Station", "distance": "0.8 km", "icon": "bus", "category": "essential"},
            {"name": "Akti Olympion Beach", "distance": "1.5 km", "icon": "waves", "category": "lifestyle"},
            {"name": "Anexartisias Shopping", "distance": "1.2 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Municipal Gardens", "distance": "0.6 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Equilibrium Gym", "distance": "0.9 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Columbia Steak House", "distance": "0.7 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/meca-floorplan.pdf",
        "virtual_tour_url": None,
        "video_url": "https://www.youtube.com/embed/meca",
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "30 years", "down_payment": "25%"},
            {"bank": "Hellenic Bank", "rate": "3.75%", "term": "25 years", "down_payment": "20%"}
        ],
        "highlights": ["Twin Towers", "Penthouse Living", "360° Views", "Infinity Pool"]
    },
    {
        "id": "q-residence",
        "name": "Q Residence",
        "slug": "q-residence",
        "location": "Potamos Germasogeia, Limassol",
        "address": "5 Quality Lane, Potamos Germasogeia",
        "description": "Q Residence sets a new standard for quality living in Limassol. This boutique development features smart home technology, sustainable design, and meticulously crafted interiors for the modern professional.",
        "price_from": 215000,
        "price_to": 345000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": False,
        "launch_date": None,
        "completion_date": "2026-06-01",
        "features": {
            "bedrooms": 2,
            "bathrooms": 2,
            "area": 105,
            "parking": 1,
            "floor": "1-5",
            "energy_rating": "A+"
        },
        "amenities": [
            {"name": "Aretaeio Hospital", "distance": "3.2 km", "icon": "hospital", "category": "essential"},
            {"name": "American Academy", "distance": "1.8 km", "icon": "school", "category": "essential"},
            {"name": "AB Vasilopoulos", "distance": "0.6 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Bus Route 30", "distance": "0.3 km", "icon": "bus", "category": "essential"},
            {"name": "Curium Beach", "distance": "12 km", "icon": "waves", "category": "lifestyle"},
            {"name": "IKEA Limassol", "distance": "5.0 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Fasouri Watermania", "distance": "8.0 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Planet Fitness", "distance": "1.5 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Nando's", "distance": "1.0 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1664993118464-f8e4a58f0b15?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1758116482216-b23a8c04cf12?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1611067523416-679acc413e30?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/q-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=qres",
        "video_url": None,
        "financing_options": [
            {"bank": "Alpha Bank", "rate": "3.55%", "term": "25 years", "down_payment": "20%"}
        ],
        "highlights": ["Smart Home", "Sustainable Design", "Modern Interiors", "Energy Efficient"]
    },
    {
        "id": "costa-residence",
        "name": "Costa Residence",
        "slug": "costa-residence",
        "location": "Yermasoyia Tourist Area, Limassol",
        "address": "88 Coastal Road, Yermasoyia",
        "description": "Costa Residence brings coastal luxury living to Limassol's premier tourist district. Wake up to Mediterranean sunrises and enjoy resort-style amenities including a heated pool and private beach access.",
        "price_from": 285000,
        "price_to": 520000,
        "currency": "EUR",
        "status": "available",
        "is_new_launch": False,
        "launch_date": None,
        "completion_date": "2026-09-01",
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 135,
            "parking": 2,
            "floor": "1-8",
            "energy_rating": "A"
        },
        "amenities": [
            {"name": "St. Raphael Medical", "distance": "1.5 km", "icon": "hospital", "category": "essential"},
            {"name": "Silverline School", "distance": "2.2 km", "icon": "school", "category": "essential"},
            {"name": "Debenhams Food Hall", "distance": "0.9 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "Tourist Area Bus", "distance": "0.1 km", "icon": "bus", "category": "essential"},
            {"name": "Yermasoyia Beach", "distance": "0.2 km", "icon": "waves", "category": "lifestyle"},
            {"name": "Four Seasons Mall", "distance": "1.0 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Seafront Promenade", "distance": "0.1 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Hilton Gym & Spa", "distance": "0.5 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Sala Beach Bar", "distance": "0.3 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/costa-floorplan.pdf",
        "virtual_tour_url": "https://my.matterport.com/show/?m=costa",
        "video_url": "https://www.youtube.com/embed/costa",
        "financing_options": [
            {"bank": "Bank of Cyprus", "rate": "3.64%", "term": "25 years", "down_payment": "20%"},
            {"bank": "Hellenic Bank", "rate": "3.75%", "term": "30 years", "down_payment": "15%"}
        ],
        "highlights": ["Beach Access", "Resort Amenities", "Heated Pool", "Sea Views"]
    },
    {
        "id": "vasiliki-residence",
        "name": "Vasiliki Residence",
        "slug": "vasiliki-residence",
        "location": "Columbia Area, Limassol",
        "address": "15 Royal Street, Columbia",
        "description": "Named after the Greek word for 'Royal', Vasiliki Residence lives up to its name with regal finishes and aristocratic charm. This elegant development offers refined living in one of Limassol's most sought-after neighborhoods.",
        "price_from": 265000,
        "price_to": 445000,
        "currency": "EUR",
        "status": "sold_out",
        "is_new_launch": False,
        "launch_date": None,
        "completion_date": "2025-03-01",
        "features": {
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 130,
            "parking": 2,
            "floor": "1-6",
            "energy_rating": "A"
        },
        "amenities": [
            {"name": "Iasis Hospital", "distance": "2.5 km", "icon": "hospital", "category": "essential"},
            {"name": "St. Mary's School", "distance": "1.0 km", "icon": "school", "category": "essential"},
            {"name": "Athienitis", "distance": "0.5 km", "icon": "shopping-cart", "category": "essential"},
            {"name": "City Bus", "distance": "0.2 km", "icon": "bus", "category": "essential"},
            {"name": "Aphrodite Beach", "distance": "2.0 km", "icon": "waves", "category": "lifestyle"},
            {"name": "Columbia Plaza", "distance": "0.3 km", "icon": "shopping-bag", "category": "lifestyle"},
            {"name": "Columbia Park", "distance": "0.4 km", "icon": "trees", "category": "lifestyle"},
            {"name": "Holmes Place", "distance": "0.8 km", "icon": "dumbbell", "category": "lifestyle"},
            {"name": "Elia Restaurant", "distance": "0.4 km", "icon": "utensils", "category": "lifestyle"}
        ],
        "images": [
            "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=srgb&fm=jpg&q=85",
            "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?crop=entropy&cs=srgb&fm=jpg&q=85"
        ],
        "floor_plan_url": "https://example.com/vasiliki-floorplan.pdf",
        "virtual_tour_url": None,
        "video_url": None,
        "financing_options": [],
        "highlights": ["Elegant Design", "Prime Location", "Luxury Finishes", "Concierge Service"]
    }
]

# Routes
@api_router.get("/")
async def root():
    return {"message": "Evangelou & Frantzis API", "version": "1.0.0"}

@api_router.get("/properties", response_model=List[dict])
async def get_properties(
    is_new_launch: Optional[bool] = None,
    status: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    bedrooms: Optional[int] = None
):
    """Get all properties with optional filters"""
    properties = SAMPLE_PROPERTIES.copy()
    
    if is_new_launch is not None:
        properties = [p for p in properties if p["is_new_launch"] == is_new_launch]
    
    if status:
        properties = [p for p in properties if p["status"] == status]
    
    if min_price:
        properties = [p for p in properties if p["price_from"] >= min_price]
    
    if max_price:
        properties = [p for p in properties if p["price_to"] <= max_price]
    
    if bedrooms:
        properties = [p for p in properties if p["features"]["bedrooms"] >= bedrooms]
    
    return properties

@api_router.get("/properties/new-launches", response_model=List[dict])
async def get_new_launches():
    """Get only new launch properties"""
    return [p for p in SAMPLE_PROPERTIES if p["is_new_launch"]]

@api_router.get("/properties/featured", response_model=List[dict])
async def get_featured_properties():
    """Get featured properties (first 4 available)"""
    available = [p for p in SAMPLE_PROPERTIES if p["status"] == "available"]
    return available[:4]

@api_router.get("/properties/{slug}", response_model=dict)
async def get_property(slug: str):
    """Get a single property by slug"""
    for prop in SAMPLE_PROPERTIES:
        if prop["slug"] == slug:
            return prop
    raise HTTPException(status_code=404, detail="Property not found")

@api_router.post("/contact", response_model=dict)
async def submit_contact(form: ContactFormCreate):
    """Submit a contact form"""
    contact = ContactForm(**form.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contacts.insert_one(doc)
    
    return {
        "success": True,
        "message": "Thank you for your inquiry. Our team will contact you shortly.",
        "id": contact.id
    }

@api_router.get("/company-info")
async def get_company_info():
    """Get company information"""
    return {
        "name": "Evangelou & Frantzis Developers & Constructions Co Ltd",
        "established": 1971,
        "years_of_experience": 54,
        "tagline": "Building Dreams for Over 50 Years",
        "description": "A family-run business that has grown into a major player in Cyprus real estate, known for constructing affordable, superior-quality homes and commercial properties.",
        "values": [
            {"title": "Quality", "description": "Using only premium materials and skilled craftsmanship"},
            {"title": "Integrity", "description": "Honest dealings and transparent communication"},
            {"title": "Innovation", "description": "Modern designs with sustainable practices"},
            {"title": "Customer Focus", "description": "From design to completion, your satisfaction is our priority"}
        ],
        "contact": {
            "address": "6 Laiou str., Anna Court, Block A, Flat/Office 502, 7th Floor, 3015 Omonoia/Limassol, Cyprus",
            "phone": ["+357 25 339143", "+357 25 388832"],
            "mobile": "+357 99 692044",
            "fax": "+357 25 735068",
            "email": "info@evangeloufrantzis.com"
        },
        "stats": {
            "projects_completed": 150,
            "units_delivered": 2500,
            "happy_families": 2000,
            "years_experience": 54
        }
    }

@api_router.get("/mortgage/rates")
async def get_mortgage_rates():
    """Get current Cyprus mortgage rates from major banks"""
    return {
        "rates": CYPRUS_MORTGAGE_RATES,
        "last_updated": "December 2025",
        "average_rate": 3.64,
        "note": "Rates are indicative and subject to individual eligibility and market conditions"
    }

@api_router.post("/mortgage/calculate", response_model=MortgageResult)
async def calculate_mortgage(calc: MortgageCalculation):
    """Calculate mortgage monthly payments"""
    # Validate inputs
    if calc.property_price <= 0:
        raise HTTPException(status_code=400, detail="Property price must be positive")
    if calc.down_payment_percent < 0 or calc.down_payment_percent > 100:
        raise HTTPException(status_code=400, detail="Down payment must be between 0 and 100%")
    if calc.interest_rate <= 0 or calc.interest_rate > 20:
        raise HTTPException(status_code=400, detail="Interest rate must be between 0 and 20%")
    if calc.loan_term_years <= 0 or calc.loan_term_years > 40:
        raise HTTPException(status_code=400, detail="Loan term must be between 1 and 40 years")
    
    # Calculate
    down_payment = calc.property_price * (calc.down_payment_percent / 100)
    loan_amount = calc.property_price - down_payment
    
    # Monthly interest rate
    monthly_rate = (calc.interest_rate / 100) / 12
    
    # Total number of payments
    num_payments = calc.loan_term_years * 12
    
    # Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    if monthly_rate > 0:
        monthly_payment = loan_amount * (monthly_rate * pow(1 + monthly_rate, num_payments)) / (pow(1 + monthly_rate, num_payments) - 1)
    else:
        monthly_payment = loan_amount / num_payments
    
    total_payment = monthly_payment * num_payments
    total_interest = total_payment - loan_amount
    
    return MortgageResult(
        loan_amount=round(loan_amount, 2),
        monthly_payment=round(monthly_payment, 2),
        total_payment=round(total_payment, 2),
        total_interest=round(total_interest, 2),
        down_payment=round(down_payment, 2)
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
