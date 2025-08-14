import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { quizzes } from '../data/quizzes';

export default function DashboardPage() {
  const { user, quizState } = useAppState();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-gray-600">안녕하세요, {user.nickname || user.name}님!</p>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">학습 현황</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{quizState.score}</p>
              <p className="text-sm text-gray-600">완료한 퀴즈</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {Math.round((quizState.score / quizzes.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600">정답률</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
