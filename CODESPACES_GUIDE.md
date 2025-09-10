# GitHub Codespaces로 Plainedu 개발하기 🚀

## 빠른 시작

### 1. Codespace 생성
1. GitHub에서 이 저장소로 이동
2. `Code` 버튼 클릭 → `Codespaces` 탭 → `Create codespace on new_Setting`

### 2. 자동 설정
- Node.js 18 환경 자동 구성
- 필요한 VS Code 확장 프로그램 자동 설치
- 백엔드/프론트엔드 의존성 자동 설치

### 3. 개발 서버 시작
```bash
# 자동 스크립트 사용 (권장)
chmod +x start-dev.sh
./start-dev.sh

# 또는 수동으로 시작
cd back && npm start &
cd front && npm run dev &
```

## 🌐 외부 접근 URL

Codespace가 실행되면 다음 URL들이 자동으로 생성됩니다:

- **Frontend**: `https://[codespace-name]-5173.app.github.dev`
- **Backend API**: `https://[codespace-name]-4000.app.github.dev`
- **Swagger UI**: `https://[codespace-name]-4000.app.github.dev/api-docs`

> 💡 `[codespace-name]`은 자동으로 생성되는 고유한 이름입니다.

## 📚 Swagger API 문서

### 주요 엔드포인트
- `GET /api/health` - 서버 상태 확인
- `POST /api/signup` - 사용자 등록
- `POST /api/login` - 로그인
- `GET /api/user/:id` - 사용자 정보 조회
- `POST /api/quiz-result` - 퀴즈 결과 저장
- `GET /api/questions` - 퀴즈 문제 조회

### API 테스트
1. Swagger UI에 접속: `https://[codespace-name]-4000.app.github.dev/api-docs`
2. 각 엔드포인트를 클릭하여 상세 정보 확인
3. `Try it out` 버튼으로 실제 API 테스트 가능

## 🔧 개발 팁

### 포트 포워딩
- 모든 포트는 자동으로 HTTPS로 포워딩됩니다
- 포트 변경 시 `.devcontainer/devcontainer.json`에서 `forwardPorts` 수정

### 환경 변수
```bash
# Codespace에서 사용할 환경 변수 설정
echo "DB_HOST=your-db-host" >> .env
echo "DB_PASSWORD=your-password" >> .env
```

### 실시간 로그 확인
```bash
# 백엔드 로그
tail -f back/server.log

# 프론트엔드 로그
cd front && npm run dev
```

## 🤝 협업하기

### Swagger 공유
1. Codespace가 실행 중인 상태에서
2. Swagger URL을 팀원들에게 공유: `https://[your-codespace]-4000.app.github.dev/api-docs`
3. 누구나 브라우저에서 API 문서 확인 및 테스트 가능

### 실시간 협업
- GitHub Codespaces는 실시간 협업 기능 지원
- `View` → `Command Palette` → `Codespaces: Show Live Share`

## 📱 모바일에서도 접근 가능

생성된 URL들은 모바일 브라우저에서도 접근 가능합니다!

## 🛠️ 문제 해결

### 서버가 시작되지 않을 때
```bash
# 포트 사용 상태 확인
lsof -i :4000
lsof -i :5173

# 프로세스 종료 후 재시작
pkill -f "node"
./start-dev.sh
```

### 의존성 재설치
```bash
cd back && rm -rf node_modules && npm install
cd front && rm -rf node_modules && npm install
```
