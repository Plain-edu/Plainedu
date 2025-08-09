import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';

// Quiz data (hardcoded for demonstration)
const quizzes = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: "'주식'이란 무엇을 의미하나요?",
    options: [
      '기업의 소유권을 나타내는 증서',
      '은행에 예치한 예금',
      '외환 거래에 사용되는 통화',
    ],
    answer: '기업의 소유권을 나타내는 증서',
    explanation: '주식을 소유하면, 해당 회사의 지분을 보유하게 되며, 주주로서 배당금이나 의결권 등의 권리를 가질 수 있습니다.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: "'PER'이란 무엇을 의미하나요?",
    options: [
      '부채와 자본의 비율',
      '배당금 지급 비율',
      '주가와 기업 이익의 비율',
    ],
    answer: '주가와 기업 이익의 비율',
    explanation: "'PER'은 회사의 순이익에 대비해 주가가 얼마나 높은지를 나타내는 지표입니다.",
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: "다음 중 인플레이션에 대한 올바른 설명은 무엇인가요?",
    options: [
      '상품과 서비스의 전반적인 가격 수준이 지속적으로 하락하는 현상',
      '화폐의 구매력이 상승하여 동일한 금액으로 더 많은 상품을 구매할 수 있는 현상',
      '상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상',
    ],
    answer: '상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상',
    explanation: '인플레이션은 상품과 서비스의 전반적인 가격 수준이 지속적으로 상승하는 현상을 의미합니다.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    question: "투자 포트폴리오를 구성할 때 분산 투자의 주요 목적은 무엇인가요?",
    options: [
      '단일 자산에 집중하여 최대한의 수익을 얻기 위해',
      '다양한 자산에 투자하여 위험을 감소시키기 위해',
      '시장의 특정 트렌드를 따라 수익을 극대화하기 위해',
    ],
    answer: '다양한 자산에 투자하여 위험을 감소시키기 위해',
    explanation: '분산 투자의 주요 목적은 다양한 자산에 투자하여 위험을 감소시키고 안정적인 수익을 추구하는 것입니다.',
  },
  {
    id: 'q5',
    type: 'fill-in-the-blank',
    question: "기업이 투자자에게 이익의 일부를 나눠주기 위해 지급하는 것을 (이)라고 합니다.",
    options: [
      '금리',
      '이자',
      '지원금',
      '배당금',
    ],
    answer: '배당금',
    explanation: '배당금은 주식 투자자들에게 돌아가는 이익의 형태로, 주식의 보유 비율에 따라 지급됩니다.',
  },
];

// Main App Component  
const App = () => {
  // If we're on the /signup route, render SignupPage
  if (window.location.pathname === '/signup') {
    return (
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    );
  }

  // Otherwise render the main quiz app
  return <QuizApp />;
};

// Separate Quiz App Component
const QuizApp = () => {
  const [currentPage, setCurrentPage] = useState('splash');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [userGender, setUserGender] = useState('');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [, setRankings] = useState([]);
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(180);
  const [otpRunning, setOtpRunning] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  // Replace Firebase auth with simple local userId generation
  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', storedId);
    }
    setUserId(storedId);
    setIsAuthReady(true);
  }, []);

  // Fetch rankings from MySQL server
  useEffect(() => {
    if (isAuthReady && userId) {
      fetch('http://localhost:4000/api/rankings')
        .then(res => res.json())
        .then(data => setRankings(data))
        .catch(() => {
          // Handle error silently
        });
    }
  }, [isAuthReady, userId]);

  const showCustomPopup = (message) => {
    alert(message);
  };

  const startOtpTimer = () => {
    setOtpTimer(180);
    setOtpRunning(true);
  };

  useEffect(() => {
    let timer;
    if (otpRunning && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpRunning(false);
      showCustomPopup('인증 시간이 만료되었습니다. 재요청해주세요.');
    }
    return () => clearInterval(timer);
  }, [otpRunning, otpTimer]);

  const handleSignup = async () => {
    if (!name || !email || !password || !nickname || !userGender) {
      showCustomPopup('모든 필드를 입력해주세요.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showCustomPopup('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      showCustomPopup('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (nickname.length > 25) {
      showCustomPopup('닉네임은 25자 이하여야 합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, nickname, gender: userGender }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userId', data.userId);
        setUserId(data.userId);
        showCustomPopup('회원가입이 완료되었습니다!');
        setCurrentPage('terms');
      } else {
        showCustomPopup(data.message || '회원가입에 실패했습니다.');
      }
    } catch {
      showCustomPopup('서버 오류가 발생했습니다.');
    }
  };

  const handleNextPage = () => {
    switch (currentPage) {
      case 'splash':
        setCurrentPage('welcome');
        break;
      case 'welcome':
        setCurrentPage('signup');
        break;
      case 'signup':
        handleSignup();
        break;
      case 'terms':
        if (!termsAgreed || !privacyAgreed) {
          showCustomPopup('필수 약관에 동의해주세요.');
          return;
        }
        setCurrentPage('otp');
        startOtpTimer();
        break;
      case 'otp':
        if (otpInput === '1234') {
          setCurrentPage('quizIntro');
        } else {
          showCustomPopup('인증번호가 올바르지 않습니다.');
        }
        break;
      case 'quizIntro':
        setCurrentPage('quiz');
        break;
      case 'quiz': {
        if (showResult) {
          if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedOption(null);
            setShowResult(false);
            setIsCorrect(false);
          } else {
            setCurrentPage('quizComplete');
          }
        } else {
          if (selectedOption === null) {
            showCustomPopup('답변을 선택해주세요.');
            return;
          }
          const currentQuiz = quizzes[currentQuizIndex];
          const correct = selectedOption === currentQuiz.answer;
          setIsCorrect(correct);
          setShowResult(true);
          if (correct) {
            setQuizScore(prevScore => prevScore + 1);
          }
        }
        break;
      }
      case 'quizComplete':
        setCurrentPage('badgeReceive');
        break;
      case 'badgeReceive':
        setCurrentPage('dashboard');
        break;
      case 'dashboard':
        break;
      case 'profile':
        break;
      case 'ranking':
        break;
      default:
        setCurrentPage('splash');
    }
  };

  // Render current page
  switch (currentPage) {
    case 'splash':
      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen bg-white cursor-pointer"
          onClick={handleNextPage}
        >
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50C10 22.3858 32.3858 0 60 0C87.6142 0 110 22.3858 110 50C110 77.6142 87.6142 100 60 100C32.3858 100 10 77.6142 10 50Z" fill="#66B2FF"/>
            <path d="M90 50C90 22.3858 112.386 0 140 0C167.614 0 190 22.3858 190 50C190 77.6142 167.614 100 140 100C112.386 100 90 77.6142 90 50Z" fill="#3385FF"/>
            <path d="M100 40C100 17.9086 117.909 0 140 0C162.091 0 180 17.9086 180 40C180 62.0914 162.091 80 140 80C117.909 80 100 62.0914 100 40Z" fill="#0056B3"/>
          </svg>
          <p className="mt-8 text-2xl font-bold text-gray-800">화면을 터치 해주세요</p>
        </div>
      );

    case 'welcome':
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
          <div className="bg-gray-100 rounded-full p-8 mb-8 shadow-lg">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6C2 4.89543 2.89543 4 4 4H12C13.1046 4 14 4.89543 14 6V18C14 19.1046 13.1046 20 12 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#66B2FF"/>
              <path d="M10 6C10 4.89543 10.8954 4 12 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H12C10.8954 20 10 19.1046 10 18V6Z" fill="#3385FF"/>
              <path d="M12 4L12 20" stroke="#0056B3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">주린이</h1>
          <p className="text-lg text-gray-600 mb-8">금융공부를 시작해볼게요!</p>
          <button
            className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
            onClick={handleNextPage}
          >
            시작
          </button>
        </div>
      );

    case 'signup':
      return (
        <div className="flex flex-col items-center min-h-screen bg-white p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-16">회원가입</h1>
          <div className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="이름"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="이메일"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="닉네임"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <select
              className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              value={userGender}
              onChange={(e) => setUserGender(e.target.value)}
            >
              <option value="">성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            <button
              className="w-full bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors mt-8"
              onClick={handleNextPage}
            >
              회원가입
            </button>
          </div>
        </div>
      );

    case 'terms':
      return (
        <div className="flex flex-col min-h-screen bg-white p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-16 text-center">이용약관 동의</h1>
          <div className="flex-1 space-y-6">
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="terms" className="font-semibold text-gray-800">
                  [필수] 서비스 이용약관 동의
                </label>
              </div>
              <p className="text-sm text-gray-600">
                주린이 서비스 이용에 관한 기본적인 규칙과 정책에 동의합니다.
              </p>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="privacy" className="font-semibold text-gray-800">
                  [필수] 개인정보 처리방침 동의
                </label>
              </div>
              <p className="text-sm text-gray-600">
                개인정보 수집, 이용, 보관에 관한 정책에 동의합니다.
              </p>
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={marketingAgreed}
                  onChange={(e) => setMarketingAgreed(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="marketing" className="font-semibold text-gray-800">
                  [선택] 마케팅 정보 수신 동의
                </label>
              </div>
              <p className="text-sm text-gray-600">
                새로운 서비스, 이벤트 정보를 이메일로 받아보실 수 있습니다.
              </p>
            </div>
          </div>
          
          <button
            className="w-full bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors mt-8"
            onClick={handleNextPage}
          >
            동의하고 계속하기
          </button>
        </div>
      );

    case 'otp':
      return (
        <div className="flex flex-col items-center min-h-screen bg-white p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-16">본인 인증</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            등록하신 이메일로 발송된<br />
            인증번호를 입력해주세요
          </p>
          <div className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="인증번호 입력 (1234)"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg text-center"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              maxLength={4}
            />
            <p className="text-center text-gray-600">
              남은 시간: {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
            </p>
            <button
              className="w-full bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleNextPage}
            >
              인증하기
            </button>
            <button
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors"
              onClick={startOtpTimer}
              disabled={otpRunning}
            >
              인증번호 재발송
            </button>
          </div>
        </div>
      );

    case 'quizIntro':
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
          <div className="bg-blue-100 rounded-full p-8 mb-8">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1046 2 14 2.89543 14 4V6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6V4C10 2.89543 10.8954 2 12 2Z" fill="#3385FF"/>
              <path d="M12 16C13.1046 16 14 16.8954 14 18V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V18C10 16.8954 10.8954 16 12 16Z" fill="#3385FF"/>
              <circle cx="12" cy="12" r="3" fill="#66B2FF"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">금융 퀴즈 시작</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            총 {quizzes.length}문제의 퀴즈를 통해<br />
            금융 지식을 테스트해보세요!
          </p>
          <button
            className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
            onClick={handleNextPage}
          >
            퀴즈 시작
          </button>
        </div>
      );

    case 'quiz': {
      const currentQuiz = quizzes[currentQuizIndex];
      return (
        <div className="flex flex-col items-center min-h-screen bg-white p-4">
          <div className="w-full flex justify-end mb-4">
            <span className="text-lg font-semibold text-gray-600">
              {currentQuizIndex + 1} / {quizzes.length}
            </span>
          </div>
          <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQuiz.question}</h2>
            <div className="space-y-4">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full p-4 rounded-lg border text-left text-lg font-medium transition-colors
                    ${selectedOption === option
                      ? (showResult ? (isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800') : 'bg-blue-100 border-blue-500 text-blue-800')
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    ${showResult && currentQuiz.answer === option ? 'border-green-500 bg-green-100 text-green-800' : ''}
                  `}
                  onClick={() => !showResult && setSelectedOption(option)}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {showResult && (
            <div className={`w-full max-w-md p-4 rounded-lg mt-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white text-center font-bold text-lg`}>
              {isCorrect ? '정답입니다!' : '오답입니다'}
              {!isCorrect && <p className="text-sm mt-2">정답: {currentQuiz.answer}</p>}
              <p className="text-sm mt-2">{currentQuiz.explanation}</p>
            </div>
          )}
          <button
            className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors mt-8"
            onClick={handleNextPage}
          >
            {showResult ? (currentQuizIndex < quizzes.length - 1 ? '다음 문제' : '결과 보기') : '답안 확인'}
          </button>
        </div>
      );
    }

    case 'quizComplete':
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
          <div className="bg-yellow-100 rounded-full p-8 mb-8">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" fill="#FFD700"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 완료!</h1>
          <p className="text-xl text-gray-600 mb-4">
            총 {quizzes.length}문제 중 {quizScore}문제 정답
          </p>
          <p className="text-lg text-gray-600 mb-8">
            정답률: {Math.round((quizScore / quizzes.length) * 100)}%
          </p>
          <button
            className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
            onClick={handleNextPage}
          >
            배지 받기
          </button>
        </div>
      );

    case 'badgeReceive':
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
            onClick={handleNextPage}
          >
            대시보드로 이동
          </button>
        </div>
      );

    case 'dashboard':
      return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm p-4">
            <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
            <p className="text-gray-600">안녕하세요, {nickname}님!</p>
          </div>
          <div className="flex-1 p-4 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">학습 현황</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{quizScore}</p>
                  <p className="text-sm text-gray-600">완료한 퀴즈</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{Math.round((quizScore / quizzes.length) * 100)}%</p>
                  <p className="text-sm text-gray-600">정답률</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">획득 배지</h2>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-4">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="6" fill="#3385FF"/>
                    <path d="M12 14C8 14 4 16 4 18V20H20V18C20 16 16 14 12 14Z" fill="#66B2FF"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">주린이</p>
                  <p className="text-sm text-gray-600">금융의 첫걸음</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="bg-blue-600 text-white p-6 rounded-lg text-center font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                onClick={() => setCurrentPage('profile')}
              >
                <div className="mb-2">👤</div>
                프로필
              </button>
              <button
                className="bg-green-600 text-white p-6 rounded-lg text-center font-semibold shadow-sm hover:bg-green-700 transition-colors"
                onClick={() => setCurrentPage('ranking')}
              >
                <div className="mb-2">🏆</div>
                랭킹
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <h1 className="text-3xl font-bold text-gray-800">페이지 개발 중...</h1>
          <p className="text-lg text-gray-600 mt-4">현재 페이지: {currentPage}</p>
          <button
            className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => setCurrentPage('splash')}
          >
            처음으로 돌아가기
          </button>
        </div>
      );
  }
};

export default App;
