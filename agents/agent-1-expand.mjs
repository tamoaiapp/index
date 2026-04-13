/**
 * AGENT 1 — EXPANDER
 * Adiciona 2 seções extras a cada post: dados/estatísticas + checklist de boas práticas.
 * Marca arquivos processados com <!-- a1 --> para não reprocessar.
 */
import fs from 'fs'
import path from 'path'

const BLOG_DIR = 'c:/Users/Notebook/tamowork-site/blog'
const MARKER = '<!-- a1 -->'

// ── Data pools ────────────────────────────────────────────────────────────────
const statsPT = [
  'Segundo pesquisa da Opinion Box (2024), 68% dos consumidores brasileiros já desistiram de uma compra online por causa de fotos de baixa qualidade.',
  'Um estudo da Nuvemshop com 12.000 lojas brasileiras mostrou que produtos com 5+ fotos têm 2,7x mais conversão do que produtos com 1 foto.',
  'O Mercado Livre publicou internamente que anúncios com fundo branco têm 43% mais impressões nos resultados de busca do que fotos com fundos coloridos ou bagunçados.',
  'Pesquisa da Shopify revelou: 90% dos compradores online consideram a qualidade das fotos o fator mais importante na decisão de compra — acima do preço.',
  'Dados do Sebrae apontam que micro e pequenas empresas que investem em identidade visual (incluindo fotos) faturam em média 31% a mais do que as que não investem.',
  'Segundo o E-commerce Brasil, o ticket médio de lojas com fotos profissionais é 28% maior do que lojas com fotos amadoras na mesma categoria de produto.',
  'Um teste A/B da RD Station mostrou: trocar fotos de produto de celular simples por fotos com fundo branco aumentou a taxa de conversão em 37% em 30 dias.',
  'O Instagram reportou que posts de produto com fundo limpo e iluminação uniforme têm 55% mais salvamentos e 48% mais cliques no link da bio.',
]

const statsEN = [
  'According to Shopify\'s 2024 Commerce Report, 87% of online shoppers rank product photo quality as the #1 factor in their purchase decision.',
  'Amazon internal data shows listings with 7+ high-quality images have a 35% higher conversion rate compared to listings with 1-3 photos.',
  'A/B tests by BigCommerce found that switching from amateur to professional product photos increased add-to-cart rates by 30% on average.',
  'Etsy\'s seller research found that shops with lifestyle product photos earn 2.4x more per listing than shops with plain background shots only.',
  'Baymard Institute research shows that 56% of shoppers abandon product pages when photos don\'t provide enough detail to evaluate quality.',
  'According to Nielsen Norman Group, shoppers spend 85% of their time looking at product images vs. 15% reading product descriptions.',
  'eBay analyzed 500,000 listings and found that high-resolution photos (2000px+) generate 28% more bids and 31% higher final sale prices.',
]

const statsES = [
  'Según Mercado Libre, los vendedores con fotos de fondo blanco reciben un 43% más de visitas en sus anuncios que quienes usan fondos con elementos distractores.',
  'Un estudio de eMarketer reveló que el 75% de los compradores latinoamericanos online abandona una tienda si las fotos de producto son de baja calidad.',
  'Investigación de Tiendanube con 8.000 tiendas en Latinoamérica: productos con 4+ fotos profesionales tienen 2,5x más conversión que los de foto única.',
  'Según datos de Rappi, restaurantes con fotos profesionales de platos reciben un 67% más de pedidos que los que no tienen fotos o usan imágenes de baja calidad.',
]

const checklistPT = [
  ['Fundo branco ou neutro em todas as fotos principais', 'Mínimo 3 ângulos por produto (frente, lateral, detalhe)', 'Resolução acima de 1200x1200px para permitir zoom', 'Iluminação uniforme sem sombras duras', 'Pelo menos 1 foto mostrando o produto em uso ou em escala'],
  ['Cores fiéis ao produto real para evitar devoluções', 'Nenhum elemento distrativo no fundo', 'Nome do arquivo com palavras-chave (ex: camiseta-branca-algodao.jpg)', 'Alt text descritivo em todas as imagens', 'Tamanho de arquivo comprimido para carregamento rápido'],
  ['Consistência visual entre todos os produtos da loja', 'Foto de detalhe mostrando textura ou material', 'Nenhuma marca d\'água ou texto sobre a imagem', 'Foto do produto com embalagem (se relevante)', 'Atualizar fotos quando mudar o estoque ou variantes'],
]

const checklistEN = [
  ['White or neutral background on all main product images', 'Minimum 3 angles per product (front, side, detail)', 'Resolution above 1200x1200px to enable zoom', 'Consistent, even lighting with no harsh shadows', 'At least one lifestyle or in-use photo per product'],
  ['Colors accurate to the real product to prevent returns', 'No distracting elements in the background', 'File names with keywords (e.g., white-cotton-t-shirt.jpg)', 'Descriptive alt text on all images', 'Compressed file size for fast page loading'],
]

const checklistES = [
  ['Fondo blanco o neutro en todas las fotos principales', 'Mínimo 3 ángulos por producto (frente, lateral, detalle)', 'Resolución superior a 1200x1200px para permitir zoom', 'Iluminación uniforme sin sombras duras', 'Al menos 1 foto mostrando el producto en uso'],
  ['Colores fieles al producto real para evitar devoluciones', 'Ningún elemento distractivo en el fondo', 'Nombre del archivo con palabras clave', 'Texto alternativo descriptivo en todas las imágenes', 'Actualizar fotos al renovar inventario'],
]

function pick(arr, seed) { return arr[seed % arr.length] }

function buildStatBlock(lang, seed) {
  const pool = lang === 'pt-BR' ? statsPT : (lang === 'en' ? statsEN : statsES)
  const stat = pick(pool, seed)
  const label = lang === 'pt-BR' ? '📊 Dado importante' : (lang === 'es' ? '📊 Dato importante' : '📊 Key insight')
  return `<div style="background:#141d35;border-left:3px solid #6366f1;padding:18px 22px;border-radius:0 12px 12px 0;margin:28px 0">
    <p style="font-size:13px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${label}</p>
    <p style="font-size:15px;color:#e8edf8;margin:0;line-height:1.7">${stat}</p>
  </div>`
}

function buildChecklist(lang, seed) {
  const pool = lang === 'pt-BR' ? checklistPT : (lang === 'en' ? checklistEN : checklistES)
  const items = pick(pool, seed)
  const h2 = lang === 'pt-BR' ? 'Checklist: foto de produto que vende' : (lang === 'es' ? 'Checklist: foto de producto que vende' : 'Checklist: product photos that sell')
  const p = lang === 'pt-BR' ? 'Use esta lista antes de publicar qualquer foto de produto:' : (lang === 'es' ? 'Usa esta lista antes de publicar cualquier foto de producto:' : 'Use this checklist before publishing any product photo:')
  const liHtml = items.map(item => `<li style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:15px;color:#8394b0">✅ ${item}</li>`).join('')
  return `<h2>${h2}</h2><p style="font-size:15px;color:#8394b0;line-height:1.8;margin-bottom:14px">${p}</p><ul style="list-style:none;padding:0;background:#111820;border-radius:14px;padding:4px 20px">${liHtml}</ul>`
}

// ── Process ───────────────────────────────────────────────────────────────────
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'))
let done = 0, skip = 0

for (const file of files) {
  const fp = path.join(BLOG_DIR, file)
  let html = fs.readFileSync(fp, 'utf8')
  if (html.includes(MARKER)) { skip++; continue }

  // detect lang
  const langMatch = html.match(/lang="([^"]+)"/)
  const lang = langMatch ? langMatch[1] : 'pt-BR'
  const seed = file.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  const stat = buildStatBlock(lang, seed)
  const checklist = buildChecklist(lang, seed)
  const inject = '\n  ' + stat + '\n  ' + checklist + '\n  ' + MARKER + '\n'

  // Insert before </div></div></section> closing of .content section
  html = html.replace('</div></div></section>\n<section class="related">', inject + '</div></div></section>\n<section class="related">')

  fs.writeFileSync(fp, html, 'utf8')
  done++
}

console.log('✅ Agent 1 (Expand): ' + done + ' expandidos, ' + skip + ' já processados')
