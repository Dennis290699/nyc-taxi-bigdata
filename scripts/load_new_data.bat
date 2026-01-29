@echo off
echo ========================================================
echo   CARGA INCREMENTAL DE DATOS A HDFS
echo ========================================================
echo.
echo Este script cargara (anexara) cualquier archivo Parquet nuevo encontrado
echo en el directorio local ./data/raw al sistema HDFS.
echo.
echo [INFO] Directorio origen: ./data/raw (mapeado a /opt/data/raw)
echo [INFO] Destino HDFS: /data/nyc/raw/taxi-trips
echo.
echo Iniciando proceso Spark...
echo.

docker exec spark-master sh -c "/spark/bin/spark-submit --master spark://spark-master:7077 /opt/spark-apps/load_to_hdfs.py > /opt/spark-apps/outputs/load_incremental.log 2>&1"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ocurrio un error durante la carga.
    echo         Revise el log: spark-jobs/outputs/load_incremental.log
) else (
    echo [OK] Proceso finalizado.
    echo.
    echo Verifique el reporte detallado recien generado en:
    echo data/outputs-data/load_report_YYYY-MM-DD...txt
)

echo.
echo Presione cualquier tecla para salir...
pause > nul
