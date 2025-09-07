import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 이 페이지는 더 이상 사용되지 않습니다. 
// 새로운 테마별 퀴즈 시스템으로 리다이렉트합니다.
export default function QuizPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 테마 선택 페이지로 리다이렉트
    navigate('/theme', { replace: true });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">페이지 이동 중...</h1>
        <p className="text-gray-600">새로운 퀴즈 시스템으로 이동하고 있습니다.</p>
      </div>
    </div>
  );
}
