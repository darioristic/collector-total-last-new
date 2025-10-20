#!/bin/bash

# CRM-ERP Development Environment - Simple Stop
set -e

echo "🛑 Stopping CRM-ERP Development Environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kill all Node.js processes
echo -e "${BLUE}🔄 Stopping services...${NC}"
pkill -f "next dev" 2>/dev/null || true
pkill -f "bun run dev" 2>/dev/null || true

# Stop Docker services
echo -e "${BLUE}🐳 Stopping Docker services...${NC}"
docker-compose -f docker-compose.dev.yml down

# Clean up
rm -f /tmp/.dev-pids
rm -f /tmp/web.log /tmp/workspace.log /tmp/notifications.log

echo -e "${GREEN}✅ All services stopped!${NC}"