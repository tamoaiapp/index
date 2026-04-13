/**
 * AGENT 3 — FAQ CREATOR
 * Gera 4 perguntas e respostas relevantes para cada post e injeta:
 * - Seção visual de FAQ no HTML
 * - Schema FAQPage JSON-LD (para rich results no Google)
 * Marca com <!-- a3 --> para não reprocessar.
 */
import fs from 'fs'
import path from 'path'

const BLOG_DIR = 'c:/Users/Notebook/tamowork-site/blog'
const MARKER = '<!-- a3 -->'

// ── FAQ pools por língua ──────────────────────────────────────────────────────
function getFAQs(lang, title, slug, seed) {
  const pick = (arr) => arr[seed % arr.length]

  if (lang === 'pt-BR') {
    const pools = [
      // Pool A
      [
        { q: 'Qual o melhor fundo para foto de produto?', a: 'O fundo branco puro (#FFFFFF) é o padrão do e-commerce. Elimina distrações, destaca o produto e é exigido por plataformas como Mercado Livre e Amazon na foto principal. Para fotos secundárias, fundos neutros (cinza claro, bege) também funcionam bem.' },
        { q: 'Preciso de câmera profissional para tirar foto de produto?', a: 'Não. Celulares atuais com câmera de 12MP+ produzem fotos de qualidade suficiente para qualquer marketplace. O que importa mais é a iluminação (luz natural da janela) e o fundo limpo. A IA do TamoWork corrige o restante automaticamente.' },
        { q: 'Quantas fotos por produto devo ter?', a: 'O mínimo recomendado é 4-5 fotos: frontal, lateral, verso, detalhe de qualidade/material e pelo menos uma foto em uso ou lifestyle. Produtos com 5+ fotos têm taxa de conversão 2-3x maior do que produtos com apenas 1 foto.' },
        { q: 'Como a IA melhora fotos de produto?', a: 'A IA analisa a imagem, detecta o produto, remove o fundo com precisão (preservando bordas e texturas), corrige a exposição e o balanço de branco, gera um novo fundo profissional e entrega a imagem em alta resolução — tudo em menos de 1 minuto.' },
      ],
      // Pool B
      [
        { q: 'Qual o tamanho ideal de foto de produto para marketplace?', a: 'Mínimo 1000x1000px para qualquer marketplace. O ideal é 1200x1200px a 2000x2000px para permitir zoom de qualidade. Formato quadrado (1:1) funciona para todas as plataformas principais. JPG para produtos sólidos, PNG para produtos que precisam de fundo transparente.' },
        { q: 'Foto de produto no celular fica boa o suficiente?', a: 'Sim, com as técnicas certas. Use luz natural da janela (não luz artificial amarelada), fundo branco limpo, e fotografe com o celular apoiado (sem tremer). Depois, o TamoWork faz o pós-processamento com IA para elevar ao padrão profissional.' },
        { q: 'Vale a pena contratar fotógrafo para e-commerce?', a: 'Para catálogos com renovação frequente ou volume acima de 20 produtos por mês, o fotógrafo profissional (R$30-80/foto) não é escalável. IA como o TamoWork cobre ilimitadamente por R$49/mês — ROI muito superior para lojistas de médio volume.' },
        { q: 'Como evitar devoluções por causa de foto diferente do produto real?', a: 'Fotografe com balanço de branco correto (luz natural ou LED 5000K) para garantir cores fiéis. Inclua foto de detalhes de textura e material. Adicione referência de tamanho (régua ou mão). Nunca aplique filtros que alterem cor significativamente.' },
      ],
      // Pool C
      [
        { q: 'Fundo colorido ou branco vende mais?', a: 'Depende do canal. Para foto principal em marketplace (ML, Shopee, Amazon): fundo branco sempre. Para Instagram e conteúdo lifestyle: fundos contextuais e coloridos funcionam melhor para engajamento. A estratégia ideal é fundo branco na foto principal + lifestyle nas fotos secundárias.' },
        { q: 'O TamoWork funciona para qualquer tipo de produto?', a: 'O TamoWork funciona muito bem para a maioria dos produtos sólidos: roupas, calçados, eletrônicos, cosméticos, acessórios, alimentos embalados, decoração, joias, brinquedos. Produtos com superfícies muito transparentes (vidro fino) ou com detalhes muito finos podem precisar de mais atenção.' },
        { q: 'Qual a diferença entre remoção de fundo normal e IA?', a: 'Ferramentas básicas de remoção de fundo recortam por cor — deixam halos, perdem detalhes de borda e falham em produtos com cor similar ao fundo. A IA usa segmentação semântica: entende que o objeto é um produto e preserva com precisão até fios de cabelo, rendas e bordas irregulares.' },
        { q: 'Preciso de muito tempo para processar meu catálogo?', a: 'Não. O TamoWork processa imagens em lote. Um catálogo de 50 produtos leva menos de 30 minutos — do upload ao download das imagens prontas. Isso inclui remoção de fundo, correção de iluminação e geração do fundo profissional para cada produto.' },
      ],
    ]
    return pick(pools)
  }

  if (lang === 'en') {
    const pools = [
      [
        { q: 'What is the best background for product photos?', a: 'Pure white (#FFFFFF) is the e-commerce standard. It eliminates distractions, makes products pop, and is required by Amazon and most major marketplaces for main product images. For secondary photos, light grey or lifestyle backgrounds work well.' },
        { q: 'Do I need a professional camera for product photography?', a: 'No. Modern smartphones with 12MP+ cameras produce quality sufficient for any marketplace. What matters most is lighting (natural window light) and a clean background. TamoWork AI handles the rest automatically.' },
        { q: 'How many photos should I have per product?', a: 'The recommended minimum is 4-5 photos: front, side, back, material/quality detail, and at least one lifestyle or in-use photo. Products with 5+ photos have 2-3x higher conversion rates than single-photo listings.' },
        { q: 'How does AI improve product photos?', a: 'AI analyzes the image, detects the product, removes the background with precision, corrects exposure and white balance, generates a professional backdrop, and delivers the result in high resolution — all in under one minute.' },
      ],
      [
        { q: 'What image size should I use for e-commerce listings?', a: 'Minimum 1000x1000px for any marketplace. Ideal is 1200x1200px to 2000x2000px to enable quality zoom. Square format (1:1) works across all major platforms. Use JPEG for solid products, PNG when you need a transparent background.' },
        { q: 'Can phone photos be good enough for product listings?', a: 'Yes, with the right techniques. Use natural window light (not yellow artificial light), a clean white background, and stabilize your phone to avoid blur. TamoWork then handles post-processing to elevate to professional standard.' },
        { q: 'Is it worth hiring a photographer for e-commerce?', a: 'For catalogs with frequent turnover or more than 20 products per month, a photographer ($30-80/photo) is not scalable. AI like TamoWork covers unlimited photos for $49/month — far better ROI for medium-volume sellers.' },
        { q: 'How do I prevent returns caused by photos not matching the real product?', a: 'Shoot with correct white balance (natural light or 5000K LED) to ensure accurate colors. Include texture and material detail shots. Add a size reference (ruler or hand). Never apply filters that significantly alter color.' },
      ],
    ]
    return pick(pools)
  }

  // ES
  const pools = [
    [
      { q: '¿Cuál es el mejor fondo para fotos de producto?', a: 'El fondo blanco puro (#FFFFFF) es el estándar del e-commerce. Elimina distracciones, destaca el producto y es requerido por plataformas como Mercado Libre y Amazon en la foto principal. Para fotos secundarias, fondos neutros (gris claro, beige) también funcionan bien.' },
      { q: '¿Necesito una cámara profesional para fotografiar productos?', a: 'No. Los celulares actuales con cámara de 12MP+ producen fotos de calidad suficiente para cualquier marketplace. Lo que más importa es la iluminación (luz natural de la ventana) y el fondo limpio. La IA de TamoWork corrige el resto automáticamente.' },
      { q: '¿Cuántas fotos por producto debo tener?', a: 'El mínimo recomendado es 4-5 fotos: frontal, lateral, trasera, detalle de calidad/material y al menos una foto en uso o lifestyle. Productos con 5+ fotos tienen una tasa de conversión 2-3x mayor que los que tienen solo 1 foto.' },
      { q: '¿Cómo mejora la IA las fotos de producto?', a: 'La IA analiza la imagen, detecta el producto, elimina el fondo con precisión, corrige la exposición y el balance de blancos, genera un fondo profesional y entrega la imagen en alta resolución — todo en menos de 1 minuto.' },
    ],
  ]
  return pick(pools)
}

function buildFAQSection(lang, faqs) {
  const h2 = lang === 'pt-BR' ? 'Perguntas frequentes' : (lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions')
  const itemsHtml = faqs.map((f, i) => `
    <div style="border-bottom:1px solid rgba(255,255,255,0.07);padding:20px 0${i === faqs.length - 1 ? ';border-bottom:none' : ''}">
      <p style="font-size:16px;font-weight:700;color:#e8edf8;margin-bottom:10px">❓ ${f.q}</p>
      <p style="font-size:15px;color:#8394b0;line-height:1.8;margin:0">${f.a}</p>
    </div>`).join('')
  return `<section style="background:#0c1018;border-top:1px solid rgba(255,255,255,0.07);border-bottom:1px solid rgba(255,255,255,0.07);padding:44px 0;margin:0">
  <div class="wrap">
    <h2 style="font-size:22px;font-weight:800;margin-bottom:8px">${h2}</h2>
    <div style="background:#111820;border-radius:16px;padding:0 24px">${itemsHtml}</div>
  </div>
</section>`
}

function buildFAQSchema(faqs, pageUrl) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  })
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
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''
  const slug = file.replace('.html', '')
  const seed = slug.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0) >>> 0

  const faqs = getFAQs(lang, title, slug, seed)
  const canonicalMatch = html.match(/href="([^"]+)" \/>/)
  const pageUrl = canonicalMatch ? canonicalMatch[1] : 'https://blog.tamowork.com/blog/' + file

  // 1. Insert FAQ section before .related section
  const faqSection = buildFAQSection(lang, faqs)
  html = html.replace('<section class="related">', faqSection + '\n<section class="related">')

  // 2. Insert FAQPage schema in <head>
  const faqSchema = '<script type="application/ld+json">' + buildFAQSchema(faqs, pageUrl) + '</script>'
  html = html.replace('</head>', faqSchema + '\n</head>')

  // 3. Marker
  html = html.replace('</body>', MARKER + '\n</body>')

  fs.writeFileSync(fp, html, 'utf8')
  done++
}

console.log('✅ Agent 3 (FAQ): ' + done + ' posts com FAQ, ' + skip + ' já processados')
