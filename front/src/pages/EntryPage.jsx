// src/pages/EntryPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EntryPage = () => {
  const [step, setStep] = useState('splash'); // splash → welcome
  const navigate = useNavigate();

  if (step === 'splash') {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-white cursor-pointer"
        onClick={() => setStep('welcome')}
      >
        {/* 기존 스플래시 SVG */}
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 50C10 22.3858 32.3858 0 60 0C87.6142 0 110 22.3858 110 50C110 77.6142 87.6142 100 60 100C32.3858 100 10 77.6142 10 50Z" fill="#66B2FF"/>
          <path d="M90 50C90 22.3858 112.386 0 140 0C167.614 0 190 22.3858 190 50C190 77.6142 167.614 100 140 100C112.386 100 90 77.6142 90 50Z" fill="#3385FF"/>
          <path d="M100 40C100 17.9086 117.909 0 140 0C162.091 0 180 17.9086 180 40C180 62.0914 162.091 80 140 80C117.909 80 100 62.0914 100 40Z" fill="#0056B3"/>
        </svg>
        <p className="mt-8 text-2xl font-bold text-gray-800">화면을 터치 해주세요</p>
      </div>
    );
  }

  // welcome: 로그인/회원가입 선택
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-full p-8 mb-8 shadow-lg">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 6C2 4.89543 2.89543 4 4 4H12C13.1046 4 14 4.89543 14 6V18C14 19.1046 13.1046 20 12 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#66B2FF"/>
          <path d="M10 6C10 4.89543 10.8954 4 12 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H12C10.8954 20 10 19.1046 10 18V6Z" fill="#3385FF"/>
          <path d="M12 4L12 20" stroke="#0056B3" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">주린이</h1>
      <p className="text-lg text-gray-600 mb-8">금융공부를 시작해볼게요!</p>

      <div className="w-full max-w-sm grid grid-cols-2 gap-3">
        <button
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          onClick={() => navigate('/signup')}  // ← 회원가입 페이지로
        >
          회원가입
        </button>
        <button
          className="bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black"
          onClick={() => navigate('/signin')}  // ← 로그인 페이지로
        >
          로그인
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        회원가입 시 약관 동의가 진행됩니다.
      </p>
    </div>
  );
};

export default EntryPage;
