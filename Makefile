# CRM-ERP Collector System Makefile

.PHONY: help build up down dev logs clean

# Default target
help:
	@echo "CRM-ERP Collector System"
	@echo "======================="
	@echo ""
	@echo "Available commands:"
	@echo "  make dev     - Start development environment"
	@echo "  make build   - Build all Docker images"
	@echo "  make up      - Start production environment"
	@echo "  make down    - Stop all services"
	@echo "  make logs    - Show logs from all services"
	@echo "  make clean   - Clean up containers and volumes"
	@echo ""

# Development environment
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up --build

# Production environment
up:
	@echo "Starting production environment..."
	docker-compose up --build -d

# Build all images
build:
	@echo "Building all Docker images..."
	docker-compose build

# Stop all services
down:
	@echo "Stopping all services..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# Show logs
logs:
	@echo "Showing logs from all services..."
	docker-compose logs -f

# Clean up
clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f

# Database operations
db-migrate:
	@echo "Running database migrations..."
	docker-compose exec web npm run db:migrate

db-seed:
	@echo "Seeding database..."
	docker-compose exec web npm run db:seed

# Service-specific commands
web-logs:
	@echo "Showing web service logs..."
	docker-compose logs -f web

workspace-logs:
	@echo "Showing workspace service logs..."
	docker-compose logs -f workspace

notifications-logs:
	@echo "Showing notifications service logs..."
	docker-compose logs -f notifications
