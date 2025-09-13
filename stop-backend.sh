#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 PlainEdu 백엔드 서버를 중지합니다...${NC}"

# PID 파일에서 백엔드 PID 읽기
if [ -f ".backend_pid" ]; then
    BACKEND_PID=$(cat .backend_pid)
    
    # 프로세스가 실행 중인지 확인
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✅ 백엔드 서버 (PID: $BACKEND_PID)가 중지되었습니다.${NC}"
    else
        echo -e "${YELLOW}⚠️  백엔드 서버가 이미 중지되어 있습니다.${NC}"
    fi
    
    # PID 파일 삭제
    rm .backend_pid
else
    echo -e "${YELLOW}⚠️  PID 파일을 찾을 수 없습니다. 수동으로 프로세스를 찾아 중지합니다...${NC}"
    
    # Node.js 프로세스 중에서 백엔드 서버 찾기
    PIDS=$(pgrep -f "node.*server/index.cjs")
    
    if [ -n "$PIDS" ]; then
        echo $PIDS | xargs kill
        echo -e "${GREEN}✅ 백엔드 서버 프로세스들이 중지되었습니다.${NC}"
    else
        echo -e "${RED}❌ 실행 중인 백엔드 서버를 찾을 수 없습니다.${NC}"
    fi
fi

echo -e "${GREEN}🔚 백엔드 서버 중지 완료${NC}"
