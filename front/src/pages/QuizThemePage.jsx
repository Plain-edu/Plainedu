// src/pages/QuizThemePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 테마 코드와 제목 매핑 (A~P)
// 제목은 네가 준 리스트 그대로, 오타는 "채권이란?"으로 수정
const QUIZ_THEMES = [
  { code: 'A', title: '주식이란? → 주식의 정의와 기본 개념' },
  { code: 'B', title: '시가총액 → 기업 가치를 나타내는 기준' },
  { code: 'C', title: '지수는 어떻게 만들어질까?' },
  { code: 'D', title: '지수의 종류 1편' },
  { code: 'E', title: '지수의 종류 2편' },
  { code: 'F', title: '채권이란? → 채권의 기본 개념' },
  { code: 'G', title: '투자 위험 → 주식투자는 원금을 잃을 수도 있다' },
  { code: 'H', title: '증권사 선택 → 내게 맞는 증권사는 어디?' },
  { code: 'I', title: '주식계좌 개설 → 계좌를 여는 3가지 방법' },
  { code: 'J', title: 'HTS와 MTS → 주식매매 프로그램의 이해' },
  { code: 'K', title: '호가창의 이해 → 매매 전 알아야 할 주문 흐름' },
  { code: 'L', title: '주식 주문 종류 → 시장가, 지정가 등 다양한 방법' },
  { code: 'M', title: '주식시장 거래 시간 → 시간대별 거래 방식' },
  { code: 'N', title: '배당금이란?' },
  { code: 'O', title: '배당락과 결제일 배당 기준일 → 이해' },
  { code: 'P', title: '보통주 vs 우선주 → 투자 시 알아야 할 차이' },
];

export default function QuizThemePage() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">퀴즈 주제 선택</h1>
        <p className="text-gray-600">학습하고 싶은 주제를 선택하세요.</p>
      </div>

      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUIZ_THEMES.map(({ code, title }) => (
            <button
              key={code}
              onClick={() => nav(`/quiz/${code}`)}  
              className="w-full bg-white p-4 rounded-lg shadow-sm text-left text-gray-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
