from pyspark.sql import SparkSession
import sys

def main():
    spark = SparkSession.builder \
        .appName("SQL Playground") \
        .getOrCreate()
    
    # Desactivar logs ruidosos
    spark.sparkContext.setLogLevel("ERROR")

    print("\n--- INICIO SQL PLAYGROUND ---")
    print("Cargando tabla 'viajes' desde HDFS...")
    
    # 1. Cargar la tabla
    cleaned_path = "hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips"
    try:
        df = spark.read.parquet(cleaned_path)
        df.createOrReplaceTempView("viajes")
        print(f"Tabla 'viajes' registrada. Total filas: {df.count()}")
    except Exception as e:
        print(f"Error cargando datos: {e}")
        return

    # 2. Definir una consulta (puedes cambiar esto o pasarlo por argumento)
    # Por defecto, una consulta interesante: Top 5 de horas con más viajes en general
    default_query = """
        SELECT 
            hour(tpep_pickup_datetime) as hora,
            count(*) as num_viajes,
            round(avg(total_amount), 2) as costo_promedio
        FROM viajes
        WHERE year(tpep_pickup_datetime) >= 2020
        GROUP BY hora
        ORDER BY num_viajes DESC
        LIMIT 5
    """

    # Si el usuario pasa una query por argumento, la usamos
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        query = default_query

    print(f"\nEjecutando SQL:\n{query}\n")
    
    try:
        # 3. Ejecutar
        result = spark.sql(query)
        result.show(truncate=False)
    except Exception as e:
        print(f"Error en la consulta SQL: {e}")

    print("--- FIN ---")

if __name__ == "__main__":
    main()
