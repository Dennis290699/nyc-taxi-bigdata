@echo off
echo ========================================================
echo   INICIANDO FRONTEND (NYC TAXI DASHBOARD)
echo ========================================================
echo.

cd /d "%~dp0..\fronted"

if not exist node_modules (
    echo [INFO] Instalando dependencias -primera vez-...
    echo        Esto puede tardar unos minutos...
    npm install
)

echo.
echo [INFO] Iniciando servidor de desarrollo Next.js en puerto 3001...
echo        Accede a: http://localhost:3001
echo.
echo Presione Ctrl+C para detener el servidor.
echo.

npm run dev
