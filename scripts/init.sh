#!/bin/bash

set -e

echo "🚀 Iniciando el sistema de análisis de viajes de taxi..."

# Esperar a que Hadoop esté listo
echo "⏳ Esperando a que HDFS esté listo..."
sleep 30

# Crear directorios en HDFS
echo "📁 Creando directorios en HDFS..."
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/raw
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/processed
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/analytics

# Verificar si los datos ya están cargados
echo "📊 Verificando si los datos raw ya existen en HDFS..."
if ! docker exec hadoop-namenode hdfs dfs -test -d /data/nyc/raw/taxi-trips; then
    echo "📥 Cargando datos en HDFS..."
    docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/load_to_hdfs.py
else
    echo "✅ Datos ya existen en HDFS."
fi

# Limpiar datos
echo "🧹 Ejecutando limpieza de datos..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/clean_data.py

# Ejecutar análisis básicos
echo "📈 Ejecutando análisis básicos..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_basic.py

# Ejecutar análisis intermedios
echo "📊 Ejecutando análisis intermedios..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_intermediate.py

# Ejecutar análisis avanzados (V2)
echo "🚀 Ejecutando análisis avanzados para API V2..."
docker exec spark-master spark-submit --master spark://spark-master:7077 /opt/spark-apps/analytics_advanced.py

echo "✅ Proceso de inicialización completado exitosamente."
echo "🌐 La API REST está disponible en http://localhost:3000/api"