// src/pages/SignupWithTerms.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export default function SignupWithTerms() {
  const navigate = useNavigate();
  const { user, updateUser, login } = useAppState();

  // 로컬 상태(전화/OTP는 DB에 저장 안 함)
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // 약관
  const [agreeTerms, setAgreeTerms] = useState(false);     // [필수]
  const [agreePrivacy, setAgreePrivacy] = useState(false); // [필수]
  const [agreeMkt, setAgreeMkt] = useState(false);         // [선택]

  const validateAll = () => {
    const { name, email, password, nickname, gender } = user;
    if (!name || !email || !password || !nickname || !gender) return '모든 필드를 입력해주세요.';
    if (!/\S+@\S+\.\S+/.test(email)) return '유효한 이메일 주소를 입력해주세요.';
    if (password.length < 6) return '비밀번호는 6자 이상이어야 합니다.';
    if (nickname.length > 100) return '닉네임은 100자 이하여야 합니다.';
    if (!agreeTerms || !agreePrivacy) return '[필수] 약관에 동의해주세요.';
    return '';
  };

  const validatePhone = () => {
    if (!phone) return '전화번호를 입력해주세요.';
    const digits = phone.replace(/\D/g, '');
    if (!(digits.length === 10 || digits.length === 11)) return '전화번호 형식을 확인해주세요.';
    return '';
  };

  // 인증 발송
  const sendOtp = () => {
    setErr('');
    const p = validatePhone();
    if (p) return setErr(p);
    setOtpSent(true);
    alert('인증번호를 발송했어요. (데모코드: 1234)');
  };

  // 인증 + 회원가입
  const verifyAndSignup = async () => {
    setErr('');
    const vAll = validateAll();
    if (vAll) return setErr(vAll);

    const p = validatePhone();
    if (p) return setErr(p);

    if (otp !== '1234') return setErr('인증번호가 올바르지 않습니다.');

    try {
      setLoading(true);
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 전화번호는 DB 저장 안 함
        body: JSON.stringify(user), // name, email, password, nickname, gender
      });
      const data = await res.json();
      if (!res.ok) {
        return setErr(data.message || '회원가입에 실패했습니다.');
      }

      // 가입 성공 → 로그인 상태 저장 → 퀴즈로 이동
      login({
        userId: data.userId,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        gender: user.gender,
        tier: 0,
        subscription: 0,
      });
      navigate('/quiz'); // ← 퀴즈 페이지로 이동
    } catch {
      setErr('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onPhoneButtonClick = () => {
    if (!otpSent) sendOtp();
    else verifyAndSignup();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-16">회원가입</h1>
      {err && <div className="mb-4 text-red-600">{err}</div>}

      <div className="w-full max-w-md space-y-4">
        <input className="w-full p-4 border rounded-lg" placeholder="이름"
               value={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
        <input className="w-full p-4 border rounded-lg" type="email" placeholder="이메일"
               value={user.email} onChange={(e) => updateUser({ email: e.target.value })} />
        <input className="w-full p-4 border rounded-lg" type="password" placeholder="비밀번호 (신규, 6자 이상)"
               value={user.password} onChange={(e) => updateUser({ password: e.target.value })} />
        <input className="w-full p-4 border rounded-lg" placeholder="닉네임"
               value={user.nickname} onChange={(e) => updateUser({ nickname: e.target.value })} />
        <select className="w-full p-4 border rounded-lg" value={user.gender}
                onChange={(e) => updateUser({ gender: e.target.value })}>
          <option value="M">남성</option>
          <option value="F">여성</option>
        </select>

        {/* 전화번호 + 버튼 */}
        <div>
          <label className="block mb-2 text-gray-800 font-semibold">전화번호</label>
          <div className="flex gap-2">
            <input
              className="flex-1 p-4 border rounded-lg"
              type="tel"
              placeholder="예) 01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              onClick={onPhoneButtonClick}
              disabled={loading}
            >
              {loading ? '처리 중...' : (otpSent ? '인증하기' : '인증 발송')}
            </button>
          </div>

          {otpSent && (
            <div className="mt-3">
              <input
                className="w-full p-4 border rounded-lg text-center tracking-widest"
                placeholder="인증번호 4자리 (데모: 1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
              />
            </div>
          )}
        </div>

        {/* 약관 */}
        <div className="mt-4 space-y-3 border rounded-lg p-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <span>[필수] 서비스 이용약관 동의</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
            <span>[필수] 개인정보 처리방침 동의</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={agreeMkt} onChange={(e) => setAgreeMkt(e.target.checked)} />
            <span>[선택] 마케팅 정보 수신 동의</span>
          </label>
        </div>

        <div className="mt-2 text-sm text-gray-600 text-center">
          이미 계정이 있으신가요? <Link to="/signin" className="text-blue-600 underline">로그인</Link>
        </div>
      </div>
    </div>
  );
}
