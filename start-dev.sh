#!/bin/bash

# Plainedu 개발 환경 시작 스크립트

echo "🚀 Plainedu 개발 환경을 시작합니다..."

# 백엔드 서버 시작 (백그라운드)
echo "📡 백엔드 서버 시작 중..."
cd /workspaces/Plainedu/back
npm start &
BACKEND_PID=$!

# 잠시 대기 (서버 시작 시간)
sleep 3

# 프론트엔드 서버 시작 (백그라운드)
echo "🎨 프론트엔드 서버 시작 중..."
cd /workspaces/Plainedu/front
npm run dev &
FRONTEND_PID=$!

# 서버 정보 출력
echo ""
echo "✅ 개발 환경이 준비되었습니다!"
echo ""
echo "📍 접근 URL:"
echo "  🎨 Frontend: https://$CODESPACE_NAME-5173.app.github.dev"
echo "  📡 Backend API: https://$CODESPACE_NAME-4000.app.github.dev"
echo "  📚 Swagger UI: https://$CODESPACE_NAME-4000.app.github.dev/api-docs"
echo ""
echo "🔧 개발 서버 관리:"
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "⚠️  서버 중지: kill $BACKEND_PID $FRONTEND_PID"

# 로그 표시 옵션
echo ""
read -p "📋 실시간 로그를 보시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📋 실시간 로그 표시 중... (Ctrl+C로 중지)"
    tail -f /workspaces/Plainedu/back/server.log 2>/dev/null &
    wait
fi
