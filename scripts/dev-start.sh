#!/bin/bash

# CRM-ERP Development Environment - Simple Version
set -e

echo "🚀 Starting CRM-ERP Development Environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Start Docker services only
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for database
echo -e "${YELLOW}⏳ Waiting for database...${NC}"
sleep 3

# Set environment variables
export DATABASE_URL="postgresql://collector_user:collector_password@localhost:5432/collector_db"
export REDIS_URL="redis://localhost:6379"
export NEXTAUTH_URL="http://localhost:3000"
export NEXTAUTH_SECRET="dev-secret"
export JWT_SECRET="dev-jwt-secret"
export WORKSPACE_URL="http://localhost:3001"
export NOTIFICATIONS_URL="http://localhost:3002"
export NODE_ENV="development"

# Start services in background
echo -e "${BLUE}🌐 Starting Web App...${NC}"
(cd apps/web && bun run dev > /tmp/web.log 2>&1) &
WEB_PID=$!

echo -e "${BLUE}💼 Starting Workspace...${NC}"
(cd apps/workspace && bun run dev > /tmp/workspace.log 2>&1) &
WORKSPACE_PID=$!

echo -e "${BLUE}🔔 Starting Notifications...${NC}"
(cd apps/notifications && bun run dev > /tmp/notifications.log 2>&1) &
NOTIFICATIONS_PID=$!

# Save PIDs
echo "WEB_PID=$WEB_PID" > /tmp/.dev-pids
echo "WORKSPACE_PID=$WORKSPACE_PID" >> /tmp/.dev-pids
echo "NOTIFICATIONS_PID=$NOTIFICATIONS_PID" >> /tmp/.dev-pids

# Wait a bit for services to start
sleep 5

# Setup database
echo -e "${BLUE}🗄️  Setting up database...${NC}"
(cd apps/web && bunx prisma db push --accept-data-loss && bun run db:seed)

echo ""
echo -e "${GREEN}🎉 Development environment ready!${NC}"
echo "=================================="
echo -e "${BLUE}📱 Web App:${NC}        http://localhost:3000"
echo -e "${BLUE}💼 Workspace:${NC}      http://localhost:3001"
echo -e "${BLUE}🔔 Notifications:${NC}  http://localhost:3002"
echo ""
echo -e "${YELLOW}💡 To stop: make down${NC}"
echo -e "${YELLOW}💡 To see logs: tail -f /tmp/*.log${NC}"