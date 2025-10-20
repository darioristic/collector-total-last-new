# CRM-ERP Collector System Makefile

.PHONY: help build up down dev logs clean

# Default target
help:
	@echo "CRM-ERP Collector System"
	@echo "======================="
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev           - Start development environment (local + Docker)"
	@echo "  make dev-docker    - Start development environment (Docker only)"
	@echo "  make dev-status    - Check development environment status"
	@echo "  make dev-restart   - Restart development environment"
	@echo "  make down          - Stop all services"
	@echo "  make logs          - Show logs from all services"
	@echo ""
	@echo "Production Commands:"
	@echo "  make build         - Build all Docker images"
	@echo "  make up            - Start production environment"
	@echo "  make clean         - Clean up containers and volumes"
	@echo ""
	@echo "Database Commands:"
	@echo "  make db-reset      - Reset and seed database"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-migrate-dev- Run database migrations for development"
	@echo "  make db-seed       - Seed database"
	@echo ""
	@echo "Code Quality Commands:"
	@echo "  make lint-all      - Run linter on all services"
	@echo "  make type-check-all- Run type check on all services"
	@echo ""

# Development environment
dev:
	@echo "Starting development environment..."
	./scripts/dev-start.sh

# Development environment (Docker only)
dev-docker:
	@echo "Starting development environment (Docker only)..."
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
	./scripts/dev-stop.sh
	docker-compose down

# Show logs
logs:
	@echo "Showing logs from all services..."
	./scripts/dev-logs.sh

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

# Development utilities
dev-status:
	@echo "Checking development environment status..."
	./scripts/dev-logs.sh

dev-restart:
	@echo "Restarting development environment..."
	./scripts/dev-stop.sh
	sleep 2
	./scripts/dev-start.sh

# Database utilities
db-reset:
	@echo "Resetting database..."
	cd apps/web && bunx prisma db push --force-reset && bun run db:seed

db-migrate-dev:
	@echo "Running database migrations for development..."
	cd apps/web && bunx prisma db push

# Code quality
lint-all:
	@echo "Running linter on all services..."
	cd apps/web && bun run lint
	cd apps/workspace && bun run lint
	cd apps/notifications && bun run lint

type-check-all:
	@echo "Running type check on all services..."
	cd apps/web && bun run type-check
	cd apps/workspace && bun run type-check
	cd apps/notifications && bun run type-check
