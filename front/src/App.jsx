// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import EntryPage from './pages/EntryPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Quiz from './pages/Quiz';
import DashboardPage from './pages/DashboardPage';
import BadgeReceivePage from './pages/BadgeReceivePage';
import QuizThemePage from './pages/QuizThemePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />

      {/* 인증 */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<LoginPage />} />

      {/* 퀴즈: /quiz -> 테마 선택으로, /quiz/:theme -> 해당 테마 퀴즈 */}
      <Route path="/quiz" element={<Navigate to="/theme" replace />} />
      <Route path="/quiz/:theme" element={<Quiz />} />

      {/* 배지/대시보드 */}
      <Route path="/badge" element={<BadgeReceivePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* 테마 선택 */}
      <Route path="/theme" element={<QuizThemePage />} />

      {/* 그 외 모든 경로는 랜딩으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
