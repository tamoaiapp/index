/**
 * TamoWork Blog Post Generator
 * Generates one SEO-optimized blog post from the pending queue using Ollama (local, free).
 * Usage: node generate-post.js
 * Requires: Ollama running at localhost:11434 with llama3.2 or similar model installed.
 */

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const QUEUE_FILE = join(__dirname, "topics-queue.json");
const POSTS_JSON = join(ROOT, "blog", "posts.json");
const BLOG_INDEX = join(ROOT, "blog", "index.html");

// Ollama config — uses same local AI as TamoWork itself (free, no API key)
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(iso) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [y, m, d] = iso.split("-");
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function estimateReadTime(html) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round(words / 220));
}

function deriveTagsFromSlug(slug) {
  const map = {
    instagram: "Instagram", whatsapp: "WhatsApp", tiktok: "TikTok",
    ai: "AI", "local-ai": "Local AI", chatbot: "AI Chatbot", free: "Free",
    automation: "Automation", "small-business": "Small Business",
    salon: "Beauty Salon", restaurant: "Restaurant", fitness: "Fitness",
    fashion: "Fashion", ecommerce: "E-commerce", "real-estate": "Real Estate",
    bakery: "Bakery", "pet-shop": "Pet Shop", jewelry: "Jewelry",
    photography: "Photography", freelancer: "Freelancers",
  };
  const tags = [];
  for (const [key, label] of Object.entries(map)) {
    if (slug.includes(key)) tags.push(label);
    if (tags.length >= 3) break;
  }
  if (tags.length === 0) tags.push("AI Automation", "Small Business");
  return tags;
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(slug, title) {
  return `You are writing a long-form SEO blog post for TamoWork — a FREE AI employee for small businesses that runs 100% locally on Windows, auto-replies to Instagram comments/DMs and WhatsApp messages using Ollama + LLaMA 3.2 (no monthly fee, no cloud, no API key required to run the app).

Write a complete, self-contained HTML blog post file for this topic:
- Slug: ${slug}
- Title: ${title}

STRICT RULES:
1. Output ONLY the raw HTML — no markdown fences, no explanation, nothing before <!DOCTYPE html>.
2. The post must be 1000–1400 words of actual visible text (after stripping tags).
3. Write in English. Be practical and specific — give real steps, examples, stats.
4. Never call TamoWork a "bot" or "chatbot" — always "AI employee" or "AI worker".
5. Never mention a subscription, monthly fee, or API key requirement for TamoWork.
6. The only CTA is: <a href="https://tamowork.com" class="nav-btn">⬇ Download free</a> (nav) and <a href="https://tamowork.com" class="cta-btn">⬇ Download TamoWork Free</a> (end of post).
7. Include ALL SEO tags: canonical, og:title, og:description, og:url, og:type=article, twitter:card, twitter:title, twitter:description.
8. Include Schema.org JSON-LD for Article with author Organization "TamoWork".
9. Use the EXACT design system below — do not change colors, fonts, or CSS variable names.

DESIGN SYSTEM (copy exactly):
\`\`\`css
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07080b;--bg2:#0c1018;--card:#111820;--text:#eef2f9;--muted:#8394b0;--dim:#4e5c72;
  --line:rgba(255,255,255,0.07);--green:#16c784;
  --brand:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);
  --brand-soft:rgba(99,102,241,0.08);--brand-border:rgba(99,102,241,0.20);
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
.wrap{width:100%;max-width:1100px;margin:0 auto;padding:0 24px}
.nav{position:sticky;top:0;z-index:200;background:rgba(7,8,11,0.92);backdrop-filter:blur(24px);border-bottom:1px solid var(--line)}
.nav-inner{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.logo{font-size:19px;font-weight:900;letter-spacing:-.5px}
.logo span{background:var(--brand);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:14px;font-size:14px;font-weight:800;background:var(--brand);color:#fff;border:none;cursor:pointer;font-family:inherit;transition:.15s ease}
.nav-btn:hover{opacity:.88;transform:translateY(-1px)}
.hero{background:var(--bg2);border-bottom:1px solid var(--line);padding:72px 0 60px}
.hero-tag{display:inline-flex;align-items:center;gap:8px;background:var(--brand-soft);border:1px solid var(--brand-border);border-radius:999px;padding:6px 16px;font-size:12px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:1px;margin-bottom:24px}
.hero h1{font-size:clamp(28px,5vw,46px);font-weight:900;letter-spacing:-.5px;line-height:1.15;margin-bottom:20px;max-width:700px}
.hero h1 .brand{background:var(--brand);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:brand-shift 6s ease infinite}
@keyframes brand-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.hero-meta{display:flex;align-items:center;gap:20px;font-size:13px;color:var(--muted);margin-top:24px;flex-wrap:wrap}
.hero-meta span{display:flex;align-items:center;gap:6px}
.content{max-width:760px;margin:0 auto;padding:64px 24px 80px}
.content p{font-size:17px;color:var(--muted);margin-bottom:22px;line-height:1.8}
.content h2{font-size:26px;font-weight:800;color:var(--text);margin:48px 0 16px;letter-spacing:-.3px}
.content h3{font-size:20px;font-weight:700;color:var(--text);margin:32px 0 12px}
.content ul{margin:0 0 22px 0;padding-left:0;list-style:none}
.content ul li{font-size:17px;color:var(--muted);padding:8px 0 8px 28px;position:relative;border-bottom:1px solid var(--line);line-height:1.7}
.content ul li:last-child{border-bottom:none}
.content ul li::before{content:"→";position:absolute;left:0;color:#818cf8;font-weight:700}
.content strong{color:var(--text);font-weight:700}
.highlight{background:var(--brand-soft);border:1px solid var(--brand-border);border-radius:18px;padding:28px 32px;margin:36px 0}
.highlight p{margin:0;color:var(--text);font-size:17px;line-height:1.7}
.cta-box{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:48px 40px;text-align:center;margin:64px 0 0}
.cta-box h2{font-size:28px;font-weight:900;letter-spacing:-.3px;margin-bottom:14px}
.cta-box p{font-size:16px;color:var(--muted);margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto}
.cta-btn{display:inline-flex;align-items:center;gap:10px;padding:18px 36px;border-radius:16px;font-size:16px;font-weight:800;background:var(--brand);color:#fff;border:none;cursor:pointer;font-family:inherit;transition:.15s ease;box-shadow:0 12px 36px rgba(99,102,241,0.28)}
.cta-btn:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 18px 50px rgba(99,102,241,0.40)}
.footer{border-top:1px solid var(--line);padding:40px 0;text-align:center}
.footer p{font-size:13px;color:var(--dim)}
.footer a{color:var(--muted);transition:.15s}.footer a:hover{color:var(--text)}
\`\`\`

HTML STRUCTURE TEMPLATE (follow this exactly):
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>[TITLE]</title>
  <meta name="description" content="[150-160 char SEO description]"/>
  <link rel="canonical" href="https://tamowork.com/blog/${slug}.html"/>
  <meta property="og:title" content="[TITLE]"/>
  <meta property="og:description" content="[description]"/>
  <meta property="og:type" content="article"/>
  <meta property="og:url" content="https://tamowork.com/blog/${slug}.html"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="[TITLE]"/>
  <meta name="twitter:description" content="[description]"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[TITLE]",
    "description": "[description]",
    "author": {"@type": "Organization","name": "TamoWork"},
    "publisher": {"@type": "Organization","name": "TamoWork","url": "https://tamowork.com"},
    "datePublished": "${today()}",
    "url": "https://tamowork.com/blog/${slug}.html",
    "mainEntityOfPage": "https://tamowork.com/blog/${slug}.html"
  }
  </script>
  <style>
    [PASTE FULL CSS FROM DESIGN SYSTEM ABOVE]
  </style>
</head>
<body>
  <nav class="nav">
    <div class="wrap">
      <div class="nav-inner">
        <a href="https://tamowork.com" class="logo"><span>TamoWork</span></a>
        <a href="https://tamowork.com" class="nav-btn">⬇ Download free</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="wrap">
      <div class="hero-tag">📖 Blog</div>
      <h1>[H1 with one key word wrapped in <span class="brand">...]</h1>
      <div class="hero-meta">
        <span>🗓 ${formatDate(today())}</span>
        <span>⏱ [X] min read</span>
        <span>🏷 [Tag1] · [Tag2]</span>
      </div>
    </div>
  </section>

  <div class="content">
    [ARTICLE BODY: intro paragraph, then H2 sections, use .highlight boxes for key insights, use <ul> for lists, use <strong> for emphasis]

    <div class="cta-box">
      <h2>Ready to Put TamoWork to Work?</h2>
      <p>Free to download. Runs on your computer. No monthly fee, no cloud, no API key.</p>
      <a href="https://tamowork.com" class="cta-btn">⬇ Download TamoWork Free</a>
    </div>
  </div>

  <footer class="footer">
    <div class="wrap">
      <p><a href="https://tamowork.com">TamoWork</a> · Free AI employee for small businesses · <a href="/blog/">Blog</a></p>
    </div>
  </footer>
</body>
</html>
\`\`\`

Now write the full HTML file for the topic: "${title}"
Remember: output ONLY the raw HTML, starting with <!DOCTYPE html>.`;
}

// ─── Generate post via Ollama (local, free) ───────────────────────────────────

async function generatePost(slug, title) {
  console.log(`  Calling Ollama (${OLLAMA_MODEL}) for: ${title}`);

  const body = JSON.stringify({
    model: OLLAMA_MODEL,
    prompt: buildPrompt(slug, title),
    stream: false,
    options: {
      temperature: 0.7,
      num_predict: 8000,
    },
  });

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    // Long timeout — local models can take a few minutes
    signal: AbortSignal.timeout(300_000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  let html = (data.response || "").trim();

  // Strip markdown fences if model adds them
  html = html.replace(/^```html?\s*/i, "").replace(/\s*```$/, "").trim();

  // Validate it looks like HTML
  if (!html.startsWith("<!DOCTYPE") && !html.startsWith("<html")) {
    throw new Error("Ollama returned non-HTML content:\n" + html.slice(0, 400));
  }

  return html;
}

// ─── Update posts.json ────────────────────────────────────────────────────────

function addToPostsJson(slug, title, html) {
  const posts = readJson(POSTS_JSON);

  // Skip if already exists
  if (posts.find((p) => p.slug === slug)) {
    console.log(`  posts.json already has ${slug}, skipping`);
    return;
  }

  const tags = deriveTagsFromSlug(slug);
  const readTime = estimateReadTime(html);

  // Extract description from meta tag
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const description = descMatch ? descMatch[1] : title;

  posts.unshift({
    slug,
    title,
    description,
    date: today(),
    readTime,
    tags,
    url: `/blog/${slug}.html`,
  });

  writeJson(POSTS_JSON, posts);
  console.log(`  ✓ posts.json updated (${posts.length} posts total)`);
}

// ─── Update blog/index.html ───────────────────────────────────────────────────

function addToBlogIndex(slug, title, html) {
  let indexHtml = readFileSync(BLOG_INDEX, "utf8");

  // Skip if already exists
  if (indexHtml.includes(`/blog/${slug}.html`)) {
    console.log(`  blog/index.html already has ${slug}, skipping`);
    return;
  }

  const tags = deriveTagsFromSlug(slug);
  const readTime = estimateReadTime(html);
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const description = descMatch ? descMatch[1] : title;
  const tagBadges = tags.map((t) => `<span class="post-tag">${t}</span>`).join("");

  // Count existing posts
  const countMatch = indexHtml.match(/(\d+) articles/);
  const newCount = countMatch ? parseInt(countMatch[1]) + 1 : 1;

  const card = `
        <a href="/blog/${slug}.html" class="post-card">
          <div class="post-tags">${tagBadges}</div>
          <h2>${title}</h2>
          <p>${description}</p>
          <div class="post-meta"><span>🗓 ${formatDate(today())}</span><span>⏱ ${readTime} min read</span></div>
          <span class="post-link">Read post →</span>
        </a>`;

  // Insert new card at the top of the grid
  indexHtml = indexHtml.replace(
    /(<div class="posts-grid">)/,
    `$1\n${card}`
  );

  // Update article count
  indexHtml = indexHtml.replace(/\d+ articles/, `${newCount} articles`);

  writeFileSync(BLOG_INDEX, indexHtml, "utf8");
  console.log(`  ✓ blog/index.html updated (${newCount} articles)`);
}

// ─── Git commit & push ────────────────────────────────────────────────────────

function gitPush(slug, title) {
  try {
    execSync(`git -C "${ROOT}" add blog/${slug}.html blog/posts.json blog/index.html scripts/topics-queue.json`, { stdio: "pipe" });
    execSync(`git -C "${ROOT}" commit -m "blog: ${title}"`, { stdio: "pipe" });
    execSync(`git -C "${ROOT}" push`, { stdio: "pipe" });
    console.log(`  ✓ Pushed to GitHub`);
  } catch (err) {
    // If nothing to commit, that's fine
    if (err.message.includes("nothing to commit")) {
      console.log(`  ℹ Nothing to commit`);
    } else {
      console.error("  ✗ Git error:", err.message);
      throw err;
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  TamoWork Blog Post Generator");
  console.log("═══════════════════════════════════════");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("✗ ANTHROPIC_API_KEY not set. Export it first:");
    console.error("  set ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  // Load queue
  const queue = readJson(QUEUE_FILE);

  if (queue.pending.length === 0) {
    console.log("✓ All topics have been generated! Queue is empty.");
    process.exit(0);
  }

  // Pick next topic
  const topic = queue.pending[0];
  console.log(`\n→ Topic: ${topic.title}`);
  console.log(`  Slug:  ${topic.slug}`);
  console.log(`  Queue: ${queue.pending.length} pending, ${queue.generated.length} generated\n`);

  try {
    // 1. Generate HTML
    const html = await generatePost(topic.slug, topic.title);
    console.log(`  ✓ Generated ${html.length} chars of HTML`);

    // 2. Save HTML file
    const outPath = join(ROOT, "blog", `${topic.slug}.html`);
    writeFileSync(outPath, html, "utf8");
    console.log(`  ✓ Saved blog/${topic.slug}.html`);

    // 3. Update posts.json
    addToPostsJson(topic.slug, topic.title, html);

    // 4. Update blog/index.html
    addToBlogIndex(topic.slug, topic.title, html);

    // 5. Move topic from pending → generated
    queue.pending.shift();
    queue.generated.push({ ...topic, date: today() });
    writeJson(QUEUE_FILE, queue);
    console.log(`  ✓ Queue updated`);

    // 6. Git push
    gitPush(topic.slug, topic.title);

    console.log(`\n✓ Done! Post published: https://tamowork.com/blog/${topic.slug}.html`);
    console.log(`  ${queue.pending.length} topics remaining in queue.\n`);

  } catch (err) {
    console.error(`\n✗ Failed to generate post for "${topic.title}"`);
    console.error(err.message);
    process.exit(1);
  }
}

main();
