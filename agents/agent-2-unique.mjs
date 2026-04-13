/**
 * AGENT 2 — UNIQUIFIER
 * Adiciona um hook único no topo de cada artigo (bloco "Você sabia?" / "Did you know?")
 * e varia as frases de transição nos parágrafos para evitar conteúdo duplicado.
 * Marca com <!-- a2 --> para não reprocessar.
 */
import fs from 'fs'
import path from 'path'

const BLOG_DIR = 'c:/Users/Notebook/tamowork-site/blog'
const MARKER = '<!-- a2 -->'

// ── Hook openers (PT) ─────────────────────────────────────────────────────────
const hooksPT = [
  (title) => `A maioria dos vendedores online nunca para para pensar em quanto dinheiro perde por mês por causa de fotos ruins. Se você está lendo este guia sobre "${title}", provavelmente já sabe que a resposta importa.`,
  (title) => `Existe uma regra não escrita no e-commerce brasileiro: quem tem melhores fotos vende mais. "${title}" é exatamente sobre isso — e os números comprovam.`,
  (title) => `Antes de gastar com tráfego pago, anúncio ou influencer, existe uma variável que afeta tudo e custa quase nada: a qualidade das suas fotos de produto. Este guia sobre "${title}" mostra o caminho mais curto.`,
  (title) => `Nos últimos 3 anos, o custo para ter fotos de produto profissionais caiu 97%. Não é exagero. IA mudou completamente essa conta. Leia este guia sobre "${title}" e entenda como aproveitar.`,
  (title) => `Se o seu produto não está vendendo como deveria, há 70% de chance de que o problema seja a foto — não o preço, não a descrição, não o frete. "${title}" vai te mostrar exatamente o que mudar.`,
  (title) => `Empresas que investem em fotos de produto profissionais crescem 2x mais rápido do que as que não investem. Este guia sobre "${title}" é o ponto de partida para esse crescimento.`,
  (title) => `Comprador não vê o produto. Vê a foto do produto. Essa diferença muda tudo — e é exatamente o que vamos explorar em "${title}".`,
  (title) => `Você tem menos de 3 segundos para convencer um comprador online a ficar na sua página. A foto de produto é quem faz (ou destrói) essa primeira impressão. Veja como dominar isso em "${title}".`,
  (title) => `O maior concorrente que você tem no e-commerce não é outro vendedor — é a desconfiança do comprador. Fotos profissionais eliminam essa barreira. É isso que discutimos em "${title}".`,
  (title) => `Há dois tipos de loja online: as que investem em fotos de qualidade e crescem, e as que não investem e ficam estagnadas. "${title}" é para quem escolheu crescer.`,
  (title) => `Resultado de pesquisa: 3 em cada 4 compradores online já abandonaram uma compra só porque a foto do produto era ruim. Não seja esse vendedor. Leia: "${title}".`,
  (title) => `Fotografia de produto costumava ser privilégio de grandes marcas. IA democratizou isso em 2024. Qualquer MEI, dropshipper ou sacoleira agora tem acesso ao mesmo padrão visual. Veja como em "${title}".`,
]

const hooksEN = [
  (title) => `Most online sellers never calculate how much revenue they lose monthly because of poor product photos. If you're reading "${title}", you're already ahead of them.`,
  (title) => `There's an unwritten rule in e-commerce: better photos win more sales. "${title}" is about exactly that — and the data backs it up completely.`,
  (title) => `Before spending on ads, influencers, or discounts, there's one variable that affects everything and costs almost nothing to fix: your product photos. This guide on "${title}" shows the fastest path.`,
  (title) => `AI dropped the cost of professional product photos by 97% in three years. That's not an exaggeration. "${title}" explains exactly how to take advantage of this shift.`,
  (title) => `If your product isn't selling as it should, there's a 70% chance the problem is the photo — not the price, not the description, not the shipping. "${title}" shows what to change.`,
  (title) => `Buyers don't see your product. They see the photo of your product. That distinction changes everything — and it's exactly what we cover in "${title}".`,
  (title) => `You have less than 3 seconds to convince a buyer to stay on your listing page. Your product photo is what makes or breaks that first impression. Here's how to master it: "${title}".`,
]

const hooksES = [
  (title) => `La mayoría de los vendedores online nunca calculan cuánto dinero pierden cada mes por tener fotos malas. Si estás leyendo "${title}", ya vas un paso adelante.`,
  (title) => `Existe una regla no escrita en el e-commerce: quien tiene mejores fotos vende más. "${title}" trata exactamente sobre eso — y los datos lo confirman.`,
  (title) => `Antes de gastar en publicidad o descuentos, hay una variable que afecta todo y casi no cuesta nada arreglar: la calidad de tus fotos de producto. Esta guía sobre "${title}" muestra el camino.`,
  (title) => `La IA redujo el costo de fotografía de producto profesional un 97% en tres años. "${title}" explica exactamente cómo aprovecharlo.`,
  (title) => `Los compradores no ven tu producto. Ven la foto de tu producto. Esa diferencia lo cambia todo — y es exactamente lo que abordamos en "${title}".`,
]

// ── Intro variations (replaces hero-intro) ────────────────────────────────────
const introVarsPT = [
  (base) => base,
  (base) => base.replace(/\. /g, '. Veja a seguir. ').slice(0, base.length),
  (base) => 'Neste guia completo você vai encontrar: ' + base,
  (base) => base + ' Com as estratégias certas, qualquer vendedor consegue esse resultado.',
  (base) => 'A boa notícia: ' + base.charAt(0).toLowerCase() + base.slice(1),
  (base) => base + ' Continue lendo para ver como aplicar na prática.',
]

function pickArr(arr, seed) { return arr[seed % arr.length] }
function hashSeed(str) { return str.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0) >>> 0 }

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
  const title = titleMatch ? titleMatch[1] : file.replace('.html', '')
  const seed = hashSeed(file)

  // 1. Unique hook block
  const hookPool = lang === 'pt-BR' ? hooksPT : (lang === 'en' ? hooksEN : hooksES)
  const hookFn = pickArr(hookPool, seed)
  const hookText = hookFn(title)
  const hookLabel = lang === 'pt-BR' ? '💡 Por que isso importa' : (lang === 'es' ? '💡 Por qué esto importa' : '💡 Why this matters')
  const hookHtml = `<div style="background:#0f1629;border:1px solid rgba(99,102,241,0.25);border-radius:16px;padding:22px 26px;margin:0 0 32px">
    <p style="font-size:12px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">${hookLabel}</p>
    <p style="font-size:16px;color:#c7d2e8;line-height:1.75;margin:0">${hookText}</p>
  </div>`

  // 2. Vary intro text slightly
  const introVarPool = lang === 'pt-BR' ? introVarsPT : introVarsPT
  const introFn = pickArr(introVarPool, seed + 7)
  html = html.replace(/(<p class="hero-intro">)([\s\S]*?)(<\/p>)/, (match, open, content, close) => {
    return open + introFn(content) + close
  })

  // 3. Insert hook at top of article
  html = html.replace('<div class="article">', '<div class="article">\n  ' + hookHtml)

  // 4. Add marker
  html = html.replace('</body>', MARKER + '\n</body>')

  fs.writeFileSync(fp, html, 'utf8')
  done++
}

console.log('✅ Agent 2 (Unique): ' + done + ' posts tornados únicos, ' + skip + ' já processados')
