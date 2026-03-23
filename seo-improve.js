const fs = require('fs');
const path = require('path');

const blogDir = 'c:/Users/Notebook/tamowork-site/blog';
const files = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(f => path.join(blogDir, f));

const alreadyDone = files.filter(f => {
  const c = fs.readFileSync(f, 'utf8');
  return c.includes('"FAQPage"');
});
console.log('Already processed:', alreadyDone.length);
const alreadyDoneSet = new Set(alreadyDone);
const toProcess = files.filter(f => !alreadyDoneSet.has(f));
console.log('To process:', toProcess.length);

let processed = 0, failed = 0;

for (const file of toProcess) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const langMatch = content.match(/<html[^>]+lang="([^"]+)"/);
    const lang = langMatch ? langMatch[1] : 'pt-BR';

    // --- Comparison block ---
    let compBlock;
    if (lang === 'en') {
      compBlock = `
    <div style="background:var(--card);border:1px solid var(--brand-border);border-radius:18px;padding:28px;margin:40px 0">
      <h2 style="font-size:18px;font-weight:800;margin-bottom:16px;color:var(--text)">TamoWork vs paid tools: the difference that matters</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:rgba(255,59,59,0.06);border:1px solid rgba(255,59,59,0.18);border-radius:14px;padding:18px">
          <div style="font-size:13px;font-weight:700;color:#f87171;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">❌ Paid tools</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px">
            <li>$30–100/month subscription</li>
            <li>Data sent to external servers</li>
            <li>Requires constant internet</li>
            <li>Cancel = lose everything</li>
          </ul>
        </div>
        <div style="background:rgba(22,199,132,0.06);border:1px solid rgba(22,199,132,0.18);border-radius:14px;padding:18px">
          <div style="font-size:13px;font-weight:700;color:#16c784;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">✅ TamoWork</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px">
            <li>100% free — no subscription</li>
            <li>Local AI on your computer</li>
            <li>Works offline after setup</li>
            <li>Your data stays with you</li>
          </ul>
        </div>
      </div>
    </div>`;
    } else if (lang === 'es') {
      compBlock = `
    <div style="background:var(--card);border:1px solid var(--brand-border);border-radius:18px;padding:28px;margin:40px 0">
      <h2 style="font-size:18px;font-weight:800;margin-bottom:16px;color:var(--text)">TamoWork vs herramientas de pago: la diferencia que importa</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:rgba(255,59,59,0.06);border:1px solid rgba(255,59,59,0.18);border-radius:14px;padding:18px">
          <div style="font-size:13px;font-weight:700;color:#f87171;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">❌ Herramientas de pago</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px">
            <li>$30–100/mes de suscripción</li>
            <li>Datos enviados a servidores externos</li>
            <li>Requiere internet constante</li>
            <li>Cancelar = perder todo</li>
          </ul>
        </div>
        <div style="background:rgba(22,199,132,0.06);border:1px solid rgba(22,199,132,0.18);border-radius:14px;padding:18px">
          <div style="font-size:13px;font-weight:700;color:#16c784;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">✅ TamoWork</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px">
            <li>100% gratuito — sin suscripción</li>
            <li>IA local en tu computadora</li>
            <li>Funciona offline tras la configuración</li>
            <li>Tus datos se quedan contigo</li>
          </ul>
        </div>
      </div>
    </div>`;
    } else {
      compBlock = `
    <div style="background:var(--card);border:1px solid var(--brand-border);border-radius:18px;padding:28px;margin:40px 0">
      <h2 style="font-size:18px;font-weight:800;margin-bottom:16px;color:var(--text)">TamoWork vs ferramentas pagas: a diferença que importa</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:rgba(255,59,59,0.06);border:1px solid rgba(255,59,59,0.18);border-radius:14px;padding:18px">
          <div style="font-size:13px;font-weight:700;color:#f87171;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">❌ Ferramentas pagas</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px">
            <li>R$ 200–500/mês de mensalidade</li>
            <li>Dados enviados para servidores externos</li>
            <li>Dependência de internet constante</li>
            <li>Cancelamento = perde tudo</li>
          </ul>
        </div>
        <div style="background:rgba(22,199,132,0.06);border:1px solid rgba(22,199,132,0.18);border-radius:14px;padding:18px">
          <div style="font-size:13px;font-weight:700;color:#16c784;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px">✅ TamoWork</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:6px">
            <li>100% gratuito — sem mensalidade</li>
            <li>IA local no seu computador</li>
            <li>Funciona offline após configuração</li>
            <li>Seus dados ficam com você</li>
          </ul>
        </div>
      </div>
    </div>`;
    }

    // --- FAQ block ---
    let faqH, q1, a1, q2, a2, q3, a3, q4, a4;
    if (lang === 'en') {
      faqH = 'Frequently Asked Questions';
      q1 = 'Is TamoWork really free?'; a1 = 'Yes, TamoWork is 100% free. No subscription, no setup fee, no per-message charge. Download once and use forever.';
      q2 = 'How long does setup take?'; a2 = 'About 30 minutes. Install TamoWork on your Windows computer, connect your Instagram or WhatsApp account, describe your business, and the AI employee starts working immediately.';
      q3 = 'Do I need to leave my computer on?'; a3 = 'Yes, TamoWork runs locally on your computer. For the AI employee to automatically reply to customers, your PC needs to be on and connected to the internet.';
      q4 = 'Does TamoWork work for any type of business?'; a4 = 'Yes. TamoWork was built for small businesses of all types — retail, services, food, beauty, fashion, and more. Configure your business information and the AI employee responds in a personalized way.';
    } else if (lang === 'es') {
      faqH = 'Preguntas Frecuentes';
      q1 = '¿TamoWork es realmente gratuito?'; a1 = 'Sí, TamoWork es 100% gratuito. Sin suscripción, sin tarifa de configuración, sin cobro por mensaje. Descárgalo una vez y úsalo para siempre.';
      q2 = '¿Cuánto tiempo toma la configuración?'; a2 = 'Aproximadamente 30 minutos. Instala TamoWork en tu computadora Windows, conecta tu cuenta de Instagram o WhatsApp, describe tu negocio y el empleado de IA comienza a trabajar de inmediato.';
      q3 = '¿Necesito dejar la computadora encendida?'; a3 = 'Sí, TamoWork funciona localmente en tu computadora. Para que el empleado de IA responda a los clientes automáticamente, tu PC debe estar encendida y conectada a internet.';
      q4 = '¿TamoWork funciona para cualquier tipo de negocio?'; a4 = 'Sí. TamoWork fue desarrollado para pequeños negocios de todos los tipos — comercio, servicios, alimentación, belleza, moda y mucho más. Configura la información de tu negocio y el empleado de IA responde de forma personalizada.';
    } else {
      faqH = 'Perguntas Frequentes';
      q1 = 'O TamoWork é realmente gratuito?'; a1 = 'Sim, o TamoWork é 100% gratuito. Sem mensalidade, sem taxa de setup, sem cobrança por mensagem. Você baixa uma vez e usa para sempre.';
      q2 = 'Quanto tempo leva para configurar?'; a2 = 'Em média 30 minutos. Você instala o TamoWork no seu computador Windows, conecta sua conta do Instagram ou WhatsApp, descreve seu negócio e o empregado de IA começa a trabalhar.';
      q3 = 'Preciso deixar o computador ligado?'; a3 = 'Sim, o TamoWork roda localmente no seu computador. Para que o empregado de IA responda os clientes automaticamente, o PC precisa estar ligado e conectado à internet.';
      q4 = 'O TamoWork funciona para qualquer tipo de negócio?'; a4 = 'Sim. O TamoWork foi desenvolvido para pequenos negócios brasileiros de todos os segmentos — comércio, serviços, alimentação, beleza, moda e muito mais. Você configura as informações do seu negócio e o empregado de IA responde de forma personalizada.';
    }

    const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const faqJsonLd = `  <script type="application/ld+json">\n  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"${esc(q1)}","acceptedAnswer":{"@type":"Answer","text":"${esc(a1)}"}},{"@type":"Question","name":"${esc(q2)}","acceptedAnswer":{"@type":"Answer","text":"${esc(a2)}"}},{"@type":"Question","name":"${esc(q3)}","acceptedAnswer":{"@type":"Answer","text":"${esc(a3)}"}},{"@type":"Question","name":"${esc(q4)}","acceptedAnswer":{"@type":"Answer","text":"${esc(a4)}"}}]}\n  </script>`;

    const faqBlock = `
    <div style="background:var(--card);border:1px solid var(--line);border-radius:18px;padding:28px;margin:40px 0">
      <h2 style="font-size:18px;font-weight:800;margin-bottom:20px;color:var(--text)">${faqH}</h2>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div><h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">${q1}</h3><p style="font-size:14px;color:var(--muted);margin:0;line-height:1.6">${a1}</p></div>
        <div><h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">${q2}</h3><p style="font-size:14px;color:var(--muted);margin:0;line-height:1.6">${a2}</p></div>
        <div><h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">${q3}</h3><p style="font-size:14px;color:var(--muted);margin:0;line-height:1.6">${a3}</p></div>
        <div><h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">${q4}</h3><p style="font-size:14px;color:var(--muted);margin:0;line-height:1.6">${a4}</p></div>
      </div>
    </div>`;

    // Insert FAQPage JSON-LD before </head>
    content = content.replace('</head>', faqJsonLd + '\n</head>');

    // Insert comparison block after first </h2> inside content-wrap
    const cwIdx = content.indexOf('class="content-wrap"');
    if (cwIdx !== -1) {
      const h2End = content.indexOf('</h2>', cwIdx);
      if (h2End !== -1) {
        content = content.slice(0, h2End + 5) + '\n' + compBlock + content.slice(h2End + 5);
      }
    }

    // Insert FAQ block before cta-box
    const ctaIdx = content.indexOf('<div class="cta-box">');
    if (ctaIdx !== -1) {
      content = content.slice(0, ctaIdx) + faqBlock + '\n\n    ' + content.slice(ctaIdx);
    }

    fs.writeFileSync(file, content, 'utf8');
    processed++;
    if (processed % 100 === 0) console.log('Processed:', processed, '/', toProcess.length);
  } catch(e) {
    failed++;
    console.error('Failed:', path.basename(file), e.message);
  }
}

console.log('\nDone! Processed:', processed, '| Failed:', failed, '| Total with FAQ:', processed + alreadyDone.length);
