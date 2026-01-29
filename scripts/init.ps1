Write-Host "🚀 Iniciando el sistema de análisis de viajes de taxi..." -ForegroundColor Cyan

# Dar permisos de ejecución a los scripts de Python dentro del contenedor
Write-Host "🔧 Configurando permisos en scripts..."
docker exec taxi-api chmod +x /opt/spark-apps/load_to_hdfs.py
docker exec taxi-api chmod +x /opt/spark-apps/clean_data.py
docker exec taxi-api chmod +x /opt/spark-apps/analytics_basic.py
docker exec taxi-api chmod +x /opt/spark-apps/analytics_intermediate.py

# Esperar a que Hadoop esté listo
Write-Host "⏳ Esperando 30 segundos a que HDFS esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Crear directorios en HDFS
Write-Host "📁 Creando directorios en HDFS..."
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/raw
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/processed
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/analytics

# Verificar si los datos ya están cargados
Write-Host "📊 Verificando si los datos raw ya existen en HDFS..."
docker exec hadoop-namenode hdfs dfs -test -d /data/nyc/raw/taxi-trips
$testResult = $LASTEXITCODE

if ($testResult -ne 0) {
    Write-Host "📥 Cargando datos en HDFS..." -ForegroundColor Yellow
    docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/load_to_hdfs.py
}

if ($testResult -eq 0) {
    Write-Host "✅ Datos ya existen en HDFS." -ForegroundColor Green
}

# Limpiar datos
Write-Host "🧹 Ejecutando limpieza de datos..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/clean_data.py

# Ejecutar análisis básicos
Write-Host "📈 Ejecutando análisis básicos..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_basic.py

# Ejecutar análisis intermedios
Write-Host "📊 Ejecutando análisis intermedios..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_intermediate.py

Write-Host "✅ Proceso de inicialización completado exitosamente." -ForegroundColor Green
Write-Host "🌐 La API REST está disponible en http://localhost:3000/api" -ForegroundColor Cyan
