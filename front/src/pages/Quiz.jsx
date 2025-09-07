// src/pages/Quiz.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export default function Quiz() {
  const { theme: rawTheme } = useParams();
  const theme = (rawTheme || 'A').toUpperCase();
  const nav = useNavigate();
  const { saveQuizResult, auth } = useAppState();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  // OX/3지선다 공용 선택
  const [selected, setSelected] = useState(null); // 'O' | 'X' | 0 | 1 | 2
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  // 🔹 matching 전용 상태
  const [mRight, setMRight] = useState([]);              // 우측(답) 셔플된 배열 [{text, orig}]
  const [mMap, setMMap] = useState({});                  // 왼쪽 index -> 오른쪽 index
  const [mActiveLeft, setMActiveLeft] = useState(null);  // 현재 선택된 왼쪽 index

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        setIdx(0);
        setSelected(null);
        setShowResult(false);
        setScore(0);

        const res = await fetch(`http://localhost:4000/api/quizzes?theme=${encodeURIComponent(theme)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (ignore) return;

        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (!ignore) setError('퀴즈를 불러오지 못했습니다.');
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [theme]);

  const current = items[idx];

  // 현재 문항 바뀔 때 matching 상태 초기화 & 우측 셔플 생성
  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setMMap({});
    setMActiveLeft(null);

    if (current?.type === 'matching') {
      const answers = (current.pairs || []).map((p, i) => ({ text: p.answer, orig: i }));
      // 간단 셔플
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
      setMRight(answers);
    } else {
      setMRight([]);
    }
  }, [idx, current?.type, current?.pairs]);

  // 3지선다용 정답 인덱스 계산
  const getAnswerIndex = (q) => {
    if (!q) return null;
    if (typeof q.answerIndex === 'number') return q.answerIndex;
    const map = { A: 0, B: 1, C: 2 };
    if (typeof q.answer === 'string') {
      const s = q.answer.toUpperCase();
      if (map[s] !== undefined) return map[s];
    }
    if (typeof q.answer === 'number') return q.answer <= 2 ? q.answer : q.answer - 1;
    return null;
  };

  // matching 채점 준비 상태
  const mAllPaired = useMemo(() => {
    if (current?.type !== 'matching') return false;
    const n = current.pairs?.length || 0;
    return Object.keys(mMap).length === n;
  }, [current, mMap]);

  // 🔁 오른쪽 사용 역맵: rightIndex -> leftIndex (해당 오른쪽을 누가 쓰는지)
  const mRev = useMemo(() => {
    const r = {};
    Object.entries(mMap).forEach(([l, rIdx]) => { r[rIdx] = Number(l); });
    return r;
  }, [mMap]);

  // 정답 여부
  const isCorrect = useMemo(() => {
    if (!current) return false;

    if (current.type === 'true_false') {
      return selected != null && selected === current.answer; // 'O'|'X'
    }

    if (current.type === 'multiple_choice') {
      const ansIdx = getAnswerIndex(current);
      return selected != null && selected === ansIdx;
    }

    if (current.type === 'matching') {
      // 모든 연결이 맞아야 정답
      const n = current.pairs?.length || 0;
      if (n === 0 || !mAllPaired) return false;
      for (let left = 0; left < n; left++) {
        const right = mMap[left];
        if (right == null) return false;
        if (mRight[right]?.orig !== left) return false; // 셔플 전 원래 인덱스가 같아야 함
      }
      return true;
    }

    return false;
  }, [current, selected, mAllPaired, mMap, mRight]);

  const onSelectTF = (v) => !showResult && setSelected(v);
  const onSelectMC = (i) => !showResult && setSelected(i);

  // matching: 왼쪽 클릭 → 선택 토글
  const onLeftPick = (i) => {
    if (showResult) return;
    setMActiveLeft(prev => (prev === i ? null : i));
  };

  // matching: 오른쪽 클릭 → 연결/해제/재배정
  const onRightPick = (j) => {
    if (showResult) return;

    // 왼쪽이 선택되지 않은 상태에서 '이미 사용 중'인 오른쪽을 누르면,
    // 그 오른쪽을 쓰는 왼쪽을 자동 선택해서 수정 모드로 전환
    if (mActiveLeft == null) {
      const owner = mRev[j];
      if (owner != null) setMActiveLeft(owner);
      return;
    }

    setMMap(prev => {
      const next = { ...prev };

      // 같은 오른쪽을 한 번 더 누르면 해당 연결 해제(토글)
      if (next[mActiveLeft] === j) {
        delete next[mActiveLeft];
        return next;
      }

      // j를 사용 중인 다른 왼쪽이 있으면 그 연결 해제
      for (const [l, rIdx] of Object.entries(next)) {
        if (rIdx === j) delete next[l];
      }

      // 활성 왼쪽의 기존 연결 해제 후 새로 연결
      delete next[mActiveLeft];
      next[mActiveLeft] = j;
      return next;
    });

    setMActiveLeft(null);
  };

  // matching: 개별 해제(왼쪽 i의 연결 제거)
  const onUnpairLeft = (i) => {
    if (showResult) return;
    setMMap(prev => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
    if (mActiveLeft === i) setMActiveLeft(null);
  };

  // matching: 개별 해제(오른쪽 j의 연결 제거)
  const onUnpairRight = (j) => {
    if (showResult) return;
    setMMap(prev => {
      const next = { ...prev };
      for (const [l, rIdx] of Object.entries(next)) {
        if (rIdx === j) delete next[l];
      }
      return next;
    });
    setMActiveLeft(null);
  };

  // matching: 전체 초기화
  const onClearAll = () => {
    if (showResult) return;
    setMMap({});
    setMActiveLeft(null);
  };

  const onCheck = () => {
    if (!current || showResult) return;

    if (current.type === 'matching') {
      if (!mAllPaired) return; // 다 연결해야 확인 가능
    } else if (selected == null) {
      return;
    }

    setShowResult(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const onNext = async () => {
    if (idx + 1 < items.length) {
      setIdx(i => i + 1);
    } else {
      // 퀴즈 완료 - 결과를 백엔드에 저장
      console.log('퀴즈 완료:', { theme, score, totalQuestions: items.length, auth });
      
      if (!auth?.userId) {
        console.error('로그인되지 않음 - 결과 저장 불가');
        alert(`퀴즈 종료! 점수: ${score}/${items.length}\n(로그인이 필요합니다)`);
        nav('/theme');
        return;
      }
      
      try {
        console.log('퀴즈 결과 저장 시작...');
        console.log('전송할 데이터:', { theme, score, totalQuestions: items.length, userId: auth.userId });
        await saveQuizResult(theme, score, items.length);
        console.log('퀴즈 결과 저장 완료');
        alert(`퀴즈 종료! 점수: ${score}/${items.length}\n결과가 저장되었습니다!`);
      } catch (error) {
        console.error('결과 저장 실패:', error);
        console.error('에러 메시지:', error.message);
        alert(`퀴즈 종료! 점수: ${score}/${items.length}\n결과 저장에 실패했습니다: ${error.message}`);
      }
      nav('/theme');
    }
  };

  if (loading) return <div className="p-6">불러오는 중…</div>;
  if (error)   return (
    <div className="p-6">
      <div className="text-red-600">{error}</div>
      <button className="mt-4 px-4 py-2 border rounded" onClick={() => nav('/theme')}>테마 선택으로</button>
    </div>
  );
  if (!current) return (
    <div className="p-6">
      <div>문항이 없습니다. (theme={theme})</div>
      <button className="mt-4 px-4 py-2 border rounded" onClick={() => nav('/theme')}>테마 선택으로</button>
    </div>
  );

  // matching 정답 라벨/텍스트(결과 표시용)
  const correctIdx = current.type === 'multiple_choice' ? getAnswerIndex(current) : null;
  const correctLabel = correctIdx != null ? String.fromCharCode(65 + correctIdx) : null;
  const correctText  = correctIdx != null ? (current?.choices?.[correctIdx] ?? '') : '';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-6 flex items-center gap-3">
        <button className="px-3 py-1 border rounded" onClick={() => nav('/theme')}>← 테마</button>
        <h1 className="text-xl font-semibold">테마 {theme} 퀴즈</h1>
        <div className="ml-auto text-sm text-gray-600">
          {idx + 1} / {items.length} · 점수 {score}
        </div>
      </header>

      <article className="bg-white rounded-xl shadow p-6">
        <div className="text-sm text-gray-500 mb-2">
          유형:{' '}
          {current.type === 'true_false' ? 'OX' :
           current.type === 'multiple_choice' ? '3지선다' : '선 연결하기'}{' '}
          · 난이도 {current.difficulty}
        </div>

        <h2 className="text-lg font-bold mb-4">{current.question || '다음 항목을 올바르게 연결하세요.'}</h2>

        {/* 문제 이미지 (3지선다에서 쓸 수 있음) */}
        {current.image_url && (
          <img src={current.image_url} alt="" className="mb-5 max-h-60 object-contain rounded" />
        )}

        {current.type === 'true_false' && (
          <div className="flex gap-3">
            {['O','X'].map(x => (
              <button
                key={x}
                onClick={() => onSelectTF(x)}
                className={`px-4 py-2 rounded border ${selected===x ? 'border-blue-600' : 'border-gray-300'}`}
              >
                {x}
              </button>
            ))}
          </div>
        )}

        {current.type === 'multiple_choice' && (
          <div className="grid gap-3">
            {(current.choices || []).map((c, i) => (
              <button
                key={i}
                onClick={() => onSelectMC(i)}
                className={`text-left px-4 py-3 rounded border ${selected===i ? 'border-blue-600' : 'border-gray-300'}`}
              >
                {String.fromCharCode(65 + i)}. {c}
              </button>
            ))}
          </div>
        )}

        {current.type === 'matching' && (
          <div className="grid grid-cols-2 gap-6">
            {/* 왼쪽: 질문들 */}
            <div>
              <h3 className="font-semibold mb-2">왼쪽</h3>
              <div className="space-y-2">
                {(current.pairs || []).map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      onClick={() => onLeftPick(i)}
                      className={`flex-1 text-left px-3 py-2 rounded border
                        ${mActiveLeft===i ? 'border-blue-600' : 'border-gray-300'}
                        ${mMap[i]!=null ? 'bg-blue-50' : ''}`}
                    >
                      {i + 1}. {p.question}
                      {mMap[i]!=null && (
                        <span className="ml-2 text-xs text-blue-700">
                          → {String.fromCharCode(65 + mMap[i])}
                        </span>
                      )}
                    </button>
                    {mMap[i]!=null && (
                      <button
                        aria-label="이 연결 해제"
                        onClick={() => onUnpairLeft(i)}
                        className="px-2 py-1 text-sm border rounded"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 셔플된 답 */}
            <div>
              <h3 className="font-semibold mb-2">오른쪽</h3>
              <div className="space-y-2">
                {mRight.map((r, j) => {
                  const used = Object.values(mMap).includes(j);
                  return (
                    <div key={j} className="flex items-center gap-2">
                      <button
                        disabled={false} // 사용 중이어도 눌러서 재배정/해제 가능
                        onClick={() => onRightPick(j)}
                        className={`flex-1 text-left px-3 py-2 rounded border
                          ${used ? 'bg-gray-50' : ''}
                          ${mActiveLeft!=null ? 'border-blue-300' : 'border-gray-300'}`}
                      >
                        {String.fromCharCode(65 + j)}. {r.text}
                        {used && <span className="ml-2 text-xs text-gray-500">(사용 중)</span>}
                      </button>
                      {used && (
                        <button
                          aria-label="이 연결 해제"
                          onClick={() => onUnpairRight(j)}
                          className="px-2 py-1 text-sm border rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          {!showResult ? (
            <>
              <button
                onClick={onCheck}
                disabled={current.type === 'matching' ? !mAllPaired : selected == null}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              >
                정답 확인
              </button>
              {current.type === 'matching' && (
                <button onClick={onClearAll} className="px-3 py-2 rounded border">
                  전체 초기화
                </button>
              )}
            </>
          ) : (
            <>
              <span className={`px-3 py-1 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isCorrect ? '정답!' : '오답!'}
              </span>

              {/* 3지선다 정답/해설 */}
              {current.type === 'multiple_choice' && (
                <div className="text-gray-700">
                  <div><b>정답:</b> {correctLabel}. {correctText}</div>
                  {current.explanation && <div className="mt-1">{current.explanation}</div>}
                </div>
              )}

              {/* matching 결과: 정답 매핑 보여주기 */}
              {current.type === 'matching' && (
                <div className="text-gray-700">
                  <div className="font-semibold">정답 매핑</div>
                  <ul className="list-disc ml-5">
                    {current.pairs.map((p, i) => (
                      <li key={i}>
                        {i+1}. {p.question} → {
                          String.fromCharCode(65 + mRight.findIndex(r => r.orig === i))
                        }. {p.answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* OX 해설 */}
              {current.type === 'true_false' && current.explanation && (
                <div className="text-gray-700">{current.explanation}</div>
              )}

              <button className="ml-auto px-4 py-2 rounded bg-gray-900 text-white" onClick={onNext}>
                다음
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
