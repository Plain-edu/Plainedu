/**
 * Plain Edu 백엔드 서버
 * 
 * 목적: 금융 교육 앱의 REST API 서버
 * 
 * 주요 기능:
 * 1. 사용자 프로필 관리 (CRUD)
 * 2. 퀴즈 데이터 제공
 * 3. 랭킹 시스템 관리
 * 4. MySQL 데이터베이스와의 통신
 * 
 * 기술 스택:
 * - Express.js: 웹 프레임워크
 * - MySQL2: 데이터베이스 연결
 * - CORS: 크로스 오리진 요청 허용
 * - dotenv: 환경 변수 관리
 * 
 * 연결 구조:
 * Frontend(React) ↔ Express Server ↔ MySQL Database
 * 
 * API 엔드포인트:
 * - GET/POST /api/users/:userId/profile - 사용자 프로필
 * - GET /api/quizzes - 퀴즈 데이터
 * - GET /api/rankings - 랭킹 데이터
 */

const express = require('express');
const cors = require('cors');
const pool = require('./db'); // MySQL 연결 풀 (db.js)
require('dotenv').config();   // 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 5000; // 서버 포트 (기본: 5000)

// ========== 미들웨어 설정 ==========
app.use(cors()); // CORS 허용 (프론트엔드와 통신을 위해 필요)
app.use(express.json()); // JSON 파싱 미들웨어 (POST 요청 body 파싱)

// ========== 서버 상태 확인 엔드포인트 ==========
app.get('/', (req, res) => {
    res.send('Plain Edu 백엔드 서버가 실행 중입니다!');
});

// ========== API 엔드포인트 정의 ==========

/**
 * 사용자 프로필 조회 API
 * 
 * @route   GET /api/users/:userId/profile
 * @desc    특정 사용자의 프로필 정보를 조회
 * @param   {string} userId - 사용자 고유 ID
 * @returns {Object} 사용자 프로필 데이터 또는 404 에러
 * 
 * 연결: 프론트엔드 utils/api.js의 fetchUserProfile 함수
 */
app.get('/api/users/:userId/profile', async (req, res) => {
    const { userId } = req.params; // URL에서 사용자 ID 추출
    
    try {
        // MySQL에서 사용자 정보 조회
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        
        if (rows.length > 0) {
            const userProfile = rows[0];
            // MySQL JSON 타입 필드 처리 (acquired_titles)
            userProfile.acquiredTitles = userProfile.acquired_titles || [];
            delete userProfile.acquired_titles; // 원본 필드명 제거
            userProfile.acquiredTitles = userProfile.acquired_titles || [];
            delete userProfile.acquired_titles; // 원본 필드명 제거

            res.json(userProfile); // 성공 응답: 사용자 프로필 데이터 반환
        } else {
            // 사용자가 존재하지 않는 경우 404 응답
            res.status(404).json({ message: 'User profile not found, please create it.' });
        }
    } catch (err) {
        console.error('사용자 프로필 조회 오류:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }
});

/**
 * 사용자 프로필 생성/업데이트 API
 * 
 * @route   POST /api/users/:userId/profile
 * @desc    사용자 프로필 정보를 생성하거나 업데이트 (UPSERT)
 * @param   {string} userId - 사용자 고유 ID
 * @body    {Object} 프로필 데이터 (name, phone, nickname 등)
 * @returns {Object} 성공 메시지 또는 에러
 * 
 * 연결: 프론트엔드 utils/api.js의 saveUserProfile 함수
 */
app.post('/api/users/:userId/profile', async (req, res) => {
    const { userId } = req.params;
    // 프론트엔드에서 전송된 프로필 데이터 추출
    const { name, phone, nickname, gender, birthdate, totalAssets, quizProgress, quizAccuracy, acquiredTitles, score } = req.body;

    // MySQL JSON 타입 필드 처리 (배열을 JSON 문자열로 변환)
    const acquiredTitlesJson = JSON.stringify(acquiredTitles || []);

    try {
        // UPSERT 쿼리: 사용자 ID가 존재하면 업데이트, 없으면 새로 생성
        const [result] = await pool.execute(
            `INSERT INTO users (id, name, phone, nickname, gender, birthdate, total_assets, quiz_progress, quiz_accuracy, acquired_titles, score)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             name = VALUES(name), phone = VALUES(phone), nickname = VALUES(nickname), gender = VALUES(gender), birthdate = VALUES(birthdate),
             total_assets = VALUES(total_assets), quiz_progress = VALUES(quiz_progress), quiz_accuracy = VALUES(quiz_accuracy),
             acquired_titles = VALUES(acquired_titles), score = VALUES(score), updated_at = CURRENT_TIMESTAMP`,
            [userId, name, phone, nickname, gender, birthdate, totalAssets, quizProgress, quizAccuracy, acquiredTitlesJson, score]
        );
        
        res.status(200).json({ message: '프로필이 성공적으로 저장되었습니다!', result });
    } catch (err) {
        console.error('사용자 프로필 저장/업데이트 오류:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }
});

/**
 * 퀴즈 목록 조회 API
 * 
 * @route   GET /api/quizzes
 * @desc    모든 퀴즈 문제와 선택지를 조회
 * @returns {Array} 퀴즈 데이터 배열 (문제, 선택지, 정답, 해설)
 * 
 * 연결: 프론트엔드 utils/api.js의 fetchQuizzes 함수
 * 사용처: QuizPage 컴포넌트에서 퀴즈 데이터 로드
 */
app.get('/api/quizzes', async (req, res) => {
    try {
        // quizzes 테이블에서 모든 퀴즈 데이터 조회
        const [rows] = await pool.execute('SELECT id, type, question, options, answer, explanation FROM quizzes');
        
        // MySQL JSON 타입 필드(options) 처리
        const quizzes = rows.map(quiz => ({
            ...quiz,
            options: quiz.options // mysql2 드라이버가 자동으로 JSON 파싱
        }));
        
        res.json(quizzes); // 퀴즈 데이터 배열 응답
    } catch (err) {
        console.error('퀴즈 조회 오류:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }
});

/**
 * 랭킹 조회 API
 * 
 * @route   GET /api/rankings
 * @desc    점수 기준으로 정렬된 사용자 랭킹을 조회
 * @returns {Array} 랭킹 데이터 배열 (상위 100명)
 * 
 * 연결: 프론트엔드 utils/api.js의 fetchRankings 함수
 * 사용처: RankingPage 컴포넌트에서 랭킹 표시
 */
app.get('/api/rankings', async (req, res) => {
    try {
        // 점수 기준 내림차순으로 상위 100명 조회
        const [rows] = await pool.execute(
            'SELECT id as userId, nickname, score, acquired_titles FROM users ORDER BY score DESC LIMIT 100'
        );
        
        // MySQL JSON 타입 필드 처리
        const rankings = rows.map(row => ({
            ...row,
            acquired_titles: row.acquired_titles || [] // NULL 처리
        }));
        
        res.json(rankings); // 랭킹 데이터 배열 응답
    } catch (err) {
        console.error('랭킹 조회 오류:', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }
});

// ========== 서버 시작 ==========
app.listen(PORT, () => {
    console.log(`Plain Edu 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`API 문서: http://localhost:${PORT}/api 엔드포인트들을 사용하세요.`);
});
