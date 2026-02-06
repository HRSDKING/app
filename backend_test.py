import requests
import sys
from datetime import datetime

class RealEstateAPITester:
    def __init__(self, base_url="https://flatview-pro.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if endpoint else f"{self.base_url}/api"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_all_properties(self):
        """Test getting all properties"""
        success, response = self.run_test("Get All Properties", "GET", "properties", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} properties")
            # Check if we have the expected properties
            property_names = [p.get('name', '') for p in response]
            expected_properties = ['Meca Twins', 'Verso Residence', 'Elias Residence']
            for prop in expected_properties:
                if prop in property_names:
                    print(f"   ✓ Found expected property: {prop}")
                else:
                    print(f"   ⚠ Missing expected property: {prop}")
        return success

    def test_get_new_launches(self):
        """Test getting new launch properties"""
        success, response = self.run_test("Get New Launches", "GET", "properties/new-launches", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} new launches")
            # Check for Meca Twins specifically
            meca_twins = next((p for p in response if p.get('name') == 'Meca Twins'), None)
            if meca_twins:
                print(f"   ✓ Found Meca Twins with launch date: {meca_twins.get('launch_date')}")
            else:
                print(f"   ⚠ Meca Twins not found in new launches")
        return success

    def test_get_featured_properties(self):
        """Test getting featured properties"""
        success, response = self.run_test("Get Featured Properties", "GET", "properties/featured", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} featured properties")
        return success

    def test_get_property_by_slug(self):
        """Test getting a specific property by slug"""
        success, response = self.run_test("Get Property by Slug", "GET", "properties/meca-twins", 200)
        if success and isinstance(response, dict):
            print(f"   Property: {response.get('name')}")
            print(f"   Location: {response.get('location')}")
            print(f"   Status: {response.get('status')}")
            print(f"   Is New Launch: {response.get('is_new_launch')}")
            # Check for required fields
            required_fields = ['amenities', 'financing_options', 'features', 'images']
            for field in required_fields:
                if field in response:
                    print(f"   ✓ Has {field}")
                else:
                    print(f"   ⚠ Missing {field}")
        return success

    def test_property_filters(self):
        """Test property filtering"""
        # Test status filter
        success1, _ = self.run_test("Filter by Status (available)", "GET", "properties", 200, 
                                   params={"status": "available"})
        
        # Test new launch filter
        success2, _ = self.run_test("Filter by New Launch", "GET", "properties", 200, 
                                   params={"is_new_launch": "true"})
        
        # Test bedroom filter
        success3, _ = self.run_test("Filter by Bedrooms (3+)", "GET", "properties", 200, 
                                   params={"bedrooms": "3"})
        
        # Test price filter
        success4, _ = self.run_test("Filter by Price Range", "GET", "properties", 200, 
                                   params={"min_price": "200000", "max_price": "500000"})
        
        return all([success1, success2, success3, success4])

    def test_company_info(self):
        """Test getting company information"""
        success, response = self.run_test("Get Company Info", "GET", "company-info", 200)
        if success and isinstance(response, dict):
            print(f"   Company: {response.get('name')}")
            print(f"   Established: {response.get('established')}")
            print(f"   Experience: {response.get('years_of_experience')} years")
            # Check for required fields
            required_fields = ['values', 'contact', 'stats']
            for field in required_fields:
                if field in response:
                    print(f"   ✓ Has {field}")
                else:
                    print(f"   ⚠ Missing {field}")
        return success

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+357 99 123456",
            "property_interest": "Meca Twins",
            "message": "I am interested in learning more about this property."
        }
        
        success, response = self.run_test("Submit Contact Form", "POST", "contact", 200, data=test_data)
        if success and isinstance(response, dict):
            print(f"   Success: {response.get('success')}")
            print(f"   Message: {response.get('message')}")
            print(f"   ID: {response.get('id')}")
        return success

    def test_invalid_property_slug(self):
        """Test getting non-existent property"""
        success, _ = self.run_test("Get Invalid Property", "GET", "properties/non-existent-property", 404)
        return success

def main():
    print("🏠 Starting Evangelou & Frantzis Real Estate API Tests")
    print("=" * 60)
    
    tester = RealEstateAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_get_all_properties,
        tester.test_get_new_launches,
        tester.test_get_featured_properties,
        tester.test_get_property_by_slug,
        tester.test_property_filters,
        tester.test_company_info,
        tester.test_contact_form_submission,
        tester.test_invalid_property_slug,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
            tester.tests_run += 1
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())