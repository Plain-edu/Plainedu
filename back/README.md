# PlainEdu Backend

백엔드 API 서버입니다.

## 🆕 DB 구조 업데이트 (2025-09-07)

**새로운 통합형 구조**로 마이그레이션 완료:
- `questions` (문제 마스터 테이블)
- `question_multiple_choice` (객관식 상세)
- `question_true_false` (OX 상세)
- `question_matching` (매칭 상세)
- `quiz_results` (사용자별 풀이 결과) ✨ 새로 추가

## 설치 및 실행

```bash
cd back
npm install
npm start
```

## 기술 스택

- Node.js
- Express.js
- MySQL2
- CORS

## API 엔드포인트

### 인증 & 사용자
- `GET /api/health` - 서버 상태 확인
- `GET /api/db-test` - DB 연결 테스트
- `POST /api/signup` - 회원가입
- `POST /api/signin` - 로그인
- `GET /api/profile/:userId` - 사용자 프로필 조회
- `POST /api/profile` - 사용자 프로필 저장
- `GET /api/rankings` - 랭킹 조회
- `POST /api/ranking` - 랭킹 저장

### 퀴즈
- `GET /api/quizzes` - 모든 퀴즈 조회
- `GET /api/quizzes/:theme` - 테마별 퀴즈 조회
- `POST /api/quiz-result` - 퀴즈 결과 저장 ✨ 새로 추가
- `GET /api/quiz-stats/:userId` - 사용자 퀴즈 통계 ✨ 새로 추가

## 🎯 새로운 기능

### 퀴즈 결과 추적
```javascript
// 문제 풀이 결과 저장
POST /api/quiz-result
{
  "userId": 1,
  "questionId": 123,
  "solved": true,
  "attemptCount": 1
}
```

### 사용자 통계
```javascript
// 사용자별 퀴즈 통계 조회
GET /api/quiz-stats/1
// 응답: 전체 진행률, 정답률, 테마별 통계
```
