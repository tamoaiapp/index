# TamoWork — Project Context for Claude Code

## What is TamoWork

TamoWork is a **digital employee system powered by local AI** that runs directly on the user's computer (Windows, Mac, Linux). It automatically replies to Instagram comments, Instagram Direct DMs, and WhatsApp messages on behalf of small business owners.

**Core value propositions:**
- 100% free — no subscription, no monthly fee
- Local AI — no OpenAI API, no external server dependency
- Runs on any common computer with 4GB+ RAM
- No complicated setup — install and it works
- Privacy — all data stays on the user's PC

---

## Current Employees (Features)

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
--bg: #07080b          /* main background */
--bg2: #0c1018         /* section alt background */
--card: #111820        /* card background */
--text: #eef2f9        /* primary text */
--muted: #8394b0       /* secondary text */
--dim: #4e5c72         /* tertiary text */
--line: rgba(255,255,255,0.07)   /* borders */
--green: #16c784       /* success / active */
--brand: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)  /* TamoWork brand */
--ig: linear-gradient(135deg, #f58529, #dd2a7b, #8134af)     /* Instagram */
--wa: #25d366           /* WhatsApp */

Font: 'Outfit', sans-serif
Border radius: 14px (buttons), 18px (cards), 22px (large cards)
```

---

## File Structure

```
/
├── index.html          ← main landing page (PT/EN/ES)
├── blog/
│   ├── index.html      ← blog listing page
│   ├── posts.json      ← post manifest
│   └── [slug].html     ← individual posts
└── CLAUDE.md           ← this file
```

---

## Blog Posts — Rules

When generating blog posts, always follow these rules:

### SEO
- Title: max 60 characters, include main keyword
- Meta description: max 155 characters
- Use H2 and H3 headings to structure content
- Include Schema.org JSON-LD (Article type)
- Add canonical URL
- Target long-tail keywords related to: Instagram automation, WhatsApp automation, small business AI, reply automation

### Content
- Language: Portuguese (pt-BR) — natural, simple, direct
- Length: 800–1200 words
- Structure: intro → problem → solution → practical steps → CTA
- Mention TamoWork naturally 2–3 times as the solution (never force it)
- Include practical examples relevant to Brazilian small business owners
- Use HTML tags directly — no markdown in the post body

### HTML Template for Posts
Every post must include:
- Full `<head>` with SEO meta tags
- Nav with TamoWork logo + "⬇ Baixar grátis" button linking to tamowork.com
- Post hero section (dark bg2 background)
- Content section with max-width 760px
- CTA box at the end: "Automatize seu Instagram e WhatsApp agora"
- Footer
- Dark theme matching TamoWork design system above

### Blog Index
After creating a post, always update:
- `blog/index.html` — add the new post card
- `blog/posts.json` — add post metadata

---

## Good Blog Post Topics

High SEO potential topics to generate:

**Instagram:**
- como responder comentários do instagram automaticamente
- como automatizar direct message do instagram
- como nunca perder cliente no instagram
- ferramentas para gerenciar instagram de pequenos negócios
- como aumentar engajamento no instagram respondendo rápido

**WhatsApp:**
- como automatizar whatsapp para negócios
- como responder whatsapp sem ficar o dia todo no celular
- atendimento automatico whatsapp pequenas empresas
- como usar whatsapp business com inteligência artificial

**General AI:**
- inteligência artificial para pequenos negócios gratuita
- como usar ia no atendimento ao cliente
- funcionário digital para pequenos negócios
- automação de atendimento sem mensalidade

---

## What NOT to Do

- Never call TamoWork a "bot" or "chatbot"
- Never say it requires an API key or OpenAI account
- Never mention it has a monthly subscription
- Never use purple gradient on white backgrounds
- Never use Inter or Roboto fonts
- Never add unnecessary complexity to HTML files
- Never break the single-CTA rule — only one button: "⬇ Baixar grátis"

---

## CTA — Always Use This

```html
<a href="https://tamowork.com" class="nav-btn">⬇ Baixar grátis</a>
```

One CTA. One action. Download.

---

## Git Workflow

After making any change:
```bash
git add .
git commit -m "description of change"
git push
```

Vercel auto-deploys on every push to main branch.
Deploy takes ~10 seconds.

---

## Quick Commands for Claude Code

Generate a blog post:
> "Generate a SEO blog post about [TOPIC] following the rules in CLAUDE.md and save it to blog/[slug].html, then update blog/index.html and blog/posts.json"

Update landing page copy:
> "Update the hero headline in index.html to [NEW TEXT], keeping the existing design"

Fix a bug:
> "Fix [ISSUE] in index.html without changing the design or other functionality"
