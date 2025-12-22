#!/bin/bash

# EECP Instrument Launcher
# Starts EarthianBioSense and Semantic Climate for orchestrated experiments

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EARTHIAN_LABS="${SCRIPT_DIR}/../../../"
LOG_DIR="${SCRIPT_DIR}/../logs"

# Create logs directory
mkdir -p "$LOG_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}EECP Instrument Launcher${NC}"
echo "========================="
echo ""

# Check if processes are already running
check_running() {
  local name=$1
  local port=$2
  if lsof -i :$port > /dev/null 2>&1; then
    echo -e "${YELLOW}$name already running on port $port${NC}"
    return 0
  fi
  return 1
}

# Start EarthianBioSense
start_ebs() {
  local EBS_DIR="${EARTHIAN_LABS}/Earthian-BioSense"

  if [ ! -d "$EBS_DIR" ]; then
    echo -e "${RED}EarthianBioSense not found at $EBS_DIR${NC}"
    return 1
  fi

  if check_running "EarthianBioSense" 8765; then
    return 0
  fi

  echo "Starting EarthianBioSense..."
  cd "$EBS_DIR"

  # Activate venv if exists
  if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
  fi

  python src/app.py > "${LOG_DIR}/ebs.log" 2>&1 &
  EBS_PID=$!
  echo $EBS_PID > "${LOG_DIR}/ebs.pid"

  sleep 2
  if kill -0 $EBS_PID 2>/dev/null; then
    echo -e "${GREEN}EarthianBioSense started (PID: $EBS_PID)${NC}"
  else
    echo -e "${RED}EarthianBioSense failed to start. Check ${LOG_DIR}/ebs.log${NC}"
    return 1
  fi
}

# Start Semantic Climate
start_sc() {
  local SC_DIR="${EARTHIAN_LABS}/semantic-climate-phase-space/semantic_climate_app/backend"

  if [ ! -d "$SC_DIR" ]; then
    echo -e "${RED}Semantic Climate not found at $SC_DIR${NC}"
    return 1
  fi

  if check_running "Semantic Climate" 8000; then
    return 0
  fi

  echo "Starting Semantic Climate..."
  cd "$SC_DIR"

  # Activate venv if exists
  if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
  elif [ -f "../venv/bin/activate" ]; then
    source ../venv/bin/activate
  fi

  python main.py > "${LOG_DIR}/sc.log" 2>&1 &
  SC_PID=$!
  echo $SC_PID > "${LOG_DIR}/sc.pid"

  sleep 2
  if kill -0 $SC_PID 2>/dev/null; then
    echo -e "${GREEN}Semantic Climate started (PID: $SC_PID)${NC}"
  else
    echo -e "${RED}Semantic Climate failed to start. Check ${LOG_DIR}/sc.log${NC}"
    return 1
  fi
}

# Check Ollama
check_ollama() {
  if command -v ollama &> /dev/null; then
    if ! pgrep -x "ollama" > /dev/null; then
      echo -e "${YELLOW}Ollama not running. Starting...${NC}"
      ollama serve > "${LOG_DIR}/ollama.log" 2>&1 &
      sleep 2
      echo -e "${GREEN}Ollama started${NC}"
    else
      echo -e "${GREEN}Ollama already running${NC}"
    fi
  else
    echo -e "${YELLOW}Ollama not installed (optional for local models)${NC}"
  fi
}

# Main
case "${1:-all}" in
  ebs)
    start_ebs
    ;;
  sc)
    start_sc
    ;;
  ollama)
    check_ollama
    ;;
  all)
    check_ollama
    echo ""
    start_ebs
    echo ""
    start_sc
    echo ""
    echo -e "${GREEN}All instruments started!${NC}"
    echo ""
    echo "Logs: ${LOG_DIR}"
    echo "Field Journal: http://localhost:3141/experiment-entry.html"
    ;;
  status)
    echo "Checking instrument status..."
    check_running "EarthianBioSense" 8765 || echo "EarthianBioSense: not running"
    check_running "Semantic Climate" 8000 || echo "Semantic Climate: not running"
    pgrep -x "ollama" > /dev/null && echo -e "${GREEN}Ollama: running${NC}" || echo "Ollama: not running"
    ;;
  stop)
    echo "Stopping instruments..."
    [ -f "${LOG_DIR}/ebs.pid" ] && kill $(cat "${LOG_DIR}/ebs.pid") 2>/dev/null && echo "Stopped EBS"
    [ -f "${LOG_DIR}/sc.pid" ] && kill $(cat "${LOG_DIR}/sc.pid") 2>/dev/null && echo "Stopped SC"
    rm -f "${LOG_DIR}"/*.pid
    echo "Done"
    ;;
  *)
    echo "Usage: $0 {all|ebs|sc|ollama|status|stop}"
    exit 1
    ;;
esac
