@echo off
REM TamoWork Blog Post Generator — usa Ollama local (GRATIS, sem API key)
REM Run this via Windows Task Scheduler every 48 minutes for 30 posts/day

cd /d "%~dp0"

echo [%date% %time%] Starting post generation...

node generate-post.js

echo [%date% %time%] Done.
