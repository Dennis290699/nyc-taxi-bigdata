@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   ELIMINACION DE DATOS EN HDFS
echo ========================================================
echo.

if "%~1"=="" (
    echo [MENU] Seleccione una opcion:
    echo.
    echo 1. Eliminar TODO el dataset de taxis (Reset completo)
    echo 2. Eliminar una carpeta especifica dentro de /data/nyc/raw/
    echo 3. Cancelar
    echo.
    set /p op="Opcion: "
    
    if "!op!"=="1" goto delete_all
    if "!op!"=="2" goto delete_specific
    goto end
) else (
    if "%~1"=="all" goto delete_all
    goto delete_custom_arg
)

:delete_all
echo.
echo [WARNING] ESTA ACCION ELIMINARA TODOS LOS DATOS EN: /data/nyc/raw/taxi-trips
echo           Esta accion no se puede deshacer.
echo.
set /p confirm="Esta seguro? (s/n): "
if /i "!confirm!" neq "s" goto end

echo Eliminando...
docker exec hadoop-namenode hdfs dfs -rm -r /data/nyc/raw/taxi-trips
echo.
echo [INFO] Directorio eliminado.
echo Recreando directorio vacio para futuras cargas...
docker exec hadoop-namenode hdfs dfs -mkdir -p /data/nyc/raw/taxi-trips
docker exec hadoop-namenode hdfs dfs -chmod 777 /data/nyc/raw/taxi-trips
echo [OK] Sistema listo y limpio.
goto end

:delete_specific
echo.
echo Ingrese el nombre del subdirectorio o archivo a eliminar
echo (Ruta base: /data/nyc/raw/)
echo.
set /p target="Nombre: "
if "!target!"=="" goto end
goto do_delete_target

:delete_custom_arg
set target=%~1

:do_delete_target
echo.
echo Eliminando ruta: /data/nyc/raw/!target!
docker exec hadoop-namenode hdfs dfs -rm -r /data/nyc/raw/!target!
if %ERRORLEVEL% EQU 0 (
    echo [OK] Eliminado exitosamente.
) else (
    echo [ERROR] No se pudo eliminar. Verifique que el archivo exista.
)

:end
echo.
echo Finalizado.
if "%~1"=="" pause
