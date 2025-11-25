#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

const WORKFLOW_ID = 'DNPAQ62Vo05IGrYX';
const TAG_ID = 'S7S15XDTzBUcDTzJ';

console.log('🏷️  Añadiendo tag al Workflow #76...\n');

async function addTag() {
  try {
    // 1. Get workflow
    console.log('📄 Obteniendo workflow...');
    const getResponse = await fetch(
      `${process.env.N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}`,
      {
        headers: {
          'X-N8N-API-KEY': process.env.N8N_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    
    const getJson = await getResponse.json();
    const workflow = getJson.data || getJson;
    console.log(`   Nombre: ${workflow.name}\n`);
    
    // 2. Update with tag
    console.log('🔄 Actualizando con tag...');
    const currentTags = workflow.tags || [];
    const tagIds = currentTags.map(t => typeof t === 'string' ? t : t.id);
    
    if (tagIds.includes(TAG_ID)) {
      console.log('ℹ️  El workflow ya tiene este tag');
      return;
    }
    
    tagIds.push(TAG_ID);
    
    const updateResponse = await fetch(
      `${process.env.N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}`,
      {
        method: 'PUT',
        headers: {
          'X-N8N-API-KEY': process.env.N8N_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name: workflow.name,
          nodes: workflow.nodes,
          connections: workflow.connections,
          settings: workflow.settings,
          tags: tagIds 
        })
      }
    );
    
    if (updateResponse.ok) {
      console.log('✅ ¡Tag añadido exitosamente!\n');
      console.log('📋 Detalles:');
      console.log(`   Workflow: ${workflow.name}`);
      console.log(`   Tag: 🛠️ Antigravity MCP`);
      console.log(`\n🌐 ${process.env.N8N_API_URL}/workflow/${WORKFLOW_ID}`);
    } else {
      const error = await updateResponse.text();
      console.error('❌ Error:', updateResponse.status, error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addTag();
