// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import EntryPage from './pages/EntryPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import BadgeReceivePage from './pages/BadgeReceivePage';

export default function App() {
  return (
    <Routes>
      {/* 랜딩 */}
      <Route path="/" element={<EntryPage />} />

      {/* 인증 */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<LoginPage />} />

      {/* 퀴즈 & 배지 */}
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/badge" element={<BadgeReceivePage />} />

      {/* 대시보드 페이지 */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* 그 외 모든 경로는 랜딩으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
