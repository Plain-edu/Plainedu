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

#### � **Render** (가장 추천 - 무료):
1. [Render.com](https://render.com) 접속
2. **New** → **Web Service** 
3. **Connect Repository**: `Plain-edu/Plainedu` 선택
4. **Settings**:
   ```
   Name: plainedu-backend
   Root Directory: back
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. **Environment Variables**:
   ```
   DB_HOST = (무료 MySQL DB 호스트)
   DB_USER = (DB 사용자명)
   DB_PASSWORD = (DB 비밀번호) 
   DB_DATABASE = plainedu
   PORT = 10000
   ```

#### 🌐 **Vercel** (서버리스 함수로):
- Vercel은 서버리스 함수도 지원하므로 백엔드도 배포 가능
- `back` 폴더를 별도 Vercel 프로젝트로 배포

#### 🆓 **무료 데이터베이스 옵션**:
1. **PlanetScale** - MySQL 무료 티어 (가장 추천)
2. **Supabase** - PostgreSQL 무료 티어  
3. **MongoDB Atlas** - NoSQL 무료 티어
4. **Render PostgreSQL** - Render에서 제공

#### ❌ **Railway 제외 이유**:
- 무료 티어 제한적
- 더 좋은 무료 대안들 존재

### 🗄️ 데이터베이스 배포

#### 🌟 **PlanetScale** (가장 추천):
1. [PlanetScale.com](https://planetscale.com) 가입
2. **New Database** → 이름: `plainedu`
3. **Connect** → **Connect with**: `mysql2`
4. 연결 정보를 백엔드 환경변수에 설정

#### 🆓 **기타 무료 옵션**:
1. **Supabase** - PostgreSQL (코드 수정 필요)
2. **MongoDB Atlas** - NoSQL (스키마 변경 필요)
3. **Render PostgreSQL** - 백엔드와 함께 사용

### 🔄 **간편한 배포 플로우** (Railway 없이):
```
1. GitHub에 코드 업로드 ✅
2. PlanetScale에서 MySQL DB 생성 → 연결 정보 획득
3. Render에서 백엔드 배포 + DB 환경변수 설정 → API URL 획득  
4. Vercel에서 프론트엔드 배포 + API URL 환경변수 설정
5. 완료! 🎉
```

#### 💡 **추천 조합**:
- **프론트엔드**: Vercel (무료, 빠름)
- **백엔드**: Render (무료, 안정적)  
- **데이터베이스**: PlanetScale (무료, MySQL)
