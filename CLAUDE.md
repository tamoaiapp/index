# TamoWork — Claude Code Project Instructions

## Auto Publish Rule

After creating or updating ANY file in this project, always run these commands automatically without asking for confirmation:

```bash
git add .
git commit -m "brief description of what changed"
git push
```

Vercel auto-deploys on every push. Never ask permission to push. Just do it.

---

## What is TamoWork

TamoWork is a **digital employee system powered by local AI** that runs directly on the user's computer (Windows, Mac, Linux). It automatically replies to Instagram comments, Instagram Direct DMs, and WhatsApp messages on behalf of small business owners.

**Core value propositions:**
- 100% free — no subscription, no monthly fee
- Local AI — no OpenAI API, no external server dependency
- Runs on any common computer with 4GB+ RAM
- No complicated setup — install and it works
- Privacy — all data stays on the user's PC

---

## Active Employees

| Employee | Channel | Status |
|---|---|---|
| Instagram Employee | Comments + Direct DMs | Active |
| WhatsApp Employee | Messages | Active |
| TikTok Employee | Comments + DMs | Coming soon |
| Email Employee | Inbox | Coming soon |

---

## Target Audience

Small Brazilian business owners who:
- Sell products or services on Instagram/WhatsApp
- Spend too much time manually replying to customers
- Cannot afford expensive SaaS tools
- Are not technical — need simple solutions

---

## Brand Voice

- **Direct and simple** — no jargon, no corporate language
- **Empowering** — "your employee works for you"
- **Anti-SaaS** — position against monthly subscriptions
- **Human** — "employee" not "bot" or "chatbot"

Key phrases to use:
- "funcionário de IA" (AI employee) — never "chatbot" or "bot"
- "seu computador" (your computer) — emphasize local execution
- "sem mensalidade" (no subscription)
- "já vem pronto" (ready out of the box)

---

## Tech Stack

- **Frontend:** Pure HTML/CSS/JS — no frameworks
- **Hosting:** Vercel (auto-deploy from GitHub)
- **Domain:** tamowork.com
- **Font:** Outfit (Google Fonts)
- **i18n:** Vanilla JS object — PT, EN, ES

---

## Design System

```css
--bg: #07080b;           /* main background */
--bg2: #0c1018;          /* section alt background */
--card: #111820;         /* card background */
--card2: #161e28;        /* card hover background */
--text: #eef2f9;         /* primary text */
--muted: #8394b0;        /* secondary text */
--dim: #4e5c72;          /* tertiary text */
--line: rgba(255,255,255,0.07);    /* borders */
--line2: rgba(255,255,255,0.12);   /* stronger borders */
--green: #16c784;        /* success / active status */

/* Brand gradients */
--brand: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);  /* TamoWork */
--ig: linear-gradient(135deg, #f58529, #dd2a7b, #8134af);      /* Instagram */
--wa: #25d366;           /* WhatsApp */

/* Typography */
Font: 'Outfit', sans-serif (Google Fonts)
Weights used: 400, 600, 700, 800, 900

/* Border radius */
Buttons: 14px
Cards: 18px
Large cards: 22px
CTA box: 28px
```

---

## File Structure

```
/
├── index.html              ← main landing page (PT/EN/ES i18n)
├── CLAUDE.md               ← this file
├── blog/
│   ├── index.html          ← blog listing page
│   ├── posts.json          ← post manifest [{slug, title, description, date}]
│   └── [slug].html         ← individual blog posts
```

---

## Single CTA Rule

There is only ONE call-to-action across the entire site:

```html
<a href="https://tamowork.com" class="nav-btn">⬇ Baixar grátis</a>
```

**Never add a second CTA. Never change this button text.**
All buttons lead to the same action: download.

---

## Blog Post Rules

### SEO Requirements
- Title: max 60 characters, include main keyword naturally
- Meta description: max 155 characters, compelling and keyword-rich
- H2 and H3 headings to structure content (great for SEO)
- Schema.org JSON-LD (Article type)
- Canonical URL pointing to tamowork.com/blog/[slug]
- Open Graph meta tags

### Content Rules
- Language: Portuguese (pt-BR) — natural, simple, direct
- Length: 800–1200 words
- Structure: hook intro → problem → solution → practical steps → CTA
- Mention TamoWork naturally 2–3 times as the solution (never force it)
- Include practical examples for Brazilian small business owners
- Write in HTML tags directly — no markdown in post body content
- Tone: helpful, no fluff, like a knowledgeable friend explaining things

### Slug Format
Convert title to slug:
- Lowercase
- Remove accents
- Replace spaces with hyphens
- Max 60 characters
- Example: "Como Automatizar Instagram" → `como-automatizar-instagram`

### Full Post HTML Template

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>[POST TITLE] — TamoWork Blog</title>
  <meta name="description" content="[META DESCRIPTION]"/>
  <meta name="keywords" content="[KEYWORDS]"/>
  <meta property="og:title" content="[POST TITLE]"/>
  <meta property="og:description" content="[META DESCRIPTION]"/>
  <meta property="og:url" content="https://tamowork.com/blog/[SLUG]"/>
  <meta property="og:type" content="article"/>
  <link rel="canonical" href="https://tamowork.com/blog/[SLUG]"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* use TamoWork design system */
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[POST TITLE]",
    "description": "[META DESCRIPTION]",
    "datePublished": "[YYYY-MM-DD]",
    "publisher": { "@type": "Organization", "name": "TamoWork", "url": "https://tamowork.com" },
    "url": "https://tamowork.com/blog/[SLUG]"
  }
  </script>
</head>
<body>
  <!-- nav with logo + download button -->
  <!-- post hero: category pill + h1 title + date + read time -->
  <!-- post content: max-width 760px -->
  <!-- CTA box at end: "Automatize seu Instagram e WhatsApp agora" -->
  <!-- footer -->
</body>
</html>
```

### After Creating Each Post

1. Save post to `blog/[slug].html`
2. Update `blog/posts.json` — prepend new post to the array:
```json
[
  {
    "slug": "post-slug",
    "title": "Post Title",
    "description": "Meta description text",
    "date": "22 de março de 2026"
  }
]
```
3. Regenerate `blog/index.html` with updated post list
4. Run git add, commit, push

---

## Blog Index Page Rules

`blog/index.html` must:
- Match TamoWork dark design
- Show all posts as cards in a grid
- Each card: date + title + description + "Ler post →" link
- Nav with logo + download button
- Be regenerated every time a new post is added

---

## High-Value SEO Topics

Generate posts on these topics for maximum organic traffic:

**Instagram automation:**
- como responder comentários do instagram automaticamente
- como automatizar direct message do instagram
- como nunca perder cliente no instagram
- como aumentar engajamento respondendo rápido no instagram
- melhor ferramenta para gerenciar instagram pequenos negócios

**WhatsApp automation:**
- como automatizar whatsapp para negócios
- como responder whatsapp sem ficar no celular o dia todo
- atendimento automatico whatsapp pequenas empresas
- como usar whatsapp com inteligência artificial gratis

**AI for business:**
- inteligência artificial gratis para pequenos negócios
- como usar ia no atendimento ao cliente
- funcionário digital para pequenos negócios
- automação de atendimento sem mensalidade

---

## What NOT To Do

- Never call TamoWork a "bot" or "chatbot" — always "funcionário de IA"
- Never say it requires an API key or OpenAI account
- Never mention monthly subscription costs
- Never use Inter, Roboto, or Arial fonts — always Outfit
- Never add a second CTA button
- Never use light backgrounds — always dark theme
- Never break the file structure
- Never commit without pushing
- Never ask for confirmation before pushing to GitHub

---

## Quick Command Examples

**Generate a blog post:**
```
Generate a SEO blog post about "como responder comentários do instagram automaticamente" 
following all rules in CLAUDE.md. Save to blog/[slug].html, 
update blog/posts.json and blog/index.html, then push to GitHub.
```

**Update landing page:**
```
Update the hero headline in index.html to "[NEW TEXT]" 
keeping the existing design, then push to GitHub.
```

**Fix a bug:**
```
Fix [ISSUE] in index.html without changing design or other functionality, then push.
```

**Generate multiple posts:**
```
Generate 3 SEO blog posts about [TOPIC 1], [TOPIC 2] and [TOPIC 3] 
following CLAUDE.md rules. Save each one, update the blog index, then push everything.
```
