// server/index.cjs
const express = require('express');
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcrypt');

// Swagger 설정 가져오기
const { swaggerSpecs, swaggerUi, swaggerUiOptions } = require('../swagger/swagger.cjs');

const app = express();

/* ----------------------- Swagger Setup ----------------------- */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerUiOptions));

/* ----------------------- CORS ----------------------- */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인에서 접속 허용 (개발용)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

/* -------------------- MySQL Pool -------------------- */
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'plain',
  database: 'plaindb',
  waitForConnections: true,
  connectionLimit: 10,
});

/* ------------------ Helper ------------------- */
const mapGender = (g) => {
  if (!g) return null;
  const s = String(g).toLowerCase();
  if (s.startsWith('m')) return 'M';
  if (s.startsWith('f')) return 'F';
  return null;
};

/* -------------------- Health ------------------ */
app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));
app.get('/api/db-test', async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute('SELECT 1');
    conn.release();
    res.json({ status: 'OK', message: 'Database connection successful' });
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: err.message });
  }
});

/* ---------------------- 회원가입 --------------------- */
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Authentication]
 *     description: 새로운 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - nickname
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: "홍길동"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *                 example: "hong@example.com"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "password123"
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *                 example: "길동이"
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 description: 성별
 *                 example: "M"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: 생성된 사용자 ID
 *                   example: 1
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 또는 성별 값 오류)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "모든 필드를 입력해주세요."
 *       409:
 *         description: 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 사용 중인 이메일입니다."
 *       500:
 *         description: 서버 오류
 */
app.post('/api/signup', async (req, res) => {
  const { name, email, password, nickname, gender } = req.body || {};
  if (!name || !email || !password || !nickname || !gender) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }
  const genderValue = mapGender(gender);
  if (!genderValue) {
    return res.status(400).json({ message: '성별 값이 올바르지 않습니다.' });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [exists] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (exists.length) return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });

      const hash = await bcrypt.hash(password, 10);
      const [result] = await conn.execute(
        `INSERT INTO users (name, email, password, nickname, gender, tier, subscription)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [name, email, hash, nickname, genderValue]
      );
      const userId = result.insertId;

      await conn.execute(`INSERT INTO user_points (user_id) VALUES (?)`, [userId]);

      res.status(201).json({ userId });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

/* ----------------------- 로그인 ---------------------- */
/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: 로그인
 *     tags: [Authentication]
 *     description: 사용자 로그인을 처리합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *                 example: "hong@example.com"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청 (이메일 또는 비밀번호 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일과 비밀번호를 입력해주세요."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 또는 비밀번호가 올바르지 않습니다."
 *       500:
 *         description: 서버 오류
 */
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT id, name, email, password, nickname, gender, tier, subscription
         FROM users WHERE email = ? LIMIT 1`,
        [email]
      );

      if (!rows.length) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

      res.json({
        userId: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        gender: user.gender,
        tier: user.tier,
        subscription: user.subscription,
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

/* --------------------- 프로필/랭킹 -------------------- */
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  if (String(userId).startsWith('user_')) {
    return res.json({
      userId,
      name: '임시 사용자',
      nickname: '게스트',
      email: 'guest@example.com',
      gender: 'M',
      tier: 0,
      subscription: 0,
      totalAssets: 1000000,
      quizProgress: 0,
      quizAccuracy: 0,
      acquiredTitles: ['첫 방문'],
    });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
      if (!rows.length) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      const u = rows[0];
      res.json({
        userId: u.id, name: u.name, nickname: u.nickname, email: u.email,
        gender: u.gender, tier: u.tier, subscription: u.subscription,
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

app.post('/api/profile', async (req, res) => {
  const { userId, nickname, gender } = req.body;
  try {
    const conn = await pool.getConnection();
    try {
      await conn.execute('UPDATE users SET nickname = ?, gender = ? WHERE id = ?', [nickname, gender, userId]);
      res.json({ message: '프로필이 저장되었습니다.' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.get('/api/rankings', async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute('SELECT nickname, tier FROM users ORDER BY tier DESC LIMIT 10');
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Rankings error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/ranking', async (req, res) => {
  const { userId, score } = req.body;
  try {
    const conn = await pool.getConnection();
    try {
      await conn.execute('UPDATE users SET tier = ? WHERE id = ?', [Math.floor((score || 0) / 10000), userId]);
      res.json({ message: '랭킹이 저장되었습니다.' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Ranking save error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/* ---------------------- 퀴즈 API ---------------------- */
/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: 퀴즈 목록 조회
 *     tags: [Quiz]
 *     description: 특정 테마의 퀴즈 문제들을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *           default: "A"
 *         description: 퀴즈 테마 (A, B, C 등)
 *         example: "A"
 *     responses:
 *       200:
 *         description: 퀴즈 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   description: 테마
 *                   example: "A"
 *                 count:
 *                   type: integer
 *                   description: 문제 개수
 *                   example: 10
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: 서버 오류
 * 
 * /api/quizzes/{theme}:
 *   get:
 *     summary: 특정 테마 퀴즈 조회
 *     tags: [Quiz]
 *     description: 특정 테마의 퀴즈 문제들을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: theme
 *         required: true
 *         schema:
 *           type: string
 *         description: 퀴즈 테마
 *         example: "A"
 *     responses:
 *       200:
 *         description: 퀴즈 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   example: "A"
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: 서버 오류
 */
// 예: /api/quizzes?theme=A  또는  /api/quizzes/A
app.get(['/api/quizzes', '/api/quizzes/:theme'], async (req, res) => {
  const theme = (req.params.theme || req.query.theme || 'A').toUpperCase();
  let conn;
  try {
    conn = await pool.getConnection();

    /* 1) OX 문제 - 새 통합 구조 */
    const [tfRows] = await conn.query(
      `
      SELECT
        q.question_id AS id,
        q.theme,
        q.difficulty,
        tf.question_text AS question,
        JSON_UNQUOTE(JSON_EXTRACT(tf.correct_answer, '$.answer'))      AS answer,
        JSON_UNQUOTE(JSON_EXTRACT(tf.correct_answer, '$.explanation')) AS explanation,
        q.points
      FROM questions q
      JOIN question_true_false tf ON q.question_id = tf.question_id
      WHERE q.theme = ? AND q.question_type = 'TRUE_FALSE'
      ORDER BY q.question_id ASC
      `,
      [theme]
    );

    /* 2) 객관식 문제 - 새 통합 구조 */
    const [mcRowsRaw] = await conn.query(
      `
      SELECT
        q.question_id AS id,
        q.theme,
        q.difficulty,
        mc.question_text AS question,
        mc.image_url,
        mc.choice_1, mc.choice_2, mc.choice_3,
        JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.answer')) AS ans_raw,
        COALESCE(
          JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.explanation')),
          JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.explaintion')),
          JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.explaination')),
          JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.explainiton')),
          JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.설명')),
          JSON_UNQUOTE(JSON_EXTRACT(mc.correct_choice, '$.해설'))
        ) AS explanation,
        q.points
      FROM questions q
      JOIN question_multiple_choice mc ON q.question_id = mc.question_id
      WHERE q.theme = ? AND q.question_type = 'MULTIPLE_CHOICE'
      ORDER BY q.question_id ASC
      `,
      [theme]
    );

    const mcRows = mcRowsRaw.map(r => {
      const choices = [r.choice_1, r.choice_2, r.choice_3];
      let answerIndex = null; let answerLetter = null;

      if (r.ans_raw != null) {
        const raw = String(r.ans_raw).trim(); const upper = raw.toUpperCase();
        if (['A','B','C'].includes(upper)) {
          answerLetter = upper; answerIndex = {A:0,B:1,C:2}[upper];
        } else if (/^[0-3]$/.test(upper)) {
          const n = Number(upper); answerIndex = (n <= 2) ? n : n - 1; answerLetter = ['A','B','C'][answerIndex];
        } else {
          const idx = choices.findIndex(c => String(c).trim() === raw);
          if (idx >= 0) { answerIndex = idx; answerLetter = ['A','B','C'][idx]; }
        }
      }

      return {
        type: 'multiple_choice',
        id: r.id, theme: r.theme, difficulty: r.difficulty,
        question: r.question, image_url: r.image_url,
        choices, answerIndex, answer: answerLetter,
        explanation: r.explanation, points: r.points
      };
    }).filter(q => q.answerIndex != null);

    /* 3) 매칭 문제 - 새 통합 구조 */
    const [matchRaw] = await conn.query(
      `
      SELECT
        q.question_id AS id,
        q.theme,
        q.difficulty,
        q.points,
        JSON_UNQUOTE(JSON_EXTRACT(m.items,'$')) AS items_json   -- 문자열로 뽑기(안전)
      FROM questions q
      JOIN question_matching m ON q.question_id = m.question_id
      WHERE q.theme = ? AND q.question_type = 'MATCHING'
      ORDER BY q.question_id ASC
      `,
      [theme]
    );

    console.log('[matching] rows:', matchRaw.length); // 🔎 몇 개 나왔는지

    const matchRows = matchRaw.map(r => {
      let pairs = [];
      try {
        const parsed = typeof r.items_json === 'string' ? JSON.parse(r.items_json) : r.items_json;
        if (Array.isArray(parsed)) {
          pairs = parsed.map((x, i) => {
            const q = x?.question ?? x?.q ?? x?.left ?? null;
            const a = x?.answer   ?? x?.a ?? x?.right ?? null;
            if (a == null) return null;
            return {
              question: (q == null || String(q).trim() === '') ? `항목 ${i + 1}` : String(q),
              answer: String(a),
            };
          }).filter(Boolean);
        } else {
          console.warn('[matching] items JSON is not array. id=', r.id, ' value=', r.items_json);
        }
      } catch (e) {
        console.error('[matching] JSON parse error. id=', r.id, 'msg=', e.message, 'value=', r.items_json);
      }

      return {
        type: 'matching',
        id: r.id,
        theme: r.theme,
        difficulty: r.difficulty ?? 0,
        points: r.points ?? 0,
        question: '다음 항목을 올바르게 연결하세요.',
        pairs
      };
    }).filter(m => m.pairs.length >= 2);

    console.log('[matching] usable items:', matchRows.length); // 🔎 최종 살아남은 개수

    /* 응답 통합 */
    const items = [
      ...tfRows.map(q => ({
        type: 'true_false',
        id: q.id, theme: q.theme, difficulty: q.difficulty,
        question: q.question, answer: q.answer,
        explanation: q.explanation, points: q.points
      })),
      ...mcRows,
      ...matchRows
    ];

    res.json({ theme, count: items.length, items });
  } catch (err) {
    console.error('Quizzes API error:', err);
    res.status(500).json({ message: '퀴즈를 불러오지 못했습니다.', error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

/* ---------------------- 퀴즈 결과 저장 (개별 문제) ---------------------- */
/**
 * @swagger
 * /api/quiz-result-single:
 *   post:
 *     summary: 개별 문제 결과 저장
 *     tags: [Quiz]
 *     description: 사용자가 푼 개별 문제의 결과를 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - questionId
 *               - solved
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *               questionId:
 *                 type: integer
 *                 description: 문제 ID
 *                 example: 101
 *               solved:
 *                 type: boolean
 *                 description: 정답 여부
 *                 example: true
 *               attemptCount:
 *                 type: integer
 *                 description: 시도 횟수
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: 결과 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "퀴즈 결과가 저장되었습니다."
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
app.post('/api/quiz-result-single', async (req, res) => {
  const { userId, questionId, solved, attemptCount = 1 } = req.body || {};
  
  if (!userId || !questionId || typeof solved !== 'boolean') {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
  }

  try {
    const conn = await pool.getConnection();
    try {
      // quiz_results 테이블에 결과 저장 (중복 시 업데이트)
      await conn.execute(
        `INSERT INTO quiz_results (user_id, question_id, solved, attempt_count, last_attempt_at) 
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
           solved = VALUES(solved), 
           attempt_count = attempt_count + 1,
           last_attempt_at = NOW()`,
        [userId, questionId, solved, attemptCount]
      );

      // 정답이면 user_points에 포인트 추가 (옵션)
      if (solved) {
        const [questionRows] = await conn.execute(
          'SELECT points FROM questions WHERE question_id = ?', 
          [questionId]
        );
        
        if (questionRows.length > 0) {
          const points = questionRows[0].points || 0;
          await conn.execute(
            `UPDATE user_points 
             SET points_balance = points_balance + ?, earned_this_month = earned_this_month + ?
             WHERE user_id = ?`,
            [points, points, userId]
          );
        }
      }

      res.json({ message: '퀴즈 결과가 저장되었습니다.' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Quiz result save error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

/* ---------------------- 퀴즈 결과 저장 (테마별 전체) ---------------------- */
/**
 * @swagger
 * /api/quiz-result:
 *   post:
 *     summary: 테마별 전체 퀴즈 결과 저장
 *     tags: [Quiz]
 *     description: 사용자가 완료한 테마별 전체 퀴즈 결과를 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizResult'
 *     responses:
 *       200:
 *         description: 퀴즈 결과 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "퀴즈 결과가 저장되었습니다."
 *                 theme:
 *                   type: string
 *                   example: "A"
 *                 score:
 *                   type: integer
 *                   example: 8
 *                 totalQuestions:
 *                   type: integer
 *                   example: 10
 *                 accuracy:
 *                   type: integer
 *                   description: 정답률 (%)
 *                   example: 80
 *       400:
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 필드가 누락되었습니다."
 *                 required:
 *                   type: string
 *                   example: "userId, theme, score, totalQuestions"
 *                 received:
 *                   type: object
 *       404:
 *         description: 해당 테마의 문제를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
app.post('/api/quiz-result', async (req, res) => {
  console.log('퀴즈 결과 저장 요청 받음:', req.body);
  const { userId, theme, score, totalQuestions } = req.body || {};
  
  if (!userId || !theme || typeof score !== 'number' || typeof totalQuestions !== 'number') {
    console.error('필수 필드 누락:', { userId, theme, score, totalQuestions });
    return res.status(400).json({ 
      message: '필수 필드가 누락되었습니다.',
      required: 'userId, theme, score, totalQuestions',
      received: { userId, theme, score, totalQuestions }
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    console.log('데이터베이스 연결 성공');
    
    // 해당 테마의 모든 문제 ID 가져오기
    const [questions] = await conn.execute(
      'SELECT question_id FROM questions WHERE theme = ? ORDER BY question_id',
      [theme]
    );
    
    console.log(`테마 ${theme}의 문제 수:`, questions.length);

    if (questions.length === 0) {
      console.error(`테마 ${theme}에 대한 문제를 찾을 수 없음`);
      return res.status(404).json({ message: '해당 테마의 문제를 찾을 수 없습니다.' });
    }

    // 각 문제에 대한 가상의 결과 저장 (실제로는 정확한 문제별 결과가 필요하지만, 
    // 현재는 전체 점수만 있으므로 비례 분배)
    const accuracy = score / totalQuestions;
    console.log('정답률:', accuracy);
    
    for (let i = 0; i < questions.length; i++) {
      const questionId = questions[i].question_id;
      const solved = i < score; // 간단히 처음 score개 문제를 맞춘 것으로 가정
      
      console.log(`문제 ${questionId} 저장: ${solved ? '정답' : '오답'}`);
      
      await conn.execute(
        `INSERT INTO quiz_results (user_id, question_id, solved, attempt_count, last_attempt_at) 
         VALUES (?, ?, ?, 1, NOW())
         ON DUPLICATE KEY UPDATE 
           solved = VALUES(solved), 
           attempt_count = attempt_count + 1,
           last_attempt_at = NOW()`,
        [userId, questionId, solved]
      );
    }

    console.log('퀴즈 결과 저장 완료');
    res.json({ 
      message: '퀴즈 결과가 저장되었습니다.',
      theme,
      score,
      totalQuestions,
      accuracy: Math.round(accuracy * 100)
    });
  } catch (err) {
    console.error('Quiz result save error:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    if (conn) {
      conn.release();
      console.log('데이터베이스 연결 해제');
    }
  }
});

/* ---------------------- 사용자 퀴즈 통계 ---------------------- */
/**
 * @swagger
 * /api/quiz-stats/{userId}:
 *   get:
 *     summary: 사용자 퀴즈 통계 조회
 *     tags: [Quiz]
 *     description: 특정 사용자의 퀴즈 진행 통계를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overall:
 *                   type: object
 *                   properties:
 *                     total_questions:
 *                       type: integer
 *                       description: 전체 문제 수
 *                       example: 100
 *                     attempted_questions:
 *                       type: integer
 *                       description: 시도한 문제 수
 *                       example: 25
 *                     solved_questions:
 *                       type: integer
 *                       description: 정답 문제 수
 *                       example: 20
 *                     accuracy_rate:
 *                       type: number
 *                       description: 정답률 (%)
 *                       example: 80.0
 *                 byTheme:
 *                   type: array
 *                   description: 테마별 통계
 *                   items:
 *                     type: object
 *                     properties:
 *                       theme:
 *                         type: string
 *                         example: "A"
 *                       total_in_theme:
 *                         type: integer
 *                         example: 10
 *                       attempted_in_theme:
 *                         type: integer
 *                         example: 8
 *                       solved_in_theme:
 *                         type: integer
 *                         example: 6
 *       500:
 *         description: 서버 오류
 */
app.get('/api/quiz-stats/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const conn = await pool.getConnection();
    try {
      // 전체 문제 수와 푼 문제 수, 정답률 계산
      const [stats] = await conn.execute(
        `SELECT 
           COUNT(DISTINCT q.question_id) as total_questions,
           COUNT(DISTINCT qr.question_id) as attempted_questions,
           COUNT(DISTINCT CASE WHEN qr.solved = 1 THEN qr.question_id END) as solved_questions,
           ROUND(
             COUNT(DISTINCT CASE WHEN qr.solved = 1 THEN qr.question_id END) * 100.0 / 
             NULLIF(COUNT(DISTINCT qr.question_id), 0), 
             1
           ) as accuracy_rate
         FROM questions q
         LEFT JOIN quiz_results qr ON q.question_id = qr.question_id AND qr.user_id = ?`,
        [userId]
      );

      // 테마별 진행 상황
      const [themeStats] = await conn.execute(
        `SELECT 
           q.theme,
           COUNT(DISTINCT q.question_id) as total_in_theme,
           COUNT(DISTINCT qr.question_id) as attempted_in_theme,
           COUNT(DISTINCT CASE WHEN qr.solved = 1 THEN qr.question_id END) as solved_in_theme
         FROM questions q
         LEFT JOIN quiz_results qr ON q.question_id = qr.question_id AND qr.user_id = ?
         GROUP BY q.theme
         ORDER BY q.theme`,
        [userId]
      );

      res.json({
        overall: stats[0],
        byTheme: themeStats
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Quiz stats error:', err);
    res.status(500).json({ message: '통계를 불러오지 못했습니다.', error: err.message });
  }
});


/* ----------------------- Start ---------------------- */
const PORT = 4000;
const HOST = '0.0.0.0'; // 모든 네트워크 인터페이스에서 접속 허용

app.listen(PORT, HOST, () => {
  console.log(`Server running at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://[your-ip]:${PORT}`);
  console.log(`- Swagger UI: http://localhost:${PORT}/api-docs`);
});
