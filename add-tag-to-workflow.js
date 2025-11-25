#!/usr/bin/env node

import { N8nClient } from './dist/n8n-client.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new N8nClient(process.env.N8N_API_URL, process.env.N8N_API_KEY);
const WORKFLOW_ID = 'DNPAQ62Vo05IGrYX'; // ID del workflow #76
const TAG_NAME = '🛠️ Antigravity MCP';

async function addTagToWorkflow() {
  console.log('🏷️  Añadiendo tag al Workflow #76...\n');

  try {
    // 1. Listar tags existentes
    console.log('📋 Listando tags existentes...');
    const existingTags = await client.listTags();
    console.log(`   Encontrados ${existingTags.length} tags\n`);

    // 2. Buscar si el tag ya existe
    let tagId = existingTags.find(tag => tag.name === TAG_NAME)?.id;
    
    if (!tagId) {
      console.log(`🔧 Tag "${TAG_NAME}" no existe, creándolo...`);
      const newTag = await client.createTag({ name: TAG_NAME });
      tagId = newTag.id;
      console.log(`✅ Tag creado con ID: ${tagId}\n`);
    } else {
      console.log(`✅ Tag "${TAG_NAME}" ya existe (ID: ${tagId})\n`);
    }

    // 3. Obtener el workflow actual
    console.log('📄 Obteniendo workflow actual...');
    const workflow = await client.getWorkflow(WORKFLOW_ID);

    // 4. Actualizar con el tag
    console.log('🔄 Añadiendo tag al workflow...');
    const currentTags = workflow.tags || [];
    const tagIds = currentTags.map(t => t.id || t);
    
    if (!tagIds.includes(tagId)) {
      tagIds.push(tagId);
      
      await client.updateWorkflow(WORKFLOW_ID, {
        tags: tagIds
      });
      
      console.log('✅ ¡Tag añadido exitosamente!\n');
      console.log('📋 Detalles:');
      console.log(`   Workflow: ${workflow.name}`);
      console.log(`   Tag: ${TAG_NAME}`);
      console.log(`\n🌐 Ver en n8n: ${process.env.N8N_API_URL}/workflow/${WORKFLOW_ID}`);
    } else {
      console.log('ℹ️  El workflow ya tiene este tag asignado\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

addTagToWorkflow();
