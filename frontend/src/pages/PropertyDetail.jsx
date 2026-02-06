import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Zap,
  Building2,
  Play,
  ExternalLink,
  Phone,
  Mail,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { AmenitiesSection } from '@/components/AmenitiesSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyDetail = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await api.getProperty(slug);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 bg-[#0a0a0a] flex flex-col items-center justify-center">
        <p className="text-[#A1A1AA] text-lg mb-4">Property not found</p>
        <Link to="/projects" className="text-[#D4AF37] hover:text-[#E5C565]">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const isUpcoming = property.launch_date && new Date(property.launch_date) > new Date();

  return (
    <div className="min-h-screen pt-20" data-testid="property-detail-page">
      {/* Back Button */}
      <div className="bg-[#0a0a0a] py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Gallery */}
      <section className="relative h-[60vh] md:h-[70vh]" data-testid="property-gallery">
        <div className="absolute inset-0">
          <img
            src={property.images[currentImageIndex]}
            alt={property.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Gallery Controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
              data-testid="gallery-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
              data-testid="gallery-next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-[#D4AF37]' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-8 left-8 flex gap-3">
          {property.is_new_launch && (
            <Badge className="bg-[#D4AF37] text-black border-0 flex items-center gap-1 text-sm px-4 py-2">
              <Sparkles className="w-4 h-4" />
              New Launch
            </Badge>
          )}
          {property.status === 'coming_soon' && (
            <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 text-sm px-4 py-2">
              Coming Soon
            </Badge>
          )}
          {property.status === 'sold_out' && (
            <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-sm px-4 py-2">
              Sold Out
            </Badge>
          )}
        </div>
      </section>

      {/* Property Info */}
      <section className="bg-[#0a0a0a] py-12 md:py-16" data-testid="property-info">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
                  {property.name}
                </h1>
                <p className="flex items-center gap-2 text-[#A1A1AA] text-lg mb-8">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  {property.address}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-[#121212] border border-white/5">
                  <div className="text-center">
                    <Bed className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                    <p className="font-display text-2xl text-white">{property.features.bedrooms}</p>
                    <p className="text-[#52525B] text-sm">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                    <p className="font-display text-2xl text-white">{property.features.bathrooms}</p>
                    <p className="text-[#52525B] text-sm">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <Maximize className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                    <p className="font-display text-2xl text-white">{property.features.area}m²</p>
                    <p className="text-[#52525B] text-sm">Area</p>
                  </div>
                  <div className="text-center">
                    <Car className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                    <p className="font-display text-2xl text-white">{property.features.parking}</p>
                    <p className="text-[#52525B] text-sm">Parking</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-white mb-4">About This Property</h2>
                  <p className="text-[#A1A1AA] leading-relaxed">{property.description}</p>
                </div>

                {/* Highlights */}
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-white mb-6">Highlights</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {property.highlights.map((highlight, index) => (
                      <motion.div
                        key={highlight}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-[#121212] border border-white/5"
                      >
                        <div className="w-2 h-2 bg-[#D4AF37]" />
                        <span className="text-[#EDEDED]">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tabs for Details */}
                <Tabs defaultValue="amenities" className="mb-12">
                  <TabsList className="bg-[#121212] border border-white/5 p-1">
                    <TabsTrigger value="amenities" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black" data-testid="tab-amenities">
                      Nearby Amenities
                    </TabsTrigger>
                    <TabsTrigger value="financing" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black" data-testid="tab-financing">
                      Financing Options
                    </TabsTrigger>
                    <TabsTrigger value="specs" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black" data-testid="tab-specs">
                      Specifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="amenities" className="mt-8">
                    <AmenitiesSection amenities={property.amenities} />
                  </TabsContent>

                  <TabsContent value="financing" className="mt-8">
                    {property.financing_options.length > 0 ? (
                      <div className="space-y-4" data-testid="financing-options">
                        {property.financing_options.map((option, index) => (
                          <motion.div
                            key={option.bank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#121212] border border-white/5 p-6"
                          >
                            <h4 className="font-display text-xl text-white mb-4">{option.bank}</h4>
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <p className="text-[#52525B] text-sm mb-1">Interest Rate</p>
                                <p className="text-[#D4AF37] text-xl font-semibold">{option.rate}</p>
                              </div>
                              <div>
                                <p className="text-[#52525B] text-sm mb-1">Term</p>
                                <p className="text-white text-xl">{option.term}</p>
                              </div>
                              <div>
                                <p className="text-[#52525B] text-sm mb-1">Down Payment</p>
                                <p className="text-white text-xl">{option.down_payment}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#A1A1AA]">Contact us for financing options.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="specs" className="mt-8">
                    <div className="bg-[#121212] border border-white/5 p-6" data-testid="specifications">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[#52525B] text-sm mb-1">Floors</p>
                          <p className="text-white text-lg">{property.features.floor}</p>
                        </div>
                        <div>
                          <p className="text-[#52525B] text-sm mb-1">Energy Rating</p>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#D4AF37]" />
                            <p className="text-white text-lg">{property.features.energy_rating}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[#52525B] text-sm mb-1">Completion</p>
                          <p className="text-white text-lg">{formatDate(property.completion_date)}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#121212] border border-[#D4AF37]/20 p-8"
                  data-testid="price-card"
                >
                  <p className="text-[#52525B] text-sm uppercase tracking-wider mb-2">Price Range</p>
                  <p className="font-display text-3xl text-white mb-1">
                    {formatPrice(property.price_from)}
                  </p>
                  <p className="text-[#A1A1AA] mb-6">to {formatPrice(property.price_to)}</p>

                  {isUpcoming && (
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <CountdownTimer targetDate={property.launch_date} label="Launch Countdown" />
                    </div>
                  )}

                  <Link
                    to="/contact"
                    className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
                    data-testid="enquire-button"
                  >
                    Enquire Now
                  </Link>

                  <a
                    href="tel:+35725339143"
                    className="btn-outline w-full flex items-center justify-center gap-2"
                    data-testid="call-button"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                </motion.div>

                {/* Virtual Tour / Resources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#121212] border border-white/5 p-6"
                  data-testid="resources-card"
                >
                  <h3 className="font-display text-lg text-white mb-4">Resources</h3>
                  <div className="space-y-3">
                    {property.virtual_tour_url && (
                      <a
                        href={property.virtual_tour_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#D4AF37]/10 transition-colors group"
                        data-testid="virtual-tour-link"
                      >
                        <Play className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#EDEDED] group-hover:text-[#D4AF37] transition-colors">Virtual Tour</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-[#52525B]" />
                      </a>
                    )}
                    {property.video_url && (
                      <a
                        href={property.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#D4AF37]/10 transition-colors group"
                        data-testid="video-link"
                      >
                        <Play className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#EDEDED] group-hover:text-[#D4AF37] transition-colors">Video Walkthrough</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-[#52525B]" />
                      </a>
                    )}
                    {property.floor_plan_url && (
                      <a
                        href={property.floor_plan_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#D4AF37]/10 transition-colors group"
                        data-testid="floorplan-link"
                      >
                        <FileText className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#EDEDED] group-hover:text-[#D4AF37] transition-colors">Floor Plans</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-[#52525B]" />
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Contact Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#121212] border border-white/5 p-6"
                  data-testid="contact-card"
                >
                  <h3 className="font-display text-lg text-white mb-4">Need Help?</h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+35725339143"
                      className="flex items-center gap-3 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      +357 25 339143
                    </a>
                    <a
                      href="mailto:info@evangeloufrantzis.com"
                      className="flex items-center gap-3 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      info@evangeloufrantzis.com
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;
