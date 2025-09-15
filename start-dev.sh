#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m' 
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 PlainEdu 개발 환경을 시작합니다...${NC}"

# Codespaces 환경 감지
if [ -n "$CODESPACE_NAME" ]; then
    echo -e "${YELLOW}📍 GitHub Codespaces 환경 감지됨${NC}"
    BACKEND_URL="https://${CODESPACE_NAME}-4000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    FRONTEND_URL="https://${CODESPACE_NAME}-5173.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    
    # MySQL 연결 확인
    echo -e "${YELLOW}🔍 MySQL 연결 확인 중...${NC}"
    if ! mysqladmin ping -h localhost --silent; then
        echo -e "${RED}❌ MySQL이 실행되지 않았습니다. Codespace를 재시작해주세요.${NC}"
        exit 1
    fi
    
    # Database 상태 확인
    if ! mysql -h localhost -u root -pplain -e "USE plaindb; SELECT 1;" > /dev/null 2>&1; then
        echo -e "${RED}❌ plaindb 데이터베이스에 연결할 수 없습니다.${NC}"
        echo -e "${YELLOW}💡 해결방법: 컨테이너를 다시 빌드해주세요.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ MySQL 연결 확인됨${NC}"
else
    echo -e "${YELLOW}📍 로컬 개발 환경${NC}"
    BACKEND_URL="http://localhost:4000"
    FRONTEND_URL="http://localhost:5173"
fi

echo -e "${GREEN}📡 백엔드 서버 시작 중...${NC}"

# 백엔드 시작
cd back
npm start &
BACKEND_PID=$!
cd ..

# 서버 시작 대기
sleep 3

echo -e "${GREEN}🎨 프론트엔드 서버 시작 중...${NC}"

# 프론트엔드 시작  
cd front
npm run dev &
FRONTEND_PID=$!
cd ..

# 서버 시작 대기
sleep 3

echo -e "${GREEN}✅ 개발 환경이 준비되었습니다!${NC}"
echo ""
echo -e "${YELLOW}📍 접근 URL:${NC}"
echo -e "  🎨 Frontend: ${FRONTEND_URL}"
echo -e "  📡 Backend API: ${BACKEND_URL}"
echo -e "  📚 Swagger UI: ${BACKEND_URL}/api-docs"
echo ""
echo -e "${YELLOW}🔧 개발 서버 관리:${NC}"
echo -e "  Backend PID: ${BACKEND_PID}"
echo -e "  Frontend PID: ${FRONTEND_PID}"
echo ""
echo -e "  ⚠️  서버 중지: kill ${BACKEND_PID} ${FRONTEND_PID}"
echo ""

# PID를 파일에 저장
echo "${BACKEND_PID} ${FRONTEND_PID}" > .dev_pids

echo -e "${GREEN}📋 실시간 로그를 보시겠습니까? (y/n): ${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}🔍 실시간 로그 (Ctrl+C로 종료)${NC}"
    tail -f back/logs/*.log front/logs/*.log 2>/dev/null || echo "로그 파일을 찾을 수 없습니다."
fi