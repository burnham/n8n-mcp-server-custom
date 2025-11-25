#!/usr/bin/env node

import { N8nClient } from './dist/n8n-client.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new N8nClient(process.env.N8N_API_URL, process.env.N8N_API_KEY);
const WORKFLOW_ID = 'DNPAQ62Vo05IGrYX'; // ID del workflow #76
const TAG_ID = 'S7S15XDTzBUcDTzJ'; // ID del tag "🛠️ Antigravity MCP"

async function addTagToWorkflow76() {
  console.log('🏷️  Añadiendo tag "🛠️ Antigravity MCP" al Workflow #76...\n');

  try {
    // 1. Obtener el workflow actual
    console.log('📄 Obteniendo workflow actual...');
    const workflow = await client.getWorkflow(WORKFLOW_ID);
    console.log(`   Workflow: ${workflow.name}\n`);

    // 2. Actualizar con el tag
    console.log('🔄 Añadiendo tag...');
    const currentTags = workflow.tags || [];
    const tagIds = currentTags.map(t => typeof t === 'string' ? t : t.id);
    
    if (!tagIds.includes(TAG_ID)) {
      tagIds.push(TAG_ID);
      
      await client.updateWorkflow(WORKFLOW_ID, {
        tags: tagIds
      });
      
      console.log('✅ ¡Tag añadido exitosamente!\n');
      console.log('📋 Resultado:');
      console.log(`   Workflow: ${workflow.name}`);
      console.log(`   Tag añadido: 🛠️ Antigravity MCP`);
      console.log(`\n🌐 Ver en n8n: ${process.env.N8N_API_URL}/workflow/${WORKFLOW_ID}`);
    } else {
      console.log('ℹ️  El workflow ya tiene este tag asignado\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) console.error('Stack:', error.stack);
    process.exit(1);
  }
}

addTagToWorkflow76();
