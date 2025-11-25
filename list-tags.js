#!/usr/bin/env node

import { N8nClient } from './dist/n8n-client.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new N8nClient(process.env.N8N_API_URL, process.env.N8N_API_KEY);

async function listTags() {
  try {
    console.log('📋 Listando tags...\n');
    const tags = await client.listTags();
    
    console.log(`Total: ${tags.length} tags\n`);
    
    tags.forEach((tag, i) => {
      console.log(`${i+1}. ${tag.name}`);
      console.log(`   ID: ${tag.id}`);
      console.log(`   Detalles:`, JSON.stringify(tag, null, 2));
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listTags();
