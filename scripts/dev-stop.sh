#!/bin/bash

# CRM-ERP Development Environment Stop Script
# This script stops all development services

set -e

echo "🛑 Stopping CRM-ERP Development Environment..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill process by PID
kill_process() {
    local pid=$1
    local service_name=$2
    
    if [ ! -z "$pid" ] && [ "$pid" != "null" ]; then
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid"
            sleep 2
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}Force stopping $service_name...${NC}"
                kill -9 "$pid"
            fi
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
    fi
}

# Kill processes by port if PIDs not available
kill_by_port() {
    local port=$1
    local service_name=$2
    
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Stopping $service_name on port $port (PID: $pid)...${NC}"
        kill "$pid"
        sleep 2
        
        # Force kill if still running
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${YELLOW}Force stopping $service_name...${NC}"
            kill -9 "$pid"
        fi
        echo -e "${GREEN}✅ $service_name stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  $service_name was not running on port $port${NC}"
    fi
}

# Read PIDs from file if it exists
if [ -f ".dev-pids" ]; then
    echo -e "${BLUE}📋 Reading service PIDs...${NC}"
    source .dev-pids
    
    kill_process "$WEB_PID" "Web App"
    kill_process "$WORKSPACE_PID" "Workspace"
    kill_process "$NOTIFICATIONS_PID" "Notifications"
    
    # Clean up PID file
    rm -f .dev-pids
else
    echo -e "${YELLOW}⚠️  No PID file found, killing by port...${NC}"
    kill_by_port 3000 "Web App"
    kill_by_port 3001 "Workspace"
    kill_by_port 3002 "Notifications"
fi

# Stop Docker services
echo -e "${BLUE}🐳 Stopping Docker services...${NC}"
docker-compose -f docker-compose.dev.yml down

# Clean up any remaining processes
echo -e "${BLUE}🧹 Cleaning up remaining processes...${NC}"

# Kill any remaining Node.js processes that might be related to our services
pkill -f "next dev" 2>/dev/null || true
pkill -f "bun run dev" 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 All development services stopped!${NC}"
echo "============================================="
echo -e "${YELLOW}💡 To start services again, run: ./scripts/dev-start.sh${NC}"
