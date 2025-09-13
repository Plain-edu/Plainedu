# PlainEdu 🎓

**금융 교육 플랫폼** - 인터랙티브 퀴즈를 통한 금융 학습 애플리케이션

[![GitHub](https://img.shields.io/badge/GitHub-Plain--edu%2FPlainedu-blue?style=flat&logo=github)](https://github.com/Plain-edu/Plainedu)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat&logo=react)](https://reactjs.org/)
[![Swagger](https://img.shields.io/badge/API-Swagger-brightgreen?style=flat&logo=swagger)](https://swagger.io/)
[![Codespaces](https://img.shields.io/badge/GitHub-Codespaces-purple?style=flat&logo=github)](https://github.com/features/codespaces)

## 📚 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [개발 환경](#-개발-환경)
- [문제 해결](#-문제-해결)
- [기여하기](#-기여하기)

## 🎯 프로젝트 소개

PlainEdu는 **금융 교육을 위한 현대적인 웹 플랫폼**입니다. 사용자들이 퀴즈를 통해 재미있게 금융 지식을 학습하고, 개인의 학습 진도를 체계적으로 관리할 수 있습니다.

### ✨ 핵심 가치
- 🎓 **교육 중심**: 체계적이고 실용적인 금융 교육 콘텐츠
- 🎮 **상호작용**: 퀴즈와 게임을 통한 흥미로운 학습 경험
- 📊 **데이터 기반**: 개인별 맞춤 학습 분석 및 진도 추적
- 🌐 **접근성**: 언제 어디서나 쉽게 접근 가능한 클라우드 기반 플랫폼

## 🚀 주요 기능

### 🎓 스마트 학습 시스템
- **적응형 퀴즈**: 사용자 수준에 맞는 난이도 조절
- **실시간 피드백**: 즉시 확인할 수 있는 정답 및 해설
- **진도 관리**: 개인별 학습 현황과 성취도 추적
- **뱃지 시스템**: 학습 목표 달성 시 획득할 수 있는 성취 배지

### 👤 사용자 경험
- **직관적 인터페이스**: 모던하고 사용하기 쉬운 UI/UX
- **개인화 대시보드**: 맞춤형 학습 통계 및 추천
- **소셜 기능**: 학습 성과 공유 및 친구와의 경쟁
- **모바일 최적화**: 반응형 디자인으로 모든 기기에서 접근 가능

### 🔧 관리자 도구
- **콘텐츠 관리**: 퀴즈 문제 생성, 수정, 관리
- **사용자 분석**: 학습 패턴 및 성과 분석 대시보드
- **시스템 모니터링**: 실시간 서비스 상태 확인

## 🛠 기술 스택

### 🎨 Frontend
- **React 18** - 현대적인 컴포넌트 기반 UI 라이브러리
- **Vite** - 초고속 개발 서버 및 빌드 도구
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **React Router DOM** - 싱글 페이지 애플리케이션 라우팅

### ⚙️ Backend
- **Node.js 16** - JavaScript 서버 런타임 (Codespaces 최적화)
- **Express.js** - 경량화된 웹 애플리케이션 프레임워크
- **MySQL2** - 고성능 관계형 데이터베이스
- **bcrypt** - 안전한 패스워드 암호화
- **CORS** - 크로스 오리진 리소스 공유 설정

### 📚 API & Documentation
- **Swagger UI** - 인터랙티브 API 문서화 및 테스트 도구
- **swagger-jsdoc** - JSDoc 주석 기반 OpenAPI 명세 생성
- **swagger-ui-express** - Express 통합 Swagger 인터페이스

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

### 🌟 GitHub Codespaces로 시작하기 (권장)

**Codespaces를 사용하면 브라우저만으로 즉시 개발을 시작할 수 있습니다.**

#### 1단계: Codespace 생성
```
GitHub Repository → <> Code 버튼 → Codespaces 탭 → Create codespace on main
```

#### 2단계: 자동 환경 구성 대기 (약 2-3분)
- ✅ Node.js 16 자동 설치
- ✅ 프로젝트 의존성 자동 설치  
- ✅ VS Code 확장 프로그램 자동 설정
- ✅ 포트 포워딩 자동 구성

#### 3단계: 개발 서버 실행

**전체 애플리케이션 실행:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**백엔드만 실행 (API 테스트용):**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

#### 4단계: 애플리케이션 접근

**전체 서비스:**
- 🎨 **Frontend**: `https://[codespace-name]-5173.app.github.dev`
- 📡 **Backend API**: `https://[codespace-name]-4000.app.github.dev`
- 📚 **Swagger UI**: `https://[codespace-name]-4000.app.github.dev/api-docs`

**백엔드만:**
- 📡 **API 서버**: `https://[codespace-name]-4000.app.github.dev`
- 📚 **Swagger UI**: `https://[codespace-name]-4000.app.github.dev/api-docs`

### 🛑 서버 중지

```bash
# 전체 서버 중지
./stop-backend.sh

# 또는 특정 프로세스 종료 (PID는 시작 시 출력됨)
kill [PID]
```

## 📁 프로젝트 구조

```
Plainedu/
├── 🎨 front/                   # React Frontend
│   ├── src/
│   │   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── pages/              # 페이지별 컴포넌트
│   │   │   ├── EntryPage.jsx   # 메인 진입 페이지
│   │   │   ├── LoginPage.jsx   # 로그인 페이지
│   │   │   ├── QuizPage.jsx    # 퀴즈 페이지
│   │   │   └── DashboardPage.jsx # 대시보드
│   │   ├── context/            # React Context (전역 상태)
│   │   └── assets/             # 정적 리소스
│   ├── public/                 # 공개 파일
│   └── package.json
│
├── ⚙️ back/                    # Node.js Backend
│   ├── server/
│   │   └── index.cjs           # Express 서버 메인
│   ├── swagger/                # API 문서화
│   │   ├── swagger.cjs         # Swagger 설정
│   │   └── routes/             # 엔드포인트별 문서
│   │       ├── auth.cjs        # 인증 API
│   │       ├── quiz.cjs        # 퀴즈 API
│   │       └── user.cjs        # 사용자 API
│   └── package.json
│
├── 🗄️ SQL/                     # 데이터베이스
│   ├── plaindb.sql             # 메인 스키마
│   └── migration_*.sql         # 마이그레이션 파일
│
├── 🚀 Scripts/                 # 개발 스크립트
│   ├── start-dev.sh            # 전체 개발 서버 시작
│   ├── start-backend.sh        # 백엔드만 시작
│   └── stop-backend.sh         # 서버 중지
│
├── ⚙️ .devcontainer/           # Codespaces 설정
│   └── devcontainer.json       # 개발 환경 자동 구성
│
└── 📚 .github/                 # GitHub 설정
    └── pull_request_template.md
```

## 📚 API 문서

### 🌐 Swagger UI 접근

**GitHub Codespaces**: `https://[your-codespace]-4000.app.github.dev/api-docs`

### 🔧 주요 API 엔드포인트

#### 🏥 시스템 상태
```http
GET /api/health
```
서버 상태 및 데이터베이스 연결 확인

#### 👤 사용자 인증
```http
POST /api/signup      # 신규 회원가입
POST /api/login       # 로그인
GET  /api/user/:id    # 사용자 정보 조회
PUT  /api/user/:id    # 사용자 정보 수정
```

#### 📝 퀴즈 시스템
```http
GET  /api/questions           # 퀴즈 문제 목록 조회
POST /api/quiz-result         # 퀴즈 결과 저장
GET  /api/user/:id/points     # 사용자 포인트 조회
GET  /api/user/:id/badges     # 획득 배지 조회
```

### 🧪 API 테스트 방법

1. **Swagger UI (권장)**
   - Swagger UI 페이지 접속
   - "Try it out" 버튼 클릭
   - 파라미터 입력 후 "Execute"

2. **curl 명령어**
   ```bash
   # 헬스 체크
   curl -X GET "https://[codespace]-4000.app.github.dev/api/health"
   
   # 사용자 등록
   curl -X POST "https://[codespace]-4000.app.github.dev/api/signup" \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   ```

## 🌐 개발 환경

### ✨ GitHub Codespaces의 장점

- � **즉시 시작**: 브라우저만으로 개발 환경 완성
- �🔧 **자동 구성**: devcontainer로 표준화된 개발 환경
- 🌍 **어디서나**: 인터넷만 있으면 언제든지 개발 가능
- 👥 **협업 친화적**: 팀원과 동일한 환경에서 작업
- 💰 **비용 효율적**: GitHub 계정당 월 120시간 무료 제공

### 🎛️ Codespaces 고급 활용

#### 포트 관리
GitHub Codespaces는 자동으로 포트를 감지하고 포워딩합니다:
- 포트 4000 (Backend) → 자동 공개 URL 생성
- 포트 5173 (Frontend) → 자동 공개 URL 생성

#### 환경 변수 설정
```bash
# .env 파일 생성 (필요한 경우)
echo "NODE_ENV=development" >> back/.env
echo "PORT=4000" >> back/.env
```

#### 실시간 개발
- **Hot Reload**: 코드 변경 시 자동 새로고침
- **Live Server**: 실시간 브라우저 업데이트
- **Debug Mode**: VS Code 통합 디버깅 도구

## 🔧 문제 해결

### 일반적인 문제들

#### 🚫 서버 시작 실패
```bash
# 포트 사용 확인
lsof -i :4000 :5173

# 프로세스 종료 후 재시작
pkill -f "node"
./start-dev.sh
```

#### 🗄️ 데이터베이스 연결 문제
```bash
# 연결 테스트
curl https://[codespace]-4000.app.github.dev/api/health

# 환경 변수 확인
echo $NODE_ENV
```

#### 📦 패키지 의존성 문제
```bash
# 전체 재설치
cd back && rm -rf node_modules package-lock.json && npm install
cd front && rm -rf node_modules package-lock.json && npm install
```

#### 🌐 Codespaces 포트 접근 불가
- Ports 탭에서 포트가 "Public"으로 설정되었는지 확인
- 브라우저에서 팝업 차단기 해제
- HTTPS URL 사용 확인

#### ⚙️ esbuild 플랫폼 호환성 (Codespaces)
```bash
# 프론트엔드 의존성 재설치
cd front
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 🔍 로그 및 디버깅

#### 백엔드 로그 확인
```bash
# 실시간 로그 모니터링
tail -f back/logs/app.log

# 에러만 필터링
grep "ERROR" back/logs/app.log
```

#### 프론트엔드 디버깅
- 브라우저 개발자 도구 Console 탭 확인
- Network 탭에서 API 호출 상태 확인
- VS Code 터미널에서 Vite 로그 확인

## 🤝 기여하기

PlainEdu는 오픈소스 프로젝트입니다. 여러분의 기여를 환영합니다! 🎉

### 🚀 기여 방법

#### 1단계: 프로젝트 Fork & Clone
```bash
# GitHub에서 Fork 후
git clone https://github.com/[your-username]/Plainedu.git
cd Plainedu
```

#### 2단계: 새 브랜치 생성
```bash
# 기능 개발
git checkout -b feature/amazing-feature

# 버그 수정  
git checkout -b fix/bug-description

# 문서 업데이트
git checkout -b docs/update-readme
```

#### 3단계: 개발 환경 설정
```bash
# GitHub Codespaces 사용 (권장)
# 또는 로컬에서 ./start-dev.sh 실행
```

#### 4단계: 변경사항 커밋
```bash
git add .
git commit -m "feat: add amazing new feature"
git push origin feature/amazing-feature
```

#### 5단계: Pull Request 생성
- GitHub에서 "Compare & Pull Request" 클릭
- 상세한 설명과 함께 PR 생성
- 리뷰 대기 및 피드백 반영

### 📝 개발 가이드라인

#### 코드 스타일
```javascript
// React 컴포넌트 - 함수형 컴포넌트 사용
const QuizComponent = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  return (
    <div className="quiz-container">
      <h2>{question.title}</h2>
      {/* 컴포넌트 내용 */}
    </div>
  );
};

// API 핸들러 - async/await 사용
const handleSubmitQuiz = async (answers) => {
  try {
    const response = await fetch('/api/quiz-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });
    return await response.json();
  } catch (error) {
    console.error('Quiz submission failed:', error);
  }
};
```

#### 커밋 메시지 컨벤션
```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 과정 또는 보조 도구 수정
```

### 🎯 기여할 수 있는 영역

- 🎨 **UI/UX 개선**: 사용자 인터페이스 및 경험 향상
- 📚 **콘텐츠 추가**: 새로운 금융 교육 퀴즈 및 자료
- 🔧 **기능 개발**: 새로운 학습 도구 및 기능
- 🐛 **버그 수정**: 발견된 문제점 해결
- 📖 **문서화**: README, API 문서, 주석 개선
- 🧪 **테스트**: 단위 테스트, 통합 테스트 작성

### 📋 이슈 관리

기여하기 전에 [GitHub Issues](https://github.com/Plain-edu/Plainedu/issues)를 확인해주세요:

1. **기존 이슈 확인**: 중복 작업 방지
2. **라벨 활용**: `good first issue`, `help wanted` 태그 확인
3. **이슈 생성**: 새로운 버그나 기능 제안

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다.

```
MIT License

Copyright (c) 2025 Plain-edu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 감사의 말

이 프로젝트를 발전시키는 데 기여해주신 모든 분들께 진심으로 감사드립니다! 🎓

### 🌟 주요 기여자
- **개발팀**: 플랫폼 아키텍처 및 핵심 기능 개발
- **디자인팀**: 사용자 친화적 인터페이스 설계
- **콘텐츠팀**: 양질의 금융 교육 자료 제작

---

**🔗 유용한 링크**
- 📚 [Swagger API 문서](https://[your-codespace]-4000.app.github.dev/api-docs)
- 🐛 [버그 리포트](https://github.com/Plain-edu/Plainedu/issues)
- 💡 [기능 제안](https://github.com/Plain-edu/Plainedu/discussions)
- 📧 [이메일 문의](mailto:contact@plainedu.dev)

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**
