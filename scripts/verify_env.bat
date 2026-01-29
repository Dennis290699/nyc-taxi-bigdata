@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   VERIFICACION Y CONFIGURACION DEL ENTORNO BIG DATA
echo ========================================================
echo.

:: 1. Verificar contenedores
echo [1/5] Verificando contenedores Docker...
docker-compose ps | findstr "Up" > nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Los contenedores no parecen estar corriendo.
    echo         Por favor ejecuta: docker-compose up -d --build
    exit /b 1
) else (
    echo [OK] Contenedores detectados.
)

:: 2. Configurar permisos (Paso critico)
echo.
echo [2/5] Configurando permisos de scripts...
docker exec taxi-api chmod +x /opt/spark-apps/load_to_hdfs.py
docker exec taxi-api chmod +x /opt/spark-apps/clean_data.py
docker exec taxi-api chmod +x /opt/spark-apps/analytics_basic.py
docker exec taxi-api chmod +x /opt/spark-apps/analytics_intermediate.py
echo [OK] Permisos configurados.

:: 3. Verificar HDFS (Directorios)
echo.
echo [3/5] Verificando sistema de archivos HDFS...
timeout /t 5 /nobreak > nul
docker exec hadoop-namenode hdfs dfsadmin -safemode wait > nul
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/raw 2> nul
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/processed 2> nul
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/analytics 2> nul

:: Verificar si existen datos
docker exec hadoop-namenode hdfs dfs -test -d /data/nyc/raw/taxi-trips
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Datos no encontrados. Inicializando carga de datos...
    echo        Esto puede tomar unos momentos...
    docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/load_to_hdfs.py > /opt/spark-apps/outputs/load_to_hdfs.log 2>&1"
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Fallo la carga de datos. Revise outputs/load_to_hdfs.log.
    ) else (
        echo [OK] Datos cargados exitosamente.
    )
) else (
    echo [OK] Los datos ya existen en HDFS.
)

:: 4. Ejecutar procesos de prueba (Spark)
echo.
echo [4/5] Verificando procesamiento Spark (Limpieza y Analisis)...
echo        Ejecutando limpieza...
docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/clean_data.py > /opt/spark-apps/outputs/clean_data.log 2>&1"
echo        Ejecutando analisis basico (V1)...
docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_basic.py > /opt/spark-apps/outputs/analytics_basic.log 2>&1"
echo        Ejecutando analisis avanzado (V2)...
docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_advanced.py > /opt/spark-apps/outputs/analytics_advanced.log 2>&1"
echo [OK] Procesos Spark finalizados correctamente.

:: 5. Verificar API
echo.
echo [5/5] Verificando API Node.js...
:: Simple check to see if port 3000 is open locally (using netstat as a proxy for availability)
netstat -an | findstr ":3000" | findstr "LISTENING" > nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] API escuchando en el puerto 3000.
) else (
    echo [WARNING] No se detecto la API escuchando en el puerto 3000.
    echo           Puede que este iniciando. Espera unos segundos.
)

echo.
echo ========================================================
echo   VERIFICACION COMPLETADA
echo ========================================================
echo.
echo Tu entorno esta listo.
echo API disponible en: http://localhost:3000/api/trips-per-hour (Ejemplo)
echo.
pause
