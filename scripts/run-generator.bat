@echo off
REM TamoWork Blog Post Generator
REM Run via Windows Task Scheduler every 48 minutes for 30 posts/day

set ANTHROPIC_API_KEY=COLOQUE_SUA_CHAVE_AQUI

cd /d "%~dp0"

echo [%date% %time%] Starting post generation...

node generate-post.js

echo [%date% %time%] Done.
