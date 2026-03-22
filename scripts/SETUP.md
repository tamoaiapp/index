# Como configurar a geração automática de 30 posts/dia

## Custo: ZERO — usa o Ollama que o TamoWork já usa

Não precisa de API key, não gasta nada. O mesmo modelo LLaMA 3.2 que responde
clientes no Instagram/WhatsApp vai gerar os posts do blog.

---

## 1. Confirmar que o Ollama está instalado

Abra o CMD e rode:
```
ollama list
```

Se aparecer `llama3.2` na lista, está pronto.

Se não tiver o modelo, instale:
```
ollama pull llama3.2
```

---

## 2. Testar manualmente

```
cd c:\Users\Notebook\tamowork-site\scripts
node generate-post.js
```

O script vai:
1. Pegar o próximo tópico da fila
2. Chamar o Ollama localmente para gerar o HTML
3. Salvar em blog/[slug].html
4. Atualizar blog/posts.json e blog/index.html
5. Fazer git push → Vercel publica automaticamente

---

## 3. Agendar 30 posts/dia com Windows Task Scheduler

### Passo a passo:

1. Pressione `Win + R` → digite `taskschd.msc` → Enter
2. No painel direito: **"Create Task"**
3. Aba **General**:
   - Name: `TamoWork Blog Generator`
   - ✅ "Run whether user is logged on or not"
   - ✅ "Run with highest privileges"

4. Aba **Triggers** → New:
   - Begin: "On a schedule" → Daily
   - Start: hoje, qualquer horário (ex: 08:00)
   - Advanced Settings:
     - ✅ Repeat task every: **48 minutes**
     - for a duration of: **Indefinitely**

5. Aba **Actions** → New:
   - Action: "Start a program"
   - Program: `C:\Users\Notebook\tamowork-site\scripts\run-generator.bat`

6. Aba **Settings**:
   - ✅ "If the task is already running, do not start a new instance"

7. Clique **OK**.

---

## 4. Verificar fila restante

```
node -e "const q=JSON.parse(require('fs').readFileSync('topics-queue.json','utf8')); console.log('Pending:', q.pending.length, '| Generated:', q.generated.length);"
```

---

## Resumo

| Item | Detalhe |
|---|---|
| Custo | $0 — usa Ollama local |
| Modelo | llama3.2 (já instalado com TamoWork) |
| Velocidade | ~2-5 minutos por post |
| Posts por dia | 30 (a cada 48 minutos) |
| Tópicos na fila | 120 → 4 dias para gerar tudo |
| Deploy | Automático via Vercel (push no GitHub) |

Para usar outro modelo (mais rápido):
```
set OLLAMA_MODEL=llama3.2:1b
node generate-post.js
```
