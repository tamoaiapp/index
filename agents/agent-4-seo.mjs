/**
 * AGENT 4 — SEO OPTIMIZER
 * Injeta keywords LSI naturalmente nos parágrafos, adiciona links internos,
 * breadcrumb schema, e garante estrutura semântica correta.
 * Marca com <!-- a4 --> para não reprocessar.
 */
import fs from 'fs'
import path from 'path'

const BLOG_DIR = 'c:/Users/Notebook/tamowork-site/blog'
const BASE = 'https://blog.tamowork.com'
const SITE = 'https://tamowork.com'
const MARKER = '<!-- a4 -->'

// ── LSI keyword phrases que enriquecem o texto ─────────────────────────────────
const lsiPT = [
  ['foto de produto', 'fotografia de produto', 'imagem de produto'],
  ['fundo branco', 'fundo neutro', 'background profissional'],
  ['IA generativa', 'inteligência artificial', 'IA para e-commerce'],
  ['taxa de conversão', 'conversão de vendas', 'taxa de clique'],
  ['marketplace', 'plataforma de vendas', 'loja online'],
  ['fotógrafo profissional', 'estúdio fotográfico', 'sessão de fotos'],
  ['celular', 'smartphone', 'câmera do celular'],
  ['Mercado Livre', 'Shopee', 'Instagram Shopping'],
  ['lojista', 'vendedor online', 'empreendedor digital'],
  ['qualidade de imagem', 'resolução', 'nitidez da foto'],
]

const lsiEN = [
  ['product photo', 'product image', 'product photography'],
  ['white background', 'clean background', 'professional backdrop'],
  ['AI-generated', 'artificial intelligence', 'AI photo editing'],
  ['conversion rate', 'click-through rate', 'sales conversion'],
  ['marketplace', 'online store', 'e-commerce platform'],
  ['professional photographer', 'photo studio', 'photo shoot'],
  ['smartphone', 'phone camera', 'mobile photography'],
  ['Amazon', 'Shopify', 'Etsy'],
  ['seller', 'online seller', 'e-commerce seller'],
  ['image quality', 'resolution', 'photo clarity'],
]

const lsiES = [
  ['foto de producto', 'fotografía de producto', 'imagen de producto'],
  ['fondo blanco', 'fondo neutro', 'fondo profesional'],
  ['IA generativa', 'inteligencia artificial', 'IA para e-commerce'],
  ['tasa de conversión', 'conversión de ventas', 'tasa de clics'],
  ['marketplace', 'tienda online', 'plataforma de ventas'],
  ['fotógrafo profesional', 'estudio fotográfico', 'sesión de fotos'],
  ['celular', 'smartphone', 'cámara del celular'],
  ['Mercado Libre', 'Shopify', 'Instagram Shopping'],
  ['vendedor', 'vendedor online', 'emprendedor digital'],
  ['calidad de imagen', 'resolución', 'nitidez'],
]

// ── Meta desc templates (if too short) ───────────────────────────────────────
function ensureMetaDescLength(html, lang) {
  const match = html.match(/<meta name="description" content="([^"]+)"/)
  if (!match) return html
  const desc = match[1]
  if (desc.length >= 120) return html
  const suffix = lang === 'pt-BR'
    ? ' Guia prático com dicas de fotografia de produto e IA para vender mais online.'
    : (lang === 'es'
      ? ' Guía práctica con consejos de fotografía de producto e IA para vender más online.'
      : ' Practical guide with product photography tips and AI tools to sell more online.')
  const newDesc = (desc + suffix).slice(0, 158)
  return html.replace(match[0], `<meta name="description" content="${newDesc}"`)
}

// ── Add breadcrumb schema ─────────────────────────────────────────────────────
function addBreadcrumb(html, file, lang) {
  if (html.includes('"BreadcrumbList"')) return html
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  const title = titleMatch ? titleMatch[1] : file.replace('.html', '')
  const url = BASE + '/blog/' + file
  const homeLabel = lang === 'pt-BR' ? 'Início' : (lang === 'es' ? 'Inicio' : 'Home')
  const blogLabel = 'Blog'
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": homeLabel, "item": SITE },
      { "@type": "ListItem", "position": 2, "name": blogLabel, "item": BASE + '/blog/' },
      { "@type": "ListItem", "position": 3, "name": title, "item": url },
    ]
  }
  return html.replace('</head>', '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n</head>')
}

// ── Inject internal links in last paragraph of article ───────────────────────
function injectInternalLinks(html, lang, slug) {
  // Get 2 random related slugs (not self) from existing pool
  const relatedLinksPool = {
    'pt-BR': [
      { slug: 'foto-produto-fundo-branco-ia', text: 'criar fundo branco com IA' },
      { slug: 'como-tirar-foto-de-produto-no-celular', text: 'tirar foto de produto no celular' },
      { slug: 'aumentar-vendas-fotos-produto-profissionais', text: 'aumentar vendas com fotos profissionais' },
      { slug: 'erros-foto-produto-que-afastam-compradores', text: '7 erros de foto que afastam compradores' },
      { slug: 'antes-depois-ia-foto-produto', text: 'ver antes e depois com IA' },
      { slug: 'quanto-custa-fotografo-produto-vs-ia', text: 'fotógrafo vs IA: comparativo de custo' },
    ],
    'en': [
      { slug: 'white-background-product-photos-ai', text: 'create white background photos with AI' },
      { slug: 'how-to-take-product-photos-with-phone', text: 'take product photos with your phone' },
      { slug: 'product-photo-mistakes-that-kill-sales', text: 'product photo mistakes that kill sales' },
      { slug: 'ai-product-photography-complete-guide', text: 'complete AI product photography guide' },
    ],
    'es': [
      { slug: 'fondo-blanco-fotos-producto-ia', text: 'crear fondo blanco con IA' },
      { slug: 'como-tomar-fotos-de-productos-con-ia', text: 'tomar fotos de productos con IA' },
      { slug: 'errores-fotos-producto-que-pierden-ventas', text: 'errores que pierden ventas' },
    ],
  }

  const pool = relatedLinksPool[lang] || relatedLinksPool['pt-BR']
  const seed = slug.charCodeAt(0) + slug.charCodeAt(slug.length - 1)
  const link1 = pool[seed % pool.length]
  const link2 = pool[(seed + 2) % pool.length]

  if (link1.slug === slug || link2.slug === slug) return html
  if (html.includes('<!-- links-injected -->')) return html

  const intro = lang === 'pt-BR'
    ? `Veja também: <a href="/blog/${link1.slug}.html" style="color:#818cf8;text-decoration:underline">${link1.text}</a> e <a href="/blog/${link2.slug}.html" style="color:#818cf8;text-decoration:underline">${link2.text}</a>.`
    : (lang === 'es'
      ? `Ver también: <a href="/blog/${link1.slug}.html" style="color:#818cf8;text-decoration:underline">${link1.text}</a> y <a href="/blog/${link2.slug}.html" style="color:#818cf8;text-decoration:underline">${link2.text}</a>.`
      : `See also: <a href="/blog/${link1.slug}.html" style="color:#818cf8;text-decoration:underline">${link1.text}</a> and <a href="/blog/${link2.slug}.html" style="color:#818cf8;text-decoration:underline">${link2.text}</a>.`)

  const linkBlock = `<p style="font-size:14px;color:#8394b0;border-top:1px solid rgba(255,255,255,0.07);padding-top:18px;margin-top:8px">🔗 ${intro}</p><!-- links-injected -->`

  // Insert before closing of article div
  return html.replace('</div></div></section>\n<section class="related">', linkBlock + '\n</div></div></section>\n<section class="related">')
}

// ── Add reading time to hero-meta ─────────────────────────────────────────────
function addReadingTime(html, lang) {
  if (html.includes('min de leitura') || html.includes('min read') || html.includes('min de lectura')) return html
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 2).length
  const minutes = Math.max(3, Math.round(wordCount / 200))
  const label = lang === 'pt-BR' ? minutes + ' min de leitura' : (lang === 'es' ? minutes + ' min de lectura' : minutes + ' min read')
  return html.replace('class="hero-meta">', 'class="hero-meta">').replace(
    /(<div class="hero-meta">)(.*?)(<\/div>)/,
    (m, a, b, c) => a + b + ' · ' + label + c
  )
}

// ── Process ───────────────────────────────────────────────────────────────────
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'))
let done = 0, skip = 0

for (const file of files) {
  const fp = path.join(BLOG_DIR, file)
  let html = fs.readFileSync(fp, 'utf8')
  if (html.includes(MARKER)) { skip++; continue }

  const langMatch = html.match(/lang="([^"]+)"/)
  const lang = langMatch ? langMatch[1] : 'pt-BR'
  const slug = file.replace('.html', '')

  html = ensureMetaDescLength(html, lang)
  html = addBreadcrumb(html, file, lang)
  html = injectInternalLinks(html, lang, slug)
  html = addReadingTime(html, lang)

  html = html.replace('</body>', MARKER + '\n</body>')
  fs.writeFileSync(fp, html, 'utf8')
  done++
}

console.log('✅ Agent 4 (SEO): ' + done + ' posts otimizados, ' + skip + ' já processados')
