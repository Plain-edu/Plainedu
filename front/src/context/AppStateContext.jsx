import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const AppStateCtx = createContext(null);

export function AppStateProvider({ children }) {
  // 회원가입 폼용 임시 상태
  const [user, setUser] = useState({
    name: '', email: '', password: '', nickname: '', gender: 'M',
  });

  // 로그인 성공 시 저장할 인증 상태
  const [auth, setAuth] = useState(null); // { userId, email, name, nickname, gender, ... }

  // 퀴즈 점수 상태 (세션용 - 단일 퀴즈 시도)
  const [quizState, setQuizState] = useState({ score: 0 });

  // 퀴즈 통계 상태 (사용자 전체 통계)
  const [userStats, setUserStats] = useState(null);

  const updateUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));
  const login = (payload) => setAuth(payload);
  const logout = () => {
    setAuth(null);
    setUserStats(null);
  };
  
  // 세션용 점수 관리 (단일 퀴즈)
  const addScore = (n) => setQuizState((prev) => ({ score: prev.score + n }));
  const resetScore = () => setQuizState({ score: 0 });

  // 퀴즈 결과를 백엔드에 저장
  const saveQuizResult = async (theme, score, totalQuestions) => {
    console.log('saveQuizResult 호출됨:', { theme, score, totalQuestions, userId: auth?.userId });
    
    if (!auth?.userId) {
      console.error('사용자 인증 정보가 없음');
      return;
    }
    
    try {
      console.log('백엔드로 퀴즈 결과 전송 중...');
      const requestData = {
        userId: auth.userId,
        theme,
        score,
        totalQuestions
      };
      console.log('요청 데이터:', requestData);
      
      const response = await fetch('http://localhost:4000/api/quiz-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      console.log('응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('서버 응답 에러:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('서버 응답 데이터:', responseData);
      console.log('퀴즈 결과 저장 성공, 통계 갱신 중...');
      
      // 결과 저장 후 통계 갱신
      await loadUserStats();
      console.log('통계 갱신 완료');
    } catch (error) {
      console.error('퀴즈 결과 저장 실패:', error);
      console.error('에러 상세:', error.message);
      console.error('에러 스택:', error.stack);
      throw error;
    }
  };

  // 사용자 통계 로드
  const loadUserStats = async () => {
    if (!auth?.userId) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/quiz-stats/${auth.userId}`);
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('통계 로드 실패:', error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      updateUser,
      auth,
      login,
      logout,
      quizState,
      addScore,
      resetScore,
      userStats,
      saveQuizResult,
      loadUserStats,
    }),
    [user, auth, quizState, userStats]
  );
  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
