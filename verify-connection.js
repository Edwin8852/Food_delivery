#!/usr/bin/env node
/**
 * Frontend-Backend Connection Verification Script
 * Run this to test if backend is accessible and has data
 */

import axios from 'axios';
import { spawn } from 'child_process';

const BACKEND_URL = 'http://localhost:5000';
const ENDPOINTS = [
  { name: 'Health Check', url: '/health', method: 'GET' },
  { name: 'Restaurants', url: '/api/restaurants', method: 'GET' },
  { name: 'Menu Items', url: '/api/menu-items', method: 'GET' },
];

console.log('\n╔════════════════════════════════════════════╗');
console.log('║   🚀 FOOD DELIVERY - CONNECTION TEST      ║');
console.log('╚════════════════════════════════════════════╝\n');

console.log(`Backend URL: ${BACKEND_URL}\n`);

const testEndpoint = async (endpoint) => {
  try {
    console.log(`Testing: ${endpoint.name}...`);
    const response = await axios.get(`${BACKEND_URL}${endpoint.url}`, {
      timeout: 5000
    });
    
    const dataCount = Array.isArray(response.data.data) ? response.data.data.length : 'N/A';
    const status = response.status === 200 ? '✅' : '⚠️';
    
    console.log(`${status} SUCCESS - Status: ${response.status}`);
    console.log(`   Data items: ${dataCount}`);
    
    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      const sample = response.data.data[0];
      console.log(`   Sample: ${JSON.stringify(sample).substring(0, 100)}...`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.message || 'Unknown'}`);
    }
    return false;
  }
};

const testAll = async () => {
  console.log(`Checking if backend is running on ${BACKEND_URL}...\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    passed += result ? 1 : 0;
    failed += result ? 0 : 1;
    console.log();
  }
  
  console.log('╔════════════════════════════════════════════╗');
  console.log(`║   Results: ✅ ${passed} passed | ❌ ${failed} failed       ║`);
  console.log('╚════════════════════════════════════════════╝\n');
  
  if (failed === 0) {
    console.log('✅ All tests passed! Frontend-Backend connection verified.\n');
  } else {
    console.log('❌ Some tests failed. Check the errors above.\n');
    console.log('Common solutions:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Verify port 5000 is not in use: npx lsof -i :5000');
    console.log('3. Check database connection: Ensure PostgreSQL is running\n');
  }
};

testAll();
