@echo off
echo ========================================================
echo   RE-PROCESAMIENTO DE ANALITICA (SPARK)
echo ========================================================
echo.
echo Este script ejecutara todos los jobs de Spark para actualizar
echo los dashboards con los datos mas recientes en HDFS.
echo.
echo 1. Limpieza de Datos (clean_data.py)
echo 2. Analitica Basica V1 (analytics_basic.py)
echo 3. Analitica Avanzada V2 (analytics_advanced.py)
echo.
pause

echo.
echo [1/3] Ejecutando limpieza de datos...
docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/clean_data.py > /opt/spark-apps/outputs/clean_data_refresh.log 2>&1"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo la limpieza. Revise spark-jobs/outputs/clean_data_refresh.log
    goto :end
) else (
    echo [OK] Limpieza completada.
)

echo.
echo [2/3] Ejecutando analitica basica...
docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_basic.py > /opt/spark-apps/outputs/analytics_basic_refresh.log 2>&1"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo analisis basico. Revise spark-jobs/outputs/analytics_basic_refresh.log
    goto :end
) else (
    echo [OK] Analitica basica completada.
)

echo.
echo [3/3] Ejecutando analitica avanzada (V2)...
docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_advanced.py > /opt/spark-apps/outputs/analytics_advanced_refresh.log 2>&1"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo analisis avanzado. Revise spark-jobs/outputs/analytics_advanced_refresh.log
    goto :end
) else (
    echo [OK] Analitica avanzada completada.
)

echo.
echo ========================================================
echo   PROCESO COMPLETADO EXITOSAMENTE
echo ========================================================
echo.
echo Los dashboards deberian mostrar datos actualizados ahora.
echo.

:end
echo Presione una tecla para salir...
pause > nul
