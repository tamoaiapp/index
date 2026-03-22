# Como configurar a geração automática de 30 posts/dia

## 1. Instalar dependências

Abra o CMD dentro da pasta `scripts/` e rode:

```
npm install
```

## 2. Configurar sua chave da API Anthropic

Edite o arquivo `run-generator.bat` e substitua `COLOQUE_SUA_CHAVE_AQUI` pela sua chave real:

```
set ANTHROPIC_API_KEY=sk-ant-api03-...
```

Você pega a chave em: https://console.anthropic.com/settings/keys

## 3. Testar manualmente

Execute uma vez para confirmar que funciona:

```
cd scripts
run-generator.bat
```

Se tudo der certo, você verá o post publicado em https://tamowork.com/blog/

## 4. Agendar com Windows Task Scheduler (30 posts/dia = a cada 48 min)

### Passo a passo:

1. Pressione `Win + R` → digite `taskschd.msc` → Enter
2. No painel direito, clique em **"Create Task"**
3. Aba **General**:
   - Name: `TamoWork Blog Generator`
   - Marque: "Run whether user is logged on or not"
   - Marque: "Run with highest privileges"

4. Aba **Triggers** → New:
   - Begin the task: "On a schedule"
   - Settings: "Daily"
   - Start: hoje, horário que quiser (ex: 08:00)
   - Advanced Settings:
     - ✅ Repeat task every: **48 minutes**
     - for a duration of: **Indefinitely**

5. Aba **Actions** → New:
   - Action: "Start a program"
   - Program/script: `C:\Users\Notebook\tamowork-site\scripts\run-generator.bat`

6. Aba **Settings**:
   - ✅ "If the task is already running, do not start a new instance"

7. Clique **OK** e insira a senha do Windows se solicitado.

## 5. Verificar que está funcionando

Após configurar, veja a fila restante:
```
node -e "const q=JSON.parse(require('fs').readFileSync('topics-queue.json','utf8')); console.log('Pending:', q.pending.length, '| Generated:', q.generated.length);"
```

A cada 48 minutos, um novo post será publicado automaticamente em tamowork.com/blog/

## Fila atual

120 tópicos na fila. Com 30 posts/dia, todos serão publicados em ~4 dias.
Depois disso, basta adicionar mais tópicos ao `pending` em `topics-queue.json`.

## Custo estimado

- Modelo: claude-haiku-4-5 (~$0.001 por post)
- 30 posts/dia = ~$0.03/dia = ~$1/mês
