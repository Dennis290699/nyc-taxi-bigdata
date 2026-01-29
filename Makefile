.PHONY: build up init down logs

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

init:
	chmod +x scripts/init.sh
	docker exec taxi-api chmod +x /opt/spark-apps/*.py
	./scripts/init.sh

start-all: build up
	sleep 10
	make init

status:
	docker-compose ps

help:
	@echo "Comandos disponibles:"
	@echo "  make build      - Construye las imágenes"
	@echo "  make up         - Levanta los contenedores"
	@echo "  make down       - Detiene y elimina los contenedores"
	@echo "  make start-all  - Construye, levanta e inicia el proceso completo"
	@echo "  make logs       - Muestra los logs en tiempo real"
	@echo "  make status     - Muestra el estado de los contenedores"
	@echo "  make init       - Ejecuta el script de inicialización de Spark"