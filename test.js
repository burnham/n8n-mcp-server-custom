#!/usr/bin/env node

/**
 * Test script to verify n8n MCP server functionality
 * Run with: node test.js
 */

import { N8nClient } from './dist/n8n-client.js';
import dotenv from 'dotenv';

dotenv.config();

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

console.log('🔧 N8n MCP Server Test');
console.log('='.repeat(50));

if (!N8N_API_URL || !N8N_API_KEY) {
  console.error('❌ Error: N8N_API_URL and N8N_API_KEY must be set');
  process.exit(1);
}

console.log(`✅ Configuration loaded`);
console.log(`   API URL: ${N8N_API_URL}`);
console.log(`   API Key: ${N8N_API_KEY.substring(0, 20)}...`);
console.log('');

const client = new N8nClient(N8N_API_URL, N8N_API_KEY);

async function runTests() {
  try {
    // Test 1: Connection
    console.log('📡 Testing connection...');
    try {
      const isConnected = await client.testConnection();
      console.log('DEBUG: testConnection returned:', isConnected);
      if (isConnected) {
        console.log('✅ Connection successful!');
      } else {
        console.log('❌ Connection failed - testConnection returned false');
        
        // Try manual test
        console.log('\n🔍 Attempting manual workflow list...');
        try {
          const workflows = await client.listWorkflows();
          console.log('✅ Manual test succeeded! Found', workflows.length, 'workflows');
        } catch (manualError) {
          console.log('❌ Manual test also failed:', manualError.message);
        }
        return;
      }
    } catch (connError) {
      console.log('❌ Connection failed with error:');
      console.log('   ', connError.message);
      console.log('Full error:', connError);
      return;
    }
    console.log('');

    // Test 2: List workflows
    console.log('📋 Fetching workflows...');
    const workflows = await client.listWorkflows();
    console.log(`✅ Found ${workflows.length} workflows:`);
    
    workflows.forEach((workflow, index) => {
      console.log(`   ${index + 1}. ${workflow.name} (ID: ${workflow.id})`);
      console.log(`      Status: ${workflow.active ? '🟢 Active' : '⚪ Inactive'}`);
      console.log(`      Updated: ${new Date(workflow.updatedAt).toLocaleString()}`);
    });
    console.log('');

    // Test 3: Get workflow details (if any exist)
    if (workflows.length > 0) {
      const firstWorkflow = workflows[0];
      console.log(`🔍 Getting details for: ${firstWorkflow.name}...`);
      const details = await client.getWorkflow(firstWorkflow.id);
      console.log(`✅ Workflow details retrieved:`);
      console.log(`   Name: ${details.name}`);
      console.log(`   Nodes: ${details.nodes?.length || 0}`);
      console.log(`   Active: ${details.active ? 'Yes' : 'No'}`);
      console.log('');

      // Test 4: Get executions
      console.log(`📊 Getting execution history for: ${firstWorkflow.name}...`);
      const executions = await client.getExecutions(firstWorkflow.id, 5);
      console.log(`✅ Found ${executions.length} recent executions`);
      
      executions.forEach((exec, index) => {
        console.log(`   ${index + 1}. Execution ${exec.id}`);
        console.log(`      Status: ${exec.finished ? '✅ Finished' : '⏳ Running'}`);
        console.log(`      Started: ${new Date(exec.startedAt).toLocaleString()}`);
      });
    }

    console.log('');
    console.log('='.repeat(50));
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('');
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check that your n8n instance is accessible');
    console.error('2. Verify your API key is correct and has not expired');
    console.error('3. Ensure N8N_API_URL has no trailing slash');
    console.error('4. Check network connectivity to your n8n instance');
    process.exit(1);
  }
}

runTests();
