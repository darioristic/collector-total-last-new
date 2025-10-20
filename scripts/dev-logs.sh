#!/bin/bash

# CRM-ERP Development Environment - Simple Logs
set -e

echo "📋 CRM-ERP Development Environment Status"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check services
check_service() {
    local port=$1
    local name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name (port $port) - Running${NC}"
    else
        echo -e "${RED}❌ $name (port $port) - Not running${NC}"
    fi
}

echo -e "${BLUE}📱 Services Status:${NC}"
check_service 3000 "Web App"
check_service 3001 "Workspace"
check_service 3002 "Notifications"
check_service 5432 "PostgreSQL"
check_service 6379 "Redis"

echo ""
echo -e "${BLUE}📊 Process Info:${NC}"
ps aux | grep -E "(next|bun)" | grep -v grep | head -5

echo ""
echo -e "${YELLOW}💡 To see live logs:${NC}"
echo "  tail -f /tmp/web.log"
echo "  tail -f /tmp/workspace.log"
echo "  tail -f /tmp/notifications.log"