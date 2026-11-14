#!/usr/bin/env bash
# Startup script for UPSC EdTech Unified Platform

echo "=============================================================================="
echo "                UPSC EDTECH UNIFIED ENTERPRISE PLATFORM                       "
echo "=============================================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "1. Starting Unified Backend on port 3000..."
cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!

sleep 3

echo "2. Starting React Web Client on port 5173..."
cd "$SCRIPT_DIR/web" && npm run dev &
WEB_PID=$!

echo "=============================================================================="
echo "Services running!"
echo "Backend: http://localhost:3000"
echo "Web:     http://localhost:5173"
echo "Health:  http://localhost:3000/api/health"
echo ""
echo "Press [CTRL+C] to stop all services..."
echo "=============================================================================="

trap "kill $BACKEND_PID $WEB_PID" SIGINT SIGTERM
wait
