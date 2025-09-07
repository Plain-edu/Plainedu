import React, { useEffect } from 'react';
// useNavigate를 import 합니다.
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export default function DashboardPage() {
  const { user, auth, userStats, loadUserStats } = useAppState();
  // navigate 함수를 사용할 수 있도록 설정합니다.
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 사용자 통계 로드
  useEffect(() => {
    if (auth?.userId) {
      loadUserStats();
    }
  }, [auth?.userId, loadUserStats]);

  // 버튼 클릭 시 '/theme' 경로로 이동하는 함수
  const handleStartQuiz = () => {
    navigate('/theme');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-gray-600">안녕하세요, {user.nickname || user.name}님!</p>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">학습 현황</h2>
          
          {userStats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {userStats.overall?.attempted_questions || 0}
                </p>
                <p className="text-sm text-gray-600">시도한 문제 수</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {userStats.overall?.accuracy_rate || 0}%
                </p>
                <p className="text-sm text-gray-600">전체 정답률</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {userStats.overall?.solved_questions || 0}
                </p>
                <p className="text-sm text-gray-600">정답 문제 수</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {userStats.overall?.total_questions || 0}
                </p>
                <p className="text-sm text-gray-600">전체 문제 수</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">시도한 문제 수</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">0%</p>
                <p className="text-sm text-gray-600">전체 정답률</p>
              </div>
            </div>
          )}

          {/* 테마별 통계 */}
          {userStats && userStats.byTheme && userStats.byTheme.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">테마별 성과</h3>
              <div className="grid gap-2">
                {userStats.byTheme.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">테마 {stat.theme}</span>
                    <div className="text-sm text-gray-600">
                      {stat.attempted_in_theme}/{stat.total_in_theme} 시도 · 
                      {stat.solved_in_theme}/{stat.attempted_in_theme} 정답
                      {stat.attempted_in_theme > 0 && 
                        ` · ${Math.round((stat.solved_in_theme / stat.attempted_in_theme) * 100)}% 정답률`
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          {/* 버튼에 onClick 이벤트 핸들러를 추가합니다. */}
          <button
            onClick={handleStartQuiz}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            새로운 퀴즈 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}