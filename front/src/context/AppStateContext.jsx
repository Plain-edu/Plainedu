import React, { createContext, useContext, useMemo, useState } from 'react';

const AppStateCtx = createContext(null);

export function AppStateProvider({ children }) {
  // 회원가입 폼용 임시 상태
  const [user, setUser] = useState({
    name: '', email: '', password: '', nickname: '', gender: 'M',
  });

  // 로그인 성공 시 저장할 인증 상태
  const [auth, setAuth] = useState(null); // { userId, email, name, nickname, gender, ... }

  // 퀴즈 점수 상태 추가
  const [quizState, setQuizState] = useState({ score: 0 });

  const updateUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));
  const login = (payload) => setAuth(payload);
  const logout = () => setAuth(null);
  const addScore = (n) => setQuizState((prev) => ({ score: prev.score + n }));
  const resetScore = () => setQuizState({ score: 0 });

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
    }),
    [user, auth, quizState]
  );
  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
