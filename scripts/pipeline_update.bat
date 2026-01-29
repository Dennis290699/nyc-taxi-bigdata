@echo off
echo ========================================================
echo   PIPELINE DE ACTUALIZACION COMPLETA (DATA -> DASHBOARD)
echo ========================================================
echo.
echo Este script automatiza todo el flujo de ingesta para nuevos archivos.
echo.
echo [PASO 1] Escaneando carpeta local 'data/nyc/raw' para nuevos archivos...
echo.

call scripts\load_new_data.bat
if %ERRORLEVEL% NEQ 0 goto :error

echo.
echo [PASO 2] Procesando y Recalculando Analitica en el Cluster...
echo.

call scripts\process_analytics.bat
if %ERRORLEVEL% NEQ 0 goto :error

echo.
echo ========================================================
echo   PIPELINE FINALIZADO
echo ========================================================
echo.
echo 1. Nuevos datos han sido cargados a HDFS.
echo 2. Spark ha limpiado y procesado las tablas.
echo 3. Los KPIs y Graficos han sido recalculados.
echo.
echo [PASO 3] Reiniciando API para reflejar cambios...
docker restart taxi-api
echo [OK] API Reiniciada.
echo.
echo Vaya al Dashboard y presione F5.
pause
goto :eof

:error
echo [ERROR] El pipeline se detuvo por un fallo en el paso anterior.
pause
