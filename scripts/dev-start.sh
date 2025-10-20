#!/bin/bash

# CRM-ERP Development Environment Startup Script
# This script starts all services for local development

set -e

echo "🚀 Starting CRM-ERP Development Environment..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service_name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}Attempt $attempt/$max_attempts - $service_name not ready yet...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Start Docker services (PostgreSQL and Redis)
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
if ! docker-compose -f docker-compose.dev.yml up -d postgres redis; then
    echo -e "${RED}❌ Failed to start Docker services${NC}"
    exit 1
fi

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 5

# Check if services are already running
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Web service already running on port 3000${NC}"
else
    echo -e "${BLUE}🌐 Starting Web service...${NC}"
    cd apps/web
    bun run dev &
    WEB_PID=$!
    cd ../..
fi

if check_port 3001; then
    echo -e "${YELLOW}⚠️  Workspace service already running on port 3001${NC}"
else
    echo -e "${BLUE}💼 Starting Workspace service...${NC}"
    cd apps/workspace
    bun run dev &
    WORKSPACE_PID=$!
    cd ../..
fi

if check_port 3002; then
    echo -e "${YELLOW}⚠️  Notifications service already running on port 3002${NC}"
else
    echo -e "${BLUE}🔔 Starting Notifications service...${NC}"
    cd apps/notifications
    bun run dev &
    NOTIFICATIONS_PID=$!
    cd ../..
fi

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
wait_for_service "http://localhost:3000" "Web App"
wait_for_service "http://localhost:3001" "Workspace"
wait_for_service "http://localhost:3002" "Notifications"

# Run database migrations and seeding
echo -e "${BLUE}🗄️  Setting up database...${NC}"
cd apps/web
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}Running database migrations...${NC}"
    bunx prisma db push
    echo -e "${YELLOW}Seeding database...${NC}"
    bun run db:seed
fi
cd ../..

# Display service URLs
echo ""
echo -e "${GREEN}🎉 Development environment is ready!${NC}"
echo "=============================================="
echo -e "${BLUE}📱 Web App:${NC}        http://localhost:3000"
echo -e "${BLUE}💼 Workspace:${NC}      http://localhost:3001"
echo -e "${BLUE}🔔 Notifications:${NC}  http://localhost:3002"
echo -e "${BLUE}🗄️  PostgreSQL:${NC}    localhost:5432"
echo -e "${BLUE}📦 Redis:${NC}          localhost:6379"
echo ""
echo -e "${YELLOW}💡 To stop all services, run: ./scripts/dev-stop.sh${NC}"
echo -e "${YELLOW}💡 To view logs, run: ./scripts/dev-logs.sh${NC}"

# Save PIDs for cleanup
echo "WEB_PID=$WEB_PID" > .dev-pids
echo "WORKSPACE_PID=$WORKSPACE_PID" >> .dev-pids
echo "NOTIFICATIONS_PID=$NOTIFICATIONS_PID" >> .dev-pids

echo -e "${GREEN}✅ All services started successfully!${NC}"
