# Plain Edu Backend

금융 교육 앱의 백엔드 서버입니다.

## 📁 프로젝트 구조

```
back/
├── server.js        # Express 서버 메인 파일 (API 엔드포인트 정의)
├── db.js           # MySQL 연결 풀 설정 및 데이터베이스 연결 관리
├── package.json    # 의존성 및 스크립트 정의
├── .env.example    # 환경 변수 예제 파일
├── .gitignore      # Git 무시 파일 목록
└── README.md       # 이 문서
```

## 🔗 파일별 역할

### `server.js` - 메인 서버 파일
- **역할**: Express 웹 서버 및 REST API 엔드포인트 정의
- **주요 기능**:
  - 사용자 프로필 CRUD API (`/api/users/:userId/profile`)
  - 퀴즈 데이터 조회 API (`/api/quizzes`)
  - 랭킹 조회 API (`/api/rankings`)
  - CORS 설정 및 JSON 파싱 미들웨어
- **연결**: `db.js`에서 MySQL 연결 풀을 import하여 데이터베이스 쿼리 실행

### `db.js` - 데이터베이스 연결 관리
- **역할**: MySQL 데이터베이스와의 연결 풀 생성 및 관리
- **주요 기능**:
  - 환경 변수 기반 DB 연결 설정
  - 연결 풀로 성능 최적화 (최대 10개 동시 연결)
  - 연결 상태 확인 및 에러 처리
- **연결**: `server.js`에서 pool 객체로 import

## 🚀 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 연결 정보를 입력하세요
```

3. MySQL 데이터베이스 설정:
- MySQL 서버가 실행 중인지 확인
- `plaindb` 데이터베이스 생성
- 필요한 테이블 생성 (users, quizzes 등)

4. 서버 실행:
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### 1. 사용자 프로필 관리
- **GET** `/api/users/:userId/profile` - 사용자 프로필 조회
  - **목적**: 특정 사용자의 프로필 정보 조회
  - **응답**: 사용자 프로필 객체 또는 404 에러
  - **연결**: 프론트엔드 `utils/api.js`의 `fetchUserProfile`

- **POST** `/api/users/:userId/profile` - 사용자 프로필 생성/업데이트
  - **목적**: 사용자 프로필 정보 생성 또는 업데이트 (UPSERT)
  - **요청 본문**: 프로필 데이터 (name, phone, nickname 등)
  - **연결**: 프론트엔드 `utils/api.js`의 `saveUserProfile`

### 2. 퀴즈 시스템
- **GET** `/api/quizzes` - 모든 퀴즈 조회
  - **목적**: 퀴즈 문제, 선택지, 정답, 해설 조회
  - **응답**: 퀴즈 데이터 배열
  - **연결**: 프론트엔드 `QuizPage` 컴포넌트

### 3. 랭킹 시스템
- **GET** `/api/rankings` - 랭킹 조회
  - **목적**: 점수 기준 사용자 랭킹 조회 (상위 100명)
  - **응답**: 랭킹 데이터 배열
  - **연결**: 프론트엔드 `RankingPage` 컴포넌트

## 환경 변수

`.env` 파일에 다음 환경 변수들을 설정해야 합니다:

```bash
# 데이터베이스 연결 설정
DB_HOST=localhost          # MySQL 호스트 주소
DB_USER=your_username      # MySQL 사용자명
DB_PASSWORD=your_password  # MySQL 비밀번호
DB_DATABASE=plaindb        # 데이터베이스 이름

# 서버 설정
PORT=5000                  # 서버 포트 (기본값: 5000)
NODE_ENV=development       # 환경 모드
```

## 🗄️ 데이터베이스 구조

### `users` 테이블
- 사용자 프로필 정보 저장
- 주요 필드: id, name, phone, nickname, score, acquired_titles(JSON)

### `quizzes` 테이블
- 퀴즈 문제 데이터 저장
- 주요 필드: id, question, options(JSON), answer, explanation

## 🔗 프론트엔드와의 연결

```
Frontend(React) ↔ Express Server ↔ MySQL Database
     ↓                   ↓                ↓
  utils/api.js      server.js + db.js    users/quizzes 테이블
```

### 데이터 흐름:
1. **프론트엔드**: 사용자 액션 발생
2. **api.js**: HTTP 요청 생성 및 전송
3. **server.js**: 요청 처리 및 비즈니스 로직 실행
4. **db.js**: MySQL 연결 풀을 통한 데이터베이스 쿼리
5. **응답**: JSON 형태로 프론트엔드에 데이터 반환
