# PlainEdu

금융 교육 플랫폼 애플리케이션입니다.

## 프로젝트 구조

```
PlainEdu-BE/
├── front/          # 프론트엔드 (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── back/           # 백엔드 (Node.js + Express)
│   ├── server/
│   ├── package.json
│   └── ...
└── README.md
```

## 실행 방법

### 백엔드 실행
```bash
cd back
npm install
npm start
```

### 프론트엔드 실행
```bash
cd front  
npm install
npm run dev
```

## 기술 스택

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL2
- CORS+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

test입니다.