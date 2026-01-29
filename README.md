# 🚖 NYC Taxi Big Data Analytics

## 📋 Descripción del Proyecto

Este proyecto es una solución **End-to-End de Big Data** diseñada para procesar, analizar y visualizar millones de registros de viajes de taxis de Nueva York. Utiliza un stack moderno basado en contenedores para garantizar portabilidad y escalabilidad.

El sistema ingesta datos crudos (Parquet), los procesa con **Apache Spark** en un cluster **Hadoop**, expone los resultados a través de una **API REST (Node.js)** y los visualiza en un **Dashboard Interactivo (Next.js)**.

---

## 🏗️ Arquitectura del Sistema

El siguiente diagrama ilustra el flujo de datos desde la ingesta hasta la visualización:

```mermaid
graph TD
    subgraph "1. Ingesta de Datos"
        Local[Datos Locales (.parquet)] -->|load_to_hdfs.py| HDFS_Raw[HDFS: /raw/taxi-trips]
    end

    subgraph "2. Procesamiento (Spark)"
        HDFS_Raw -->|clean_data.py| Spark[Apache Spark Cluster]
        Spark -->|Limpieza| HDFS_Clean[HDFS: /processed/cleaned-trips]
        HDFS_Clean -->|analytics_advanced.py| HDFS_Analytics[HDFS: /analytics/v2/*.json]
    end

    subgraph "3. Capa de Servicios"
        HDFS_Analytics -->|WebHDFS| API[API REST (Node.js/Express)]
        API -->|JSON Response| Frontend[Frontend (Next.js/React)]
    end

    subgraph "4. Visualización"
        Frontend --> User[Usuario Final (Dashboard)]
    end

    style Spark fill:#f9f,stroke:#333,stroke-width:2px
    style HDFS_Analytics fill:#bbf,stroke:#333,stroke-width:2px
    style API fill:#dfd,stroke:#333,stroke-width:2px
```

---

## 📂 Organigrama de Directorios

Aquí tienes un mapa de alto nivel para navegar por el código fuente:

```bash
nyc-taxi-bigdata/
├── api/                  # 🟢 Código Fuente del Backend (Node.js)
│   ├── src/              # Lógica de rutas de la API (v1, v2)
│   └── package.json      # Dependencias del backend
├── fronted/              # 🎨 Código Fuente del Frontend (Next.js)
│   ├── app/              # Páginas y rutas (App Router)
│   ├── components/       # Gráficos (Recharts) y UI (Shadcn)
│   └── lib/              # Tipos y funciones de utilidad
├── spark-jobs/           # ⚡ Scripts de Procesamiento Python/Spark
│   ├── load_to_hdfs.py   # Carga de datos
│   ├── clean_data.py     # Limpieza
│   └── analytics_*.py    # Generación de métricas
├── scripts/              # 🤖 Scripts de Automatización y Utilidad
│   ├── init.sh           # Inicialización interna de contenedores
│   ├── verify_env.bat    # Script maestro de despliegue en Windows
│   └── check_api.bat     # Verificador de estado de API
├── data/                 # 📦 Datos Locales (Mapeados a Docker)
│   └── raw/              # Coloca aquí tus carpetas de años (ej. 2024, 2025)
├── docs/                 # 📚 Documentación Centralizada
│   └── index.md          # <-- PUNTO DE PARTIDA DOCUMENTAL
├── docker-compose.yml    # 🐳 Orquestación de contenedores
└── Makefile              # Atajos de comandos
```

---

## 📚 Documentación

Toda la documentación detallada se encuentra en el directorio `docs/`. Para una guía ordenada por rol del equipo, consulta:

👉 **[Índice de Documentación (docs/index.md)](docs/index.md)**

### Acceso Rápido por Rol:

*   **Ingenieros de Datos / DevOps**:
    *   [Guía de Despliegue y Comandos](docs/despliegue_comandos.md) (Cómo iniciar todo)
    *   [Scripts de Automatización](docs/scripts_automatizacion.md)
*   **Desarrolladores Backend**:
    *   [Documentación de API](docs/despliegue_comandos.md)
*   **Desarrolladores Frontend**:
    *   [Documentación de Frontend](docs/frontend_documentacion.md)

---

## 🚀 Inicio Rápido (Quick Start)

Para levantar todo el entorno desde cero en Windows:

1.  Asegúrate de tener **Docker Desktop** corriendo.
2.  Abre una terminal en la raíz del proyecto.
3.  Ejecuta:

    ```powershell
    docker-compose up -d --build
    .\scripts\verify_env.bat
    ```

4.  Espera unos minutos a que Spark procese los datos.
5.  Abre tu navegador en:
    *   **Dashboard**: [http://localhost:3001](http://localhost:3001)
    *   **Hadoop UI**: [http://localhost:9870](http://localhost:9870)
    *   **Spark Master**: [http://localhost:8080](http://localhost:8080)
