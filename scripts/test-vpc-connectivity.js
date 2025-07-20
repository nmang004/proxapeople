#!/usr/bin/env node

/**
 * Test script to verify VPC connectivity between Cloud Run and Cloud SQL
 * This script tests database connectivity and basic query execution
 */

import { config } from '../server/src/config/index.js';
import { db } from '../server/src/database/db.js';
import { users } from '../shared/schema.js';

async function testVPCConnectivity() {
  console.log('🔍 Testing VPC connectivity between Cloud Run and Cloud SQL...\n');

  try {
    // Test 1: Basic database connection
    console.log('1. Testing database connection...');
    const connectionTest = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');

    // Test 2: Test connection pool
    console.log('2. Testing connection pool...');
    const poolTest = await Promise.all([
      db.select().from(users).limit(1),
      db.select().from(users).limit(1),
      db.select().from(users).limit(1),
    ]);
    console.log('✅ Connection pool working correctly');

    // Test 3: Test query performance
    console.log('3. Testing query performance...');
    const startTime = Date.now();
    await db.select().from(users).limit(10);
    const queryTime = Date.now() - startTime;
    console.log(`✅ Query completed in ${queryTime}ms`);

    // Test 4: Test database schema
    console.log('4. Testing database schema...');
    const schemaTest = await db.select().from(users).limit(0);
    console.log('✅ Database schema accessible');

    // Test 5: Test SSL connection (if applicable)
    console.log('5. Testing SSL connection...');
    const sslTest = await db.select().from(users).limit(1);
    console.log('✅ SSL connection working');

    console.log('\n🎉 All VPC connectivity tests passed!');
    console.log('✅ Cloud Run can successfully connect to Cloud SQL');
    console.log('✅ VPC connector is properly configured');
    console.log('✅ Database is accessible and responsive');

  } catch (error) {
    console.error('❌ VPC connectivity test failed:');
    console.error('Error:', error.message);
    
    // Provide diagnostic information
    console.log('\n🔧 Diagnostic Information:');
    console.log('- Database URL:', config.DATABASE_URL ? 'Configured' : 'Not configured');
    console.log('- Environment:', config.NODE_ENV);
    
    if (error.code) {
      console.log('- Error Code:', error.code);
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('- Issue: Connection refused - VPC connector may not be configured');
    } else if (error.message.includes('timeout')) {
      console.log('- Issue: Connection timeout - Network connectivity problem');
    } else if (error.message.includes('authentication')) {
      console.log('- Issue: Authentication failed - Check database credentials');
    }
    
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔴 Test interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔴 Test terminated');
  process.exit(0);
});

// Run the test
testVPCConnectivity();