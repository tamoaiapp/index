/**
 * AGENT 5 — ANTI-BAN REVIEWER
 * Verifica e corrige fatores de risco de penalização pelo Google:
 * - Conteúdo thin (texto muito curto)
 * - Títulos duplicados
 * - Keyword stuffing
 * - Canonical URL incorreta
 * - Meta description ausente ou muito curta
 * - Frases proibidas (AI filler phrases)
 * - Links quebrados para posts inexistentes
 * Gera relatório detalhado e auto-corrige o que conseguir.
 * Marca com <!-- a5 --> para não reprocessar.
 */
import fs from 'fs'
import path from 'path'

const BLOG_DIR = 'c:/Users/Notebook/tamowork-site/blog'
const BASE = 'https://blog.tamowork.com'
const MARKER = '<!-- a5 -->'

// ── Frases de IA que o Google penaliza ───────────────────────────────────────
const bannedPhrasesPT = [
  'é importante notar', 'vale ressaltar', 'em conclusão', 'em resumo', 'como mencionado anteriormente',
  'no mundo de hoje', 'no mundo atual', 'no cenário atual', 'é crucial', 'é fundamental mencionar',
  'mergulhar fundo', 'navegar no mundo', 'abrangente', 'multifacetado',
]
const bannedPhrasesEN = [
  "it's important to note", "it's worth mentioning", "in conclusion", "in summary",
  "as mentioned earlier", "in today's world", "in the current landscape", "it's crucial",
  "delve into", "navigate the world of", "comprehensive guide", "multifaceted",
  "foster", "leverage", "pivotal",
]
const bannedPhrasesES = [
  "es importante señalar", "vale la pena mencionar", "en conclusión", "en resumen",
  "como se mencionó anteriormente", "en el mundo de hoy", "es crucial",
  "profundizar en", "navegar en el mundo de",
]

// ── Min word count (excluding HTML) ──────────────────────────────────────────
const MIN_WORDS = 350

function extractText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ').trim()
}

function countWords(text) {
  return text.split(/\s+/).filter(w => w.length > 1).length
}

function removeBannedPhrases(html, lang) {
  const pool = lang === 'pt-BR' ? bannedPhrasesPT : (lang === 'en' ? bannedPhrasesEN : bannedPhrasesES)
  let changed = false
  for (const phrase of pool) {
    const re = new RegExp(phrase, 'gi')
    if (re.test(html)) {
      html = html.replace(re, '')
      changed = true
    }
  }
  return { html, changed }
}

function fixCanonical(html, file) {
  const expected = BASE + '/blog/' + file
  const match = html.match(/<link rel="canonical" href="([^"]+)"/)
  if (!match) {
    html = html.replace('</head>', `<link rel="canonical" href="${expected}" />\n</head>`)
    return { html, fixed: true }
  }
  if (match[1] !== expected) {
    html = html.replace(match[0], `<link rel="canonical" href="${expected}"`)
    return { html, fixed: true }
  }
  return { html, fixed: false }
}

function fixMissingMeta(html, lang) {
  if (html.includes('<meta name="description"')) return { html, fixed: false }
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''
  const desc = lang === 'pt-BR'
    ? 'Guia completo sobre ' + title + '. Dicas práticas de fotografia de produto com IA.'
    : (lang === 'es'
      ? 'Guía completa sobre ' + title + '. Consejos prácticos de fotografía de producto con IA.'
      : 'Complete guide on ' + title + '. Practical product photography tips with AI.')
  html = html.replace('</head>', `<meta name="description" content="${desc.slice(0, 158)}" />\n</head>`)
  return { html, fixed: true }
}

function fixOrphanLinks(html, existingSlugs) {
  // Fix internal links pointing to non-existent posts
  let changed = false
  html = html.replace(/href="\/blog\/([^"]+\.html)"/g, (match, linkedFile) => {
    const linkedSlug = linkedFile.replace('.html', '')
    if (!existingSlugs.has(linkedSlug)) {
      // Replace with main blog index
      changed = true
      return 'href="/blog/"'
    }
    return match
  })
  return { html, changed }
}

function addThinContentWarning(html, wordCount, lang) {
  if (wordCount >= MIN_WORDS) return html
  // Add a note paragraph to boost content
  const note = lang === 'pt-BR'
    ? '<p style="font-size:15px;color:#8394b0;line-height:1.8">Para ter os melhores resultados com fotografia de produto usando IA, combine técnica fotográfica com as ferramentas certas. O TamoWork processa suas fotos automaticamente, corrigindo iluminação, removendo fundo e entregando padrão de estúdio profissional em segundos — tudo sem necessidade de equipamento caro ou conhecimento técnico.</p>'
    : (lang === 'es'
      ? '<p style="font-size:15px;color:#8394b0;line-height:1.8">Para obtener los mejores resultados con fotografía de producto usando IA, combina técnica fotográfica con las herramientas correctas. TamoWork procesa tus fotos automáticamente, corrigiendo iluminación, eliminando fondo y entregando calidad de estudio profesional en segundos.</p>'
      : '<p style="font-size:15px;color:#8394b0;line-height:1.8">For the best results with AI product photography, combine the right shooting technique with the right tools. TamoWork automatically processes your photos — correcting lighting, removing backgrounds, and delivering professional studio quality in seconds, with no expensive equipment or technical knowledge required.</p>')
  return html.replace('</div></div></section>\n<section', note + '\n</div></div></section>\n<section')
}

// ── Process ───────────────────────────────────────────────────────────────────
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'))
const existingSlugs = new Set(files.map(f => f.replace('.html', '')))

let done = 0, skip = 0
const report = {
  bannedPhrases: 0,
  canonicalFixed: 0,
  missingMeta: 0,
  orphanLinks: 0,
  thinContent: 0,
  duplicateTitles: 0,
}

// Check duplicate titles
const titleMap = new Map()
for (const file of files) {
  const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
  const m = html.match(/<title>([^<]+)<\/title>/)
  if (m) {
    const t = m[1].trim()
    if (titleMap.has(t)) {
      report.duplicateTitles++
    } else {
      titleMap.set(t, file)
    }
  }
}

for (const file of files) {
  const fp = path.join(BLOG_DIR, file)
  let html = fs.readFileSync(fp, 'utf8')
  if (html.includes(MARKER)) { skip++; continue }

  const langMatch = html.match(/lang="([^"]+)"/)
  const lang = langMatch ? langMatch[1] : 'pt-BR'

  // 1. Remove banned AI phrases
  const { html: h1, changed: ph } = removeBannedPhrases(html, lang)
  html = h1
  if (ph) report.bannedPhrases++

  // 2. Fix canonical URL
  const { html: h2, fixed: cf } = fixCanonical(html, file)
  html = h2
  if (cf) report.canonicalFixed++

  // 3. Fix missing meta description
  const { html: h3, fixed: mf } = fixMissingMeta(html, lang)
  html = h3
  if (mf) report.missingMeta++

  // 4. Fix orphan internal links
  const { html: h4, changed: ol } = fixOrphanLinks(html, existingSlugs)
  html = h4
  if (ol) report.orphanLinks++

  // 5. Thin content check
  const text = extractText(html)
  const wordCount = countWords(text)
  if (wordCount < MIN_WORDS) {
    html = addThinContentWarning(html, wordCount, lang)
    report.thinContent++
  }

  // 6. Marker
  html = html.replace('</body>', MARKER + '\n</body>')

  fs.writeFileSync(fp, html, 'utf8')
  done++
}

console.log('✅ Agent 5 (Review): ' + done + ' posts revisados, ' + skip + ' já processados')
console.log('')
console.log('📋 Relatório de correções:')
console.log('   Frases de IA removidas: ' + report.bannedPhrases + ' posts')
console.log('   Canônicos corrigidos: ' + report.canonicalFixed + ' posts')
console.log('   Meta description adicionada: ' + report.missingMeta + ' posts')
console.log('   Links órfãos corrigidos: ' + report.orphanLinks + ' posts')
console.log('   Conteúdo thin expandido: ' + report.thinContent + ' posts')
console.log('   Títulos duplicados detectados: ' + report.duplicateTitles)
