@echo off
echo ========================================================
echo   VERIFICACION DE ARCHIVOS EN HDFS
echo ========================================================
echo.
echo Listando contenido de: /data/nyc/raw/taxi-trips
echo.

docker exec hadoop-namenode hdfs dfs -ls -h /data/nyc/raw/taxi-trips

echo.
echo Nota: Si la lista esta vacia, el directorio no tiene datos.
echo.
echo Presione cualquier tecla para salir...
pause > nul
