@echo off
echo ========================================================
echo   INICIANDO BACKEND API (NYC TAXI DASHBOARD)
echo ========================================================
echo.

cd /d "%~dp0..\api"

if not exist node_modules (
    echo [INFO] Instalando dependencias...
    npm install
)

echo.
echo [INFO] Iniciando servidor API en puerto 3000...
echo.

node src/app.js
