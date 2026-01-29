from pyspark.sql import SparkSession
import os
import datetime
import sys

def main():
    spark = SparkSession.builder \
        .appName("Load NYC Taxi Data to HDFS") \
        .getOrCreate()
        
    base_input_dir = "/opt/data/raw"
    base_hdfs_path = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips"
    report_dir = "/opt/data/outputs-data"
    
    # Ensure report dir exists
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)
        
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    report_file = f"{report_dir}/load_report_{timestamp}.txt"
    
    report_lines = []
    report_lines.append(f"=============================================")
    report_lines.append(f"   REPORTE DE CARGA DE DATOS (RECURSIVO)")
    report_lines.append(f"   Fecha: {timestamp}")
    report_lines.append(f"=============================================\n")
    
    success_count = 0
    error_count = 0
    total_files_found = 0
    
    # Traverse directory tree
    for root, dirs, files in os.walk(base_input_dir):
        parquet_files = [f for f in files if f.endswith('.parquet')]
        if not parquet_files:
            continue
            
        # Determine relative path to maintain structure
        # Example: if root is /opt/data/raw/data-2025, relative is data-2025
        rel_path = os.path.relpath(root, base_input_dir)
        
        # If file is in base dir, rel_path is '.', we map it to root of hdfs dest
        if rel_path == ".":
            target_hdfs_dir = base_hdfs_path
        else:
            # Append subfolder to HDFS path
            target_hdfs_dir = f"{base_hdfs_path}/{rel_path.replace(os.sep, '/')}"

        report_lines.append(f"Procesando directorio: {rel_path} -> {target_hdfs_dir}")

        for filename in parquet_files:
            total_files_found += 1
            full_local_path = os.path.join(root, filename)
            
            try:
                print(f"Cargando: {filename} en {target_hdfs_dir}...")
                df = spark.read.parquet(full_local_path)
                
                # Append to the specific sub-directory in HDFS
                df.write.mode('append').parquet(target_hdfs_dir)
                
                report_lines.append(f"[OK] {os.path.join(rel_path, filename)}")
                success_count += 1
            except Exception as e:
                error_msg = str(e).split('\n')[0]
                report_lines.append(f"[ERROR] {os.path.join(rel_path, filename)} - {error_msg}")
                error_count += 1
            
    report_lines.append(f"\n=============================================")
    report_lines.append(f"RESUMEN:")
    report_lines.append(f"   Exitosos: {success_count}")
    report_lines.append(f"   Fallidos: {error_count}")
    report_lines.append(f"   Total: {total_files_found}")
    report_lines.append(f"=============================================")
    
    write_report(report_file, report_lines)
    print(f"Reporte generado en: {report_file}")

def write_report(path, lines):
    with open(path, "w") as f:
        f.write("\n".join(lines))

if __name__ == "__main__":
    main()