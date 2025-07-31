# Plain Edu Financial App

금융 교육을 위한 풀스택 웹 애플리케이션입니다.

## 프로젝트 구조

```
plain/ (루트 - 깔끔하게 유지)
├── .gitignore          # Git 무시 파일
├── README.md           # 프로젝트 문서
├── back/               # 백엔드 (Node.js + Express + MySQL)
│   ├── server.js       # Express 서버 메인 파일
│   ├── db.js           # MySQL 데이터베이스 연결 설정
│   ├── package.json    # 백엔드 의존성
│   ├── .env.example    # 환경변수 예제
│   └── README.md       # 백엔드 문서
└── front/              # 프론트엔드 (React + Vite + Tailwind CSS)
    ├── src/
    │   ├── main.jsx              # 앱 진입점
    │   ├── App.jsx               # 메인 라우터 & 상태 관리
    │   ├── utils/
    │   │   └── api.js            # 백엔드 API 통신
    │   ├── hooks/
    │   │   ├── usePopup.js       # 팝업 상태 관리
    │   │   └── useOtpTimer.js    # OTP 타이머 관리
    │   └── components/
    │       ├── common/           # 공통 컴포넌트
    │       │   ├── Popup.jsx     # 알림 팝업
    │       │   └── BottomNavigation.jsx  # 하단 네비게이션
    │       └── pages/            # 각 화면별 페이지
    │           ├── SplashPage.jsx        # 시작 화면
    │           ├── WelcomePage.jsx       # 환영 화면
    │           ├── OnboardingNamePage.jsx    # 이름 입력
    │           ├── OnboardingPhonePage.jsx   # 전화번호 입력
    │           ├── TermsPage.jsx         # 약관 동의
    │           ├── OtpPage.jsx           # OTP 인증
    │           ├── ProfileSetupPage.jsx  # 프로필 설정
    │           ├── DashboardPage.jsx     # 메인 대시보드
    │           ├── QuizPage.jsx          # 퀴즈 화면
    │           └── RankingPage.jsx       # 랭킹 화면
    ├── package.json        # 프론트엔드 의존성
    ├── vercel.json         # Vercel 배포 설정
    ├── vite.config.js      # Vite 설정
    └── .env.example        # 환경변수 예제
```

## 설치 및 실행

### 백엔드 설정

1. 백엔드 폴더로 이동:
```bash
cd back
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정:
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 연결 정보를 입력하세요
```

4. MySQL 데이터베이스 설정 후 서버 실행:
```bash
npm run dev
```

### 프론트엔드 설정

1. 프론트엔드 폴더로 이동:
```bash
cd front
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정:
```bash
cp .env.example .env
# 필요시 API URL을 수정하세요
```

4. 개발 서버 실행:
```bash
npm run dev
```

## 기술 스택

### 백엔드
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

### 프론트엔드
- React 19
- Vite
- Tailwind CSS
- ESLint

## 주요 기능

- 사용자 프로필 관리
- 금융 퀴즈
- 랭킹 시스템
- 온보딩 프로세스
- OTP 인증

## API 엔드포인트

### 백엔드 API 구조
```
backend/server.js → MySQL Database
      ↑
   api 통신
      ↑
frontend/utils/api.js → React Components
```

### 주요 API:
- **사용자 관리**:
  - `GET /api/users/:userId/profile` - 사용자 프로필 조회
  - `POST /api/users/:userId/profile` - 사용자 프로필 생성/업데이트
- **퀴즈 시스템**:
  - `GET /api/quizzes` - 모든 퀴즈 조회
- **랭킹 시스템**:
  - `GET /api/rankings` - 랭킹 조회

## 🔗 프론트엔드-백엔드 연결 구조

### 데이터 흐름:
1. **사용자 액션** (프론트엔드 컴포넌트)
2. **API 호출** (`utils/api.js`)
3. **HTTP 요청** → 백엔드 서버
4. **데이터베이스 쿼리** (`db.js` → MySQL)
5. **JSON 응답** → 프론트엔드
6. **UI 업데이트** (React 상태 변경)

### 주요 연결점:
- **App.jsx** ↔ **utils/api.js** ↔ **server.js** ↔ **db.js** ↔ **MySQL**

## 🚀 배포 가이드

### GitHub에 업로드하기

1. **Git 초기화 및 커밋**:
```bash
# 루트 디렉토리에서
git init
git add .
git commit -m "Initial commit: Plain Edu Financial App"
```

2. **GitHub 리포지토리 생성 후 연결**:
```bash
# 이미 연결된 리포지토리
git remote add origin https://github.com/Plain-edu/Plainedu.git
git branch -M main
git push -u origin main
```

### Vercel로 프론트엔드 배포

#### 🔧 배포 방법 (Monorepo 구조):

**Vercel 설정**:
1. **Vercel 대시보드**에서 `Plain-edu/Plainedu` 리포지토리 선택
2. **Root Directory**: `front` 설정 ⭐
3. **Framework Preset**: `Vite` (자동 감지)
4. **Build Command**: `npm run build` (자동 설정)
5. **Output Directory**: `dist` (자동 설정)

#### 📋 Vercel 배포 단계:

1. **Vercel 계정 연결**: GitHub 계정으로 Vercel 로그인
2. **프로젝트 import**: `Plain-edu/Plainedu` 리포지토리 선택
3. **Configure Project**:
   ```
   Root Directory: front    ← 중요! 이것만 설정하면 됨
   Framework: Vite (자동 감지)
   ```
4. **환경 변수 추가**:
   ```
   VITE_API_BASE_URL = https://your-backend-url/api
   ```
5. **Deploy** 클릭!

#### ✨ 장점:
- ✅ **루트 폴더 깔끔** (별도 설정 파일 불필요)
- ✅ **Monorepo 지원** (front 폴더만 빌드)
- ✅ **Vite 자동 감지** (최적화된 빌드)

### 백엔드 배포 (추천 플랫폼)

#### 🌐 Railway 배포:
```bash
# Railway CLI 설치 후
railway login
railway init
railway add # MySQL 데이터베이스 추가
railway deploy
```

#### 🌐 Render 배포:
- **Web Service**: `back` 폴더 선택
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **환경 변수**: DB 연결 정보 설정

### 🗄️ 데이터베이스 배포

#### MySQL 클라우드 옵션:
1. **PlanetScale** (무료 티어 제공)
2. **Railway MySQL** (Railway와 함께 사용)
3. **AWS RDS** (프로덕션 환경)

### 🔄 전체 배포 플로우:
```
1. GitHub에 코드 업로드
2. 백엔드 배포 (Railway/Render) → API URL 획득
3. Vercel에서 프론트엔드 배포 + 환경변수에 API URL 설정
4. MySQL 데이터베이스 배포 → 백엔드 환경변수 설정
5. 테스트 및 도메인 연결
```
