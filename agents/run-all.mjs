/**
 * RUN ALL AGENTS em sequência
 * Uso: node agents/run-all.mjs
 */
import { execSync } from 'child_process'
import path from 'path'

const agents = [
  'agent-1-expand.mjs',
  'agent-2-unique.mjs',
  'agent-3-faq.mjs',
  'agent-4-seo.mjs',
  'agent-5-review.mjs',
]

const dir = 'c:/Users/Notebook/tamowork-site/agents'

for (const agent of agents) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('▶ Rodando: ' + agent)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    execSync('node ' + path.join(dir, agent), { stdio: 'inherit' })
  } catch (e) {
    console.error('❌ Erro em ' + agent + ':', e.message)
  }
}

console.log('\n✅ Todos os agentes concluídos.')
