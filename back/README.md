# PlainEdu Backend

백엔드 API 서버입니다.

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

- `GET /` - 서버 상태 확인
- `POST /api/signup` - 회원가입
- `GET /api/profile/:userId` - 사용자 프로필 조회
- `POST /api/profile` - 사용자 프로필 저장
- `GET /api/rankings` - 랭킹 조회
- `POST /api/ranking` - 랭킹 저장
