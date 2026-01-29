@echo off
echo ========================================================
echo   VERIFICACION DE API NODE.JS
echo ========================================================
echo.
echo [1/3] Probando endpoint raiz (esperado error 404)...
curl -I http://localhost:3000/
echo.
echo [INFO] El error 404 en raiz es NORMAL. La API esta en /api
echo.

echo [2/3] Probando endpoint /api/trips-per-hour...
curl -s -o nul -w "Response Code: %%{http_code}" http://localhost:3000/api/trips-per-hour
echo.
echo       Contenido (primeros 100 caracteres):
curl -s http://localhost:3000/api/trips-per-hour | findstr /R "^.{0,100}"
echo.

echo [3/5] Probando endpoint /api/average-fare...
curl -s -o nul -w "Response Code: %%{http_code}" http://localhost:3000/api/average-fare
echo.
echo       Contenido (primeros 100 caracteres):
curl -s http://localhost:3000/api/average-fare | findstr /R "^.{0,100}"
echo.

echo [4/5] Probando endpoint V2 /api/v2/payment-stats...
curl -s -o nul -w "Response Code: %%{http_code}" http://localhost:3000/api/v2/payment-stats
echo.
echo       Contenido (primeros 100 caracteres):
curl -s http://localhost:3000/api/v2/payment-stats | findstr /R "^.{0,100}"
echo.

echo [5/5] Probando endpoint V2 /api/v2/top-zones...
curl -s -o nul -w "Response Code: %%{http_code}" http://localhost:3000/api/v2/top-zones
echo.
echo       Contenido (primeros 100 caracteres):
curl -s http://localhost:3000/api/v2/top-zones | findstr /R "^.{0,100}"
echo.

echo [6/6] Probando endpoint V2 /api/v2/system-stats (Dashboard Home)...
curl -s -o nul -w "Response Code: %%{http_code}" http://localhost:3000/api/v2/system-stats
echo.
echo       Contenido:
curl -s http://localhost:3000/api/v2/system-stats
echo.

echo ========================================================
echo   VERIFICACION FINALIZADA
echo ========================================================
pause
