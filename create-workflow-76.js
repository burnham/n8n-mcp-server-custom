#!/usr/bin/env node

import { N8nClient } from './dist/n8n-client.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new N8nClient(process.env.N8N_API_URL, process.env.N8N_API_KEY);

async function createWorkflow76() {
  console.log('🚀 Creando Workflow #76...\n');

  const workflowData = {
    name: 'Test MCP Server - Workflow 76',
    nodes: [
      {
        parameters: {},
        id: 'manual-trigger-1',
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          values: {
            string: [
              {
                name: 'mensaje',
                value: '¡Workflow creado exitosamente desde MCP Server!'
              },
              {
                name: 'fecha',
                value: '={{ $now.toISO() }}'
              },
              {
                name: 'test_id',
                value: '76'
              }
            ]
          },
          options: {}
        },
        id: 'set-node-1',
        name: 'Set Data',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.2,
        position: [450, 300]
      }
    ],
    connections: {
      'Manual Trigger': {
        main: [
          [
            {
              node: 'Set Data',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  };

  try {
    const result = await client.createWorkflow(workflowData);
    
    console.log('✅ ¡Workflow creado exitosamente!\n');
    console.log('📋 Detalles:');
    console.log(`   ID: ${result.id}`);
    console.log(`   Nombre: ${result.name}`);
    console.log(`   Activo: ${result.active ? 'Sí' : 'No'}`);
    console.log(`   Nodos: ${result.nodes?.length || 0}`);
    console.log('\n🎯 Ahora tienes 76 workflows en total!');
    console.log(`\n🌐 Ver en n8n: ${process.env.N8N_API_URL}/workflow/${result.id}`);
    
  } catch (error) {
    console.error('❌ Error al crear workflow:', error.message);
    process.exit(1);
  }
}

createWorkflow76();
