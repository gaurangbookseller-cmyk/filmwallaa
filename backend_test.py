#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Filmwalla.com API
Tests all backend endpoints including health checks, movies, reviews, and TMDB integration
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Any

# Configuration
BASE_URL = "http://localhost:8001/api"
TIMEOUT = 30

class FilmwallaBackendTester:
    def __init__(self):
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": [],
            "test_details": []
        }
        
    def log_test(self, test_name: str, passed: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        self.results["total_tests"] += 1
        if passed:
            self.results["passed"] += 1
            status = "✅ PASS"
        else:
            self.results["failed"] += 1
            status = "❌ FAIL"
            self.results["errors"].append(f"{test_name}: {details}")
        
        test_result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        
        if response_data:
            test_result["response_sample"] = response_data
            
        self.results["test_details"].append(test_result)
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")
        print()

    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("=== Testing Health Check Endpoints ===")
        
        # Test root endpoint
        try:
            response = requests.get(f"{BASE_URL}/", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Filmwalla.com API" in data["message"]:
                    self.log_test("Root Endpoint (/api/)", True, f"Status: {response.status_code}, Message: {data['message']}")
                else:
                    self.log_test("Root Endpoint (/api/)", False, f"Unexpected response format: {data}")
            else:
                self.log_test("Root Endpoint (/api/)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Root Endpoint (/api/)", False, f"Request failed: {str(e)}")

        # Test health endpoint
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["status", "service", "version", "timestamp"]
                if all(field in data for field in required_fields):
                    self.log_test("Health Check (/api/health)", True, f"Status: {data['status']}, Service: {data['service']}")
                else:
                    self.log_test("Health Check (/api/health)", False, f"Missing required fields: {data}")
            else:
                self.log_test("Health Check (/api/health)", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Health Check (/api/health)", False, f"Request failed: {str(e)}")

    def test_movies_endpoints(self):
        """Test movies API endpoints"""
        print("=== Testing Movies API Endpoints ===")
        
        # Test featured movies
        try:
            response = requests.get(f"{BASE_URL}/movies/featured", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check movie structure
                        movie = data[0]
                        required_fields = ["id", "tmdb_id", "title", "year", "rating", "genre", "poster", "synopsis"]
                        missing_fields = [field for field in required_fields if field not in movie]
                        
                        if not missing_fields:
                            self.log_test("Featured Movies (/api/movies/featured)", True, 
                                        f"Returned {len(data)} movies", data[0])
                        else:
                            self.log_test("Featured Movies (/api/movies/featured)", False, 
                                        f"Missing fields in movie object: {missing_fields}")
                    else:
                        self.log_test("Featured Movies (/api/movies/featured)", True, 
                                    "Returned empty list (no movies in database)")
                else:
                    self.log_test("Featured Movies (/api/movies/featured)", False, 
                                f"Expected list, got: {type(data)}")
            else:
                self.log_test("Featured Movies (/api/movies/featured)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Featured Movies (/api/movies/featured)", False, f"Request failed: {str(e)}")

        # Test movie search
        try:
            search_query = "Avengers"
            response = requests.get(f"{BASE_URL}/movies/search", 
                                  params={"q": search_query}, timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Movie Search (/api/movies/search)", True, 
                                f"Search for '{search_query}' returned {len(data)} results")
                else:
                    self.log_test("Movie Search (/api/movies/search)", False, 
                                f"Expected list, got: {type(data)}")
            else:
                self.log_test("Movie Search (/api/movies/search)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Movie Search (/api/movies/search)", False, f"Request failed: {str(e)}")

        # Test movie search without query parameter
        try:
            response = requests.get(f"{BASE_URL}/movies/search", timeout=TIMEOUT)
            if response.status_code == 422:  # Validation error expected
                self.log_test("Movie Search Validation", True, 
                            "Correctly returned validation error for missing query parameter")
            else:
                self.log_test("Movie Search Validation", False, 
                            f"Expected 422 validation error, got: {response.status_code}")
        except Exception as e:
            self.log_test("Movie Search Validation", False, f"Request failed: {str(e)}")

    def test_reviews_endpoints(self):
        """Test reviews API endpoints"""
        print("=== Testing Reviews API Endpoints ===")
        
        # Test latest reviews
        try:
            response = requests.get(f"{BASE_URL}/reviews/latest", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check review structure
                        review = data[0]
                        required_fields = ["id", "movie_id", "title", "author", "content", "excerpt", 
                                         "rating", "tags", "read_time", "status"]
                        missing_fields = [field for field in required_fields if field not in review]
                        
                        if not missing_fields:
                            self.log_test("Latest Reviews (/api/reviews/latest)", True, 
                                        f"Returned {len(data)} reviews", data[0])
                        else:
                            self.log_test("Latest Reviews (/api/reviews/latest)", False, 
                                        f"Missing fields in review object: {missing_fields}")
                    else:
                        self.log_test("Latest Reviews (/api/reviews/latest)", True, 
                                    "Returned empty list (no reviews in database)")
                else:
                    self.log_test("Latest Reviews (/api/reviews/latest)", False, 
                                f"Expected list, got: {type(data)}")
            else:
                self.log_test("Latest Reviews (/api/reviews/latest)", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Latest Reviews (/api/reviews/latest)", False, f"Request failed: {str(e)}")

        # Test reviews with limit parameter
        try:
            response = requests.get(f"{BASE_URL}/reviews/latest", 
                                  params={"limit": 5}, timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) <= 5:
                    self.log_test("Reviews with Limit Parameter", True, 
                                f"Returned {len(data)} reviews (limit=5)")
                else:
                    self.log_test("Reviews with Limit Parameter", False, 
                                f"Expected max 5 reviews, got {len(data) if isinstance(data, list) else 'non-list'}")
            else:
                self.log_test("Reviews with Limit Parameter", False, 
                            f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Reviews with Limit Parameter", False, f"Request failed: {str(e)}")

    def test_tmdb_integration(self):
        """Test TMDB service integration"""
        print("=== Testing TMDB Integration ===")
        
        # Test if TMDB service is working by checking if featured movies have TMDB data
        try:
            response = requests.get(f"{BASE_URL}/movies/featured", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    movie = data[0]
                    # Check if movie has TMDB-specific fields
                    tmdb_fields = ["tmdb_id", "poster", "backdrop"]
                    has_tmdb_data = all(field in movie and movie[field] for field in tmdb_fields)
                    
                    if has_tmdb_data:
                        # Check if poster URL is from TMDB
                        poster_url = movie.get("poster", "")
                        if "image.tmdb.org" in poster_url:
                            self.log_test("TMDB Integration", True, 
                                        f"TMDB data present with valid poster URL: {poster_url[:50]}...")
                        else:
                            self.log_test("TMDB Integration", False, 
                                        f"Poster URL doesn't appear to be from TMDB: {poster_url}")
                    else:
                        self.log_test("TMDB Integration", False, 
                                    "Movies missing TMDB-specific data (tmdb_id, poster, backdrop)")
                else:
                    self.log_test("TMDB Integration", False, 
                                "No movies available to test TMDB integration")
            else:
                self.log_test("TMDB Integration", False, 
                            f"Could not fetch movies to test TMDB integration: {response.status_code}")
        except Exception as e:
            self.log_test("TMDB Integration", False, f"Request failed: {str(e)}")

    def test_database_connection(self):
        """Test MongoDB connectivity through API"""
        print("=== Testing Database Connection ===")
        
        # Test database connection by creating and retrieving a status check
        try:
            # Create a status check
            test_data = {"client_name": "backend_test"}
            response = requests.post(f"{BASE_URL}/status", 
                                   json=test_data, timeout=TIMEOUT)
            
            if response.status_code == 200:
                created_status = response.json()
                status_id = created_status.get("id")
                
                if status_id:
                    # Try to retrieve status checks
                    response = requests.get(f"{BASE_URL}/status", timeout=TIMEOUT)
                    if response.status_code == 200:
                        status_list = response.json()
                        if isinstance(status_list, list):
                            # Check if our created status is in the list
                            found = any(status.get("id") == status_id for status in status_list)
                            if found:
                                self.log_test("Database Connection", True, 
                                            f"Successfully created and retrieved status check with ID: {status_id}")
                            else:
                                self.log_test("Database Connection", False, 
                                            "Created status check not found in retrieved list")
                        else:
                            self.log_test("Database Connection", False, 
                                        f"Expected list from GET /status, got: {type(status_list)}")
                    else:
                        self.log_test("Database Connection", False, 
                                    f"Failed to retrieve status checks: {response.status_code}")
                else:
                    self.log_test("Database Connection", False, 
                                "Created status check missing ID field")
            else:
                self.log_test("Database Connection", False, 
                            f"Failed to create status check: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Database Connection", False, f"Request failed: {str(e)}")

    def test_cors_configuration(self):
        """Test CORS configuration"""
        print("=== Testing CORS Configuration ===")
        
        try:
            # Test preflight request
            headers = {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = requests.options(f"{BASE_URL}/health", headers=headers, timeout=TIMEOUT)
            
            # Check CORS headers in response
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if any(cors_headers.values()):
                self.log_test("CORS Configuration", True, 
                            f"CORS headers present: {cors_headers}")
            else:
                # Try a regular GET request and check for CORS headers
                response = requests.get(f"{BASE_URL}/health", headers={'Origin': 'http://localhost:3000'}, timeout=TIMEOUT)
                if 'Access-Control-Allow-Origin' in response.headers:
                    self.log_test("CORS Configuration", True, 
                                f"CORS enabled with Allow-Origin: {response.headers['Access-Control-Allow-Origin']}")
                else:
                    self.log_test("CORS Configuration", False, 
                                "No CORS headers found in response")
                    
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Request failed: {str(e)}")

    def test_error_handling(self):
        """Test error handling for invalid endpoints"""
        print("=== Testing Error Handling ===")
        
        # Test non-existent endpoint
        try:
            response = requests.get(f"{BASE_URL}/nonexistent", timeout=TIMEOUT)
            if response.status_code == 404:
                self.log_test("404 Error Handling", True, 
                            "Correctly returned 404 for non-existent endpoint")
            else:
                self.log_test("404 Error Handling", False, 
                            f"Expected 404, got: {response.status_code}")
        except Exception as e:
            self.log_test("404 Error Handling", False, f"Request failed: {str(e)}")

        # Test invalid movie ID
        try:
            response = requests.get(f"{BASE_URL}/movies/invalid_id", timeout=TIMEOUT)
            if response.status_code in [404, 422, 500]:  # Any of these are acceptable
                self.log_test("Invalid Movie ID Handling", True, 
                            f"Correctly handled invalid movie ID with status: {response.status_code}")
            else:
                self.log_test("Invalid Movie ID Handling", False, 
                            f"Unexpected status for invalid movie ID: {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Movie ID Handling", False, f"Request failed: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🎬 Starting Filmwalla.com Backend API Tests")
        print("=" * 60)
        print(f"Testing against: {BASE_URL}")
        print(f"Timeout: {TIMEOUT}s")
        print("=" * 60)
        print()
        
        # Wait a moment for backend to be fully ready
        time.sleep(2)
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_movies_endpoints()
        self.test_reviews_endpoints()
        self.test_tmdb_integration()
        self.test_database_connection()
        self.test_cors_configuration()
        self.test_error_handling()
        
        # Print summary
        self.print_summary()
        
        return self.results

    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("🎬 FILMWALLA BACKEND TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        
        if self.results['failed'] > 0:
            print(f"\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  • {error}")
        
        success_rate = (self.results['passed'] / self.results['total_tests']) * 100 if self.results['total_tests'] > 0 else 0
        print(f"\n📊 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Backend is functioning well!")
        elif success_rate >= 60:
            print("⚠️  Backend has some issues that need attention")
        else:
            print("🚨 Backend has significant issues that need immediate attention")
        
        print("=" * 60)

if __name__ == "__main__":
    tester = FilmwallaBackendTester()
    results = tester.run_all_tests()