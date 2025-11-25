#!/usr/bin/env node

import { N8nClient } from './dist/n8n-client.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new N8nClient(process.env.N8N_API_URL, process.env.N8N_API_KEY);

async function verify() {
  try {
    console.log('🔍 Verificando conexión a n8n...\n');
    
    const workflows = await client.listWorkflows();
    console.log(`✅ Conexión exitosa!`);
    console.log(`📊 Total de workflows: ${workflows.length}\n`);
    
    if (workflows.length > 0) {
      console.log('📋 Primeros 10 workflows:');
      workflows.slice(0, 10).forEach((w, i) => {
        const status = w.active ? '🟢 Activo' : '⚪ Inactivo';
        console.log(`   ${i+1}. ${w.name} - ${status}`);
      });
    }
    
    console.log('\n✨ ¡Todo funcionando perfectamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();
