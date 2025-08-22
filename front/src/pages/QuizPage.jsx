import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { useAppState } from '../context/AppStateContext';

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizState, addScore, resetScore } = useAppState();

  // intro | play | result
  const [stage, setStage] = useState('intro');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const current = quizzes[idx];

  const startQuiz = () => {
    resetScore();
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setIsCorrect(false);
    setStage('play');
  };

  const submitAnswer = () => {
    if (selected == null) return alert('답변을 선택해주세요.');
    const correct = selected === current.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) addScore(1);
  };

  const nextStep = () => {
    if (idx < quizzes.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setStage('result');
    }
  };

  const restart = () => {
    setStage('intro');
    resetScore();
    setIdx(0);
    setSelected(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  if (stage === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="bg-blue-100 rounded-full p-8 mb-8">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1046 2 14 2.89543 14 4V6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6V4C10 2.89543 10.8954 2 12 2Z" fill="#3385FF"/>
            <path d="M12 16C13.1046 16 14 16.8954 14 18V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V18C10 16.8954 10.8954 16 12 16Z" fill="#3385FF"/>
            <circle cx="12" cy="12" r="3" fill="#66B2FF"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">금융 퀴즈</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          총 {quizzes.length}문제의 퀴즈로 지식을 테스트해 보세요.
        </p>
        <button
          className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-full text-xl font-semibold hover:bg-blue-700"
          onClick={startQuiz}
        >
          시작하기
        </button>
      </div>
    );
  }

  if (stage === 'result') {
    const pct = Math.round((quizState.score / quizzes.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="bg-yellow-100 rounded-full p-8 mb-8">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" fill="#FFD700"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 완료!</h1>
        <p className="text-xl text-gray-600 mb-4">총 {quizzes.length}문제 중 {quizState.score}문제 정답</p>
        <p className="text-lg text-gray-600 mb-8">정답률: {pct}%</p>

        <div className="w-full max-w-sm grid grid-cols-2 gap-3">
          <button
            className="bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 col-span-2"
            onClick={() => navigate('/badge')}
          >
            배지 받기
          </button>
          {/* 필요하면 재시작도 제공 */}
          <button
            className="bg-gray-200 text-gray-900 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300"
            onClick={restart}
          >
            다시 풀기
          </button>
        </div>
      </div>
    );
  }

  // stage === 'play'
  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <div className="w-full flex justify-end mb-4">
        <span className="text-lg font-semibold text-gray-600">
          {idx + 1} / {quizzes.length}
        </span>
      </div>

      <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{current.question}</h2>
        <div className="space-y-4">
          {current.options.map((opt) => (
            <button
              key={opt}
              disabled={showResult}
              onClick={() => !showResult && setSelected(opt)}
              className={`w-full p-4 rounded-lg border text-left text-lg transition
                ${selected === opt
                  ? (showResult ? (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
                                : 'bg-blue-100 border-blue-500')
                  : 'bg-white border-gray-300 hover:bg-gray-50'}
                ${showResult && current.answer === opt ? 'border-green-500 bg-green-100' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className={`w-full max-w-md p-4 rounded-lg mt-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white text-center font-bold text-lg`}>
          {isCorrect ? '정답입니다!' : '오답입니다'}
          {!isCorrect && <p className="text-sm mt-2">정답: {current.answer}</p>}
          <p className="text-sm mt-2">{current.explanation}</p>
        </div>
      )}

      <div className="w-full max-w-sm mt-8">
        {!showResult ? (
          <button className="w-full bg-blue-600 text-white py-4 rounded-full text-xl font-semibold hover:bg-blue-700"
                  onClick={submitAnswer}>
            답안 확인
          </button>
        ) : (
          <button className="w-full bg-blue-600 text-white py-4 rounded-full text-xl font-semibold hover:bg-blue-700"
                  onClick={nextStep}>
            {idx < quizzes.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  );
}
