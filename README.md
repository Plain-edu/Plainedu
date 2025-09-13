<!-- markdownlint-disable MD032 -->
<!-- markdownlint-disable MD022 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD040 -->
<!-- markdownlint-disable MD031 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD025 -->
<!-- markdownlint-disable MD012 -->
<!-- markdownlint-disable MD034 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD047 -->

# PlainEdu 🎓

**금융 교육 플랫폼** - 퀴즈를 통한 인터랙티브 금융 학습 애플리케이션

[![GitHub](https://img.shields.io/badge/GitHub-Plain--edu%2FPlainedu-blue?style=flat&logo=github)](https://github.com/Plain-edu/Plainedu)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat&logo=react)](https://reactjs.org/)
[![Swagger](https://img.shields.io/badge/API-Swagger-brightgreen?style=flat&logo=swagger)](https://swagger.io/)

## 📚 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [빠른 시작](#-빠른-시작)
- [로컬 개발](#-로컬-개발)
- [GitHub Codespaces 개발](#-github-codespaces-개발)
- [API 문서](#-api-문서)
- [배포](#-배포)
- [문제 해결](#-문제-해결)
- [기여하기](#-기여하기)

## 🎯 프로젝트 소개

PlainEdu는 금융 교육을 위한 인터랙티브 퀴즈 플랫폼입니다. 사용자들이 재미있게 금융 지식을 학습하고, 자신의 학습 진도를 추적할 수 있는 기능을 제공합니다.

### 핵심 가치
- 📖 **교육적**: 체계적인 금융 교육 콘텐츠
- 🎮 **인터랙티브**: 퀴즈와 게임을 통한 학습
- 📊 **데이터 기반**: 학습 진도 및 성과 추적
- 🌐 **접근성**: 어디서나 쉽게 접근 가능한 웹 플랫폼

## ✨ 주요 기능

### 🎓 학습 기능
- **퀴즈 시스템**: 다양한 난이도의 금융 퀴즈
- **진도 추적**: 개인별 학습 진도 및 성과 분석
- **뱃지 시스템**: 학습 성취도에 따른 뱃지 획득

### 👤 사용자 관리
- **회원가입/로그인**: 안전한 사용자 인증
- **프로필 관리**: 개인 정보 및 학습 기록 관리
- **대시보드**: 개인 학습 통계 및 현황

### 🔧 관리자 기능
- **콘텐츠 관리**: 퀴즈 문제 등록 및 수정
- **사용자 관리**: 사용자 현황 및 통계 확인

## 🛠 기술 스택

### Frontend
- **React 18** - 컴포넌트 기반 UI 라이브러리
- **Vite** - 빠른 개발 빌드 도구
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React Router DOM** - 클라이언트 사이드 라우팅

### Backend
- **Node.js 18** - JavaScript 런타임
- **Express.js** - 웹 애플리케이션 프레임워크
- **MySQL2** - 관계형 데이터베이스
- **bcrypt** - 패스워드 해싱
- **CORS** - Cross-Origin Resource Sharing

### API Documentation
- **Swagger UI** - API 문서화 및 테스트
- **swagger-jsdoc** - JSDoc 기반 Swagger 생성
- **swagger-ui-express** - Express에서 Swagger UI 제공

### Development & Deployment
- **GitHub Codespaces** - 클라우드 개발 환경
- **Docker** - 컨테이너화
- **devcontainer** - 개발 환경 표준화

## 📁 프로젝트 구조

```
Plainedu/
├── 📁 front/                    # 프론트엔드 (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/       # 재사용 가능한 컴포넌트
│   │   ├── 📁 pages/           # 페이지 컴포넌트
│   │   ├── 📁 context/         # React Context (상태 관리)
│   │   ├── 📁 assets/          # 이미지, 아이콘 등
│   │   ├── App.jsx            # 메인 애플리케이션
│   │   └── main.jsx           # 진입점
│   ├── 📁 public/              # 정적 파일
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 back/                     # 백엔드 (Node.js + Express)
│   ├── 📁 server/
│   │   └── index.cjs          # 메인 서버 파일
│   ├── 📁 swagger/            # API 문서화
│   │   ├── swagger.cjs        # Swagger 설정
│   │   └── 📁 routes/         # 라우트별 API 문서
│   └── package.json
│
├── 📁 SQL/                      # 데이터베이스 스키마
│   ├── plaindb.sql            # 메인 데이터베이스 스키마
│   └── README_plainDB.md      # 데이터베이스 문서
│
├── 📁 .devcontainer/           # 개발 컨테이너 설정
│   └── devcontainer.json
│
├── 📁 .github/                 # GitHub 워크플로우
│   └── pull_request_template.md
│
├── start-dev.sh               # 개발 서버 시작 스크립트
├── CODESPACES_GUIDE.md       # Codespaces 사용 가이드
└── README.md                 # 프로젝트 문서 (현재 파일)
```

## 🚀 빠른 시작

### 방법 1: GitHub Codespaces (권장) 🌟

가장 쉽고 빠른 방법입니다. 별도의 설치 없이 브라우저에서 바로 개발할 수 있습니다.

1. **Codespace 생성**
   ```
   GitHub Repository → Code 버튼 → Codespaces 탭 → Create codespace on new_Setting
   ```

2. **자동 환경 설정 대기** (2-3분)
   - Node.js 18 자동 설치
   - VS Code 확장 프로그램 자동 설치
   - 의존성 자동 설치

3. **개발 서버 시작**
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

4. **접근 URL**
   - **Frontend**: `https://[codespace-name]-5173.app.github.dev`
   - **Backend API**: `https://[codespace-name]-4000.app.github.dev`
   - **Swagger UI**: `https://[codespace-name]-4000.app.github.dev/api-docs`

### 방법 2: 로컬 개발

로컬 컴퓨터에서 개발하고 싶다면 이 방법을 사용하세요.

#### 사전 요구사항
- **Node.js 18+** ([다운로드](https://nodejs.org/))
- **MySQL 8.0+** ([다운로드](https://dev.mysql.com/downloads/))
- **Git** ([다운로드](https://git-scm.com/))

#### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/Plain-edu/Plainedu.git
   cd Plainedu
   git checkout new_Setting
   ```

2. **데이터베이스 설정**
   ```bash
   # MySQL에 로그인하여 데이터베이스 생성
   mysql -u root -p
   CREATE DATABASE plainedu;
   
   # 스키마 적용
   mysql -u root -p plainedu < SQL/plaindb.sql
   ```

3. **백엔드 실행**
   ```bash
   cd back
   npm install
   npm start
   ```

4. **프론트엔드 실행** (새 터미널)
   ```bash
   cd front
   npm install
   npm run dev
   ```

5. **접근 URL**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:4000
   - **Swagger UI**: http://localhost:4000/api-docs

## 🌐 GitHub Codespaces 개발

### 🎯 왜 Codespaces인가?

- ✅ **즉시 시작**: 브라우저만 있으면 개발 가능
- ✅ **환경 통일**: 모든 개발자가 동일한 환경
- ✅ **외부 접근**: 자동으로 생성되는 공개 URL
- ✅ **무료**: GitHub 계정당 월 60시간 무료

### 🔧 Codespaces 고급 활용

#### 포트 포워딩 관리
```bash
# 현재 포워딩된 포트 확인
curl -s http://localhost:4000/api/health

# 추가 포트 포워딩 (필요시)
# GitHub Codespaces UI에서 Ports 탭 사용
```

#### 환경 변수 설정
```bash
# 데이터베이스 연결 설정
echo "DB_HOST=your-db-host" >> .env
echo "DB_USER=your-username" >> .env
echo "DB_PASSWORD=your-password" >> .env
echo "DB_NAME=plainedu" >> .env
```

#### 실시간 로그 모니터링
```bash
# 백엔드 로그
tail -f back/logs/server.log

# 멀티 로그 모니터링
tmux new-session -d -s logs
tmux split-window -h
tmux send-keys -t logs:0.0 'cd back && npm start' Enter
tmux send-keys -t logs:0.1 'cd front && npm run dev' Enter
tmux attach -t logs
```

## 📚 API 문서

### Swagger UI 접근

**로컬**: http://localhost:4000/api-docs  
**Codespaces**: `https://[codespace-name]-4000.app.github.dev/api-docs`

### 주요 API 엔드포인트

#### 🏥 헬스 체크
```http
GET /api/health
```
서버 상태 및 데이터베이스 연결 확인

#### 👤 사용자 관리
```http
POST /api/signup     # 회원가입
POST /api/login      # 로그인
GET  /api/user/:id   # 사용자 정보 조회
```

#### 📝 퀴즈 시스템
```http
GET  /api/questions           # 퀴즈 문제 목록
POST /api/quiz-result        # 퀴즈 결과 저장
GET  /api/user/:id/points    # 사용자 포인트 조회
```

### API 테스트 방법

1. **Swagger UI 사용** (권장)
   - 브라우저에서 Swagger UI 접속
   - 각 엔드포인트의 "Try it out" 버튼 클릭
   - 파라미터 입력 후 "Execute" 버튼 클릭

2. **curl 사용**
   ```bash
   # 헬스 체크
   curl -X GET "http://localhost:4000/api/health"
   
   # 사용자 등록
   curl -X POST "http://localhost:4000/api/signup" \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   ```

3. **Postman 사용**
   - Swagger UI에서 OpenAPI 스펙 다운로드
   - Postman에서 Import → OpenAPI 3.0

## 🌐 배포

### GitHub Pages (Frontend)
```bash
cd front
npm run build
# dist 폴더를 GitHub Pages에 배포
```

### Heroku (Backend)
```bash
# Heroku CLI 설치 후
heroku create plainedu-api
git subtree push --prefix=back heroku main
```

### Docker 컨테이너
```bash
# 전체 애플리케이션 도커라이징
docker-compose up -d
```

## 🔧 문제 해결

### 자주 발생하는 문제들

#### 1. 서버가 시작되지 않을 때
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :4000
lsof -i :5173

# 프로세스 종료
pkill -f "node"

# 다시 시작
./start-dev.sh
```

#### 2. 데이터베이스 연결 오류
```bash
# MySQL 서비스 상태 확인
mysql -u root -p -e "SELECT 1"

# 환경 변수 확인
echo $DB_HOST $DB_USER $DB_NAME
```

#### 3. 의존성 충돌
```bash
# 노드 모듈 재설치
cd back && rm -rf node_modules package-lock.json && npm install
cd front && rm -rf node_modules package-lock.json && npm install
```

#### 4. Codespaces 포트 접근 불가
```bash
# 포트 상태 확인
curl http://localhost:4000/api/health

# 브라우저에서 포트 탭 확인
# "Make Public" 버튼 클릭 필요할 수 있음
```

### 로그 확인

#### 백엔드 로그
```bash
# 실시간 로그
tail -f back/logs/app.log

# 에러 로그만
grep "ERROR" back/logs/app.log
```

#### 프론트엔드 로그
```bash
# 개발자 도구 콘솔 확인
# 또는 터미널에서 Vite 로그 확인
```

## 🤝 기여하기

### 기여 프로세스

1. **Fork** 저장소
2. **Feature 브랜치** 생성 (`git checkout -b feature/amazing-feature`)
3. **커밋** (`git commit -m 'Add some amazing feature'`)
4. **Push** (`git push origin feature/amazing-feature`)
5. **Pull Request** 생성

### 코딩 컨벤션

#### JavaScript/React
```javascript
// 함수형 컴포넌트 사용
const MyComponent = () => {
  return <div>Hello World</div>;
};

// 화살표 함수 사용
const handleClick = () => {
  console.log('Clicked!');
};
```

#### 커밋 메시지
```
feat: add new quiz component
fix: resolve database connection issue
docs: update API documentation
style: format code with prettier
refactor: restructure user management
test: add unit tests for quiz logic
```

### 개발 워크플로우

1. **이슈 확인**: GitHub Issues에서 작업할 이슈 선택
2. **브랜치 생성**: `feature/이슈번호-간단한설명`
3. **개발 진행**: 작은 단위로 자주 커밋
4. **테스트**: Swagger UI로 API 테스트
5. **문서 업데이트**: 필요시 README나 API 문서 수정
6. **PR 생성**: 상세한 설명과 함께 Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

이 프로젝트를 개발하는 데 도움을 주신 모든 기여자분들께 감사드립니다.

---

**📧 연락처**: [GitHub Issues](https://github.com/Plain-edu/Plainedu/issues)  
**🌟 Star**: 이 프로젝트가 도움이 되었다면 ⭐ 스타를 눌러주세요!  
**🐛 버그 리포트**: [Issues](https://github.com/Plain-edu/Plainedu/issues)에서 버그를 신고해주세요.
 
 