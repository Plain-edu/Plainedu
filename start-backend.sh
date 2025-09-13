#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PlainEdu 백엔드 서버만 시작합니다...${NC}"

# 백엔드 디렉토리로 이동
cd back

echo -e "${GREEN}📡 백엔드 서버 시작 중...${NC}"

# 백엔드 서버를 백그라운드에서 실행
npm start &
BACKEND_PID=$!

# 서버가 시작될 때까지 잠시 대기
sleep 3

# 서버 상태 확인
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ 백엔드 서버가 성공적으로 시작되었습니다!${NC}"
    echo ""
    echo -e "${YELLOW}📍 접근 URL:${NC}"
    
    # Codespaces 환경인지 확인
    if [ -n "$CODESPACE_NAME" ]; then
        # GitHub Codespaces 환경
        BACKEND_URL="https://${CODESPACE_NAME}-4000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
        echo -e "  📡 ${BLUE}Backend API: ${BACKEND_URL}${NC}"
        echo -e "  📚 ${BLUE}Swagger UI: ${BACKEND_URL}/api-docs${NC}"
    else
        # 로컬 환경
        echo -e "  📡 ${BLUE}Backend API: http://localhost:4000${NC}"
        echo -e "  📚 ${BLUE}Swagger UI: http://localhost:4000/api-docs${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}🔧 서버 관리:${NC}"
    echo -e "  Backend PID: ${BACKEND_PID}"
    echo -e "  ⚠️  서버 중지: kill ${BACKEND_PID}"
    echo ""
    echo -e "${GREEN}📚 Swagger UI에서 API를 테스트하세요!${NC}"
    
    # PID를 파일에 저장
    echo $BACKEND_PID > .backend_pid
    
    # 서버가 실행 중인 동안 대기
    wait $BACKEND_PID
else
    echo -e "${RED}❌ 백엔드 서버 시작에 실패했습니다.${NC}"
    echo -e "${YELLOW}💡 문제 해결:${NC}"
    echo "  1. 'npm install' 실행"
    echo "  2. 환경 변수 확인"
    echo "  3. 포트 4000이 사용 중인지 확인"
    exit 1
fi
