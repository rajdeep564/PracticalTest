const axios = require('axios');

async function testNewProductsAPI() {
  try {
    console.log('Testing updated products API...');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@gmail.com',
      password: '123456'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Test products endpoint
    const productsResponse = await axios.get('http://localhost:5000/api/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Products API successful');
    console.log('Products with images:');
    productsResponse.data.data.forEach(product => {
      console.log(`- ${product.name}: ${product.image}`);
    });
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testNewProductsAPI();
