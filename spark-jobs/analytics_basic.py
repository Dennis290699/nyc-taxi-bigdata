from pyspark.sql import SparkSession
from pyspark.sql.functions import hour, dayofmonth, avg

def main():
    spark = SparkSession.builder \
        .appName("Basic Analytics on NYC Taxi Data") \
        .getOrCreate()

    df = spark.read.parquet("hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")

    trips_by_hour = df.groupBy(hour("tpep_pickup_datetime").alias("hour")).count()
    trips_by_hour.write.mode('overwrite').json("hdfs://hadoop-namenode:8020/data/nyc/analytics/trips-by-hour")

    avg_fare = df.agg(avg("fare_amount").alias("average_fare"))
    avg_fare.write.mode('overwrite').json("hdfs://hadoop-namenode:8020/data/nyc/analytics/avg-fare")

if __name__ == "__main__":
    main()