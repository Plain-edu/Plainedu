// src/pages/LoginPage.jsx  (로그인 성공 시 대시보드 이동)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loadUserStats } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) return setErr('이메일과 비밀번호를 입력하세요.');
    try {
      setLoading(true);
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || '로그인에 실패했습니다.');

      login({
        userId: data.userId,
        email: data.email,
        name: data.name,
        nickname: data.nickname,
        gender: data.gender,
        tier: data.tier,
        subscription: data.subscription,
      });
      
      // 로그인 성공 후 사용자 통계 로드
      await loadUserStats();
      
      navigate('/dashboard');
    } catch {
      setErr('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-16">로그인</h1>
      {err && <div className="mb-4 text-red-600">{err}</div>}
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <input className="w-full p-4 border rounded-lg" type="email" placeholder="이메일"
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-4 border rounded-lg" type="password" placeholder="비밀번호"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-gray-900 text-white py-4 rounded-full text-xl font-semibold hover:bg-black"
                disabled={loading} type="submit">
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        계정이 없으신가요? <Link to="/signup" className="text-blue-600 underline">회원가입</Link>
      </div>
    </div>
  );
}
