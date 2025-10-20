#!/bin/bash

# CRM-ERP Development Environment Logs Script
# This script shows logs from all development services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "📋 CRM-ERP Development Environment Logs"
echo "======================================"

# Function to show service logs
show_logs() {
    local service=$1
    local port=$2
    
    echo -e "${BLUE}📱 $service (Port $port)${NC}"
    echo "----------------------------------------"
    
    # Check if service is running
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Service is running${NC}"
        
        # Try to get recent logs from the process
        local pid=$(lsof -ti:$port)
        if [ ! -z "$pid" ]; then
            echo -e "${YELLOW}Process ID: $pid${NC}"
        fi
    else
        echo -e "${RED}❌ Service is not running${NC}"
    fi
    echo ""
}

# Show Docker service logs
echo -e "${BLUE}🐳 Docker Services${NC}"
echo "=================="
docker-compose -f docker-compose.dev.yml logs --tail=10 postgres redis
echo ""

# Show application service status
show_logs "Web App" 3000
show_logs "Workspace" 3001
show_logs "Notifications" 3002

# Show system resource usage
echo -e "${BLUE}💻 System Resources${NC}"
echo "===================="
echo -e "${YELLOW}Memory Usage:${NC}"
ps aux | grep -E "(node|bun)" | grep -v grep | head -5
echo ""

echo -e "${YELLOW}Port Usage:${NC}"
lsof -i :3000,3001,3002,5432,6379 | grep LISTEN
echo ""

echo -e "${YELLOW}💡 To follow logs in real-time:${NC}"
echo "  - Web App: tail -f apps/web/.next/server.log (if available)"
echo "  - Workspace: tail -f apps/workspace/.next/server.log (if available)"
echo "  - Notifications: tail -f apps/notifications/.next/server.log (if available)"
echo "  - Docker: docker-compose -f docker-compose.dev.yml logs -f"
