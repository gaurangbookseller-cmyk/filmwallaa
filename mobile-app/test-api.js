const axios = require('axios');

// Test API connectivity
const BASE_URL = 'http://localhost:8001/api';

async function testAPI() {
  console.log('🧪 Testing Mobile App API Connectivity...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test featured movies
    console.log('\n2. Testing Featured Movies...');
    const moviesResponse = await axios.get(`${BASE_URL}/movies/featured`);
    console.log(`✅ Featured Movies: ${moviesResponse.data.length} movies loaded`);
    console.log('   Sample movie:', moviesResponse.data[0]?.title);
    
    // Test latest reviews
    console.log('\n3. Testing Latest Reviews...');
    const reviewsResponse = await axios.get(`${BASE_URL}/reviews/latest`);
    console.log(`✅ Latest Reviews: ${reviewsResponse.data.length} reviews loaded`);
    console.log('   Sample review:', reviewsResponse.data[0]?.title);
    
    // Test movie search
    console.log('\n4. Testing Movie Search...');
    const searchResponse = await axios.get(`${BASE_URL}/movies/search?q=Superman`);
    console.log(`✅ Search Results: ${searchResponse.data.length} results for "Superman"`);
    
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log('\n📱 Mobile App API Service Configuration:');
    console.log(`   Base URL: ${BASE_URL}`);
    console.log('   All endpoints accessible and returning data');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAPI();