import React from 'react';
import { useNavigate } from 'react-router-dom';

const BadgeReceivePage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="bg-blue-100 rounded-full p-8 mb-8">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="6" fill="#3385FF"/>
          <path d="M12 14C8 14 4 16 4 18V20H20V18C20 16 16 14 12 14Z" fill="#66B2FF"/>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">배지 획득!</h1>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">주린이</h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        금융의 첫걸음을 시작했습니다!<br />
        앞으로도 열심히 공부해보세요.
      </p>
      <button
        className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/dashboard')}
      >
        대시보드로 이동
      </button>
    </div>
  );
};

export default BadgeReceivePage;
