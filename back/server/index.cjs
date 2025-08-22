// server/index.cjs
const express = require('express');
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcrypt');

const app = express();

/* ----------------------- CORS ----------------------- */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
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
// 예: /api/quizzes?theme=A  또는  /api/quizzes/A
app.get(['/api/quizzes', '/api/quizzes/:theme'], async (req, res) => {
  const theme = (req.params.theme || req.query.theme || 'A').toUpperCase();
  let conn;
  try {
    conn = await pool.getConnection();

    /* 1) OX */
    const [tfRows] = await conn.query(
      `
      SELECT
        question_id AS id,
        theme,
        difficulty,
        question_text AS question,
        JSON_UNQUOTE(JSON_EXTRACT(correct_answer, '$.answer'))      AS answer,
        JSON_UNQUOTE(JSON_EXTRACT(correct_answer, '$.explanation')) AS explanation,
        points
      FROM quiz_true_false
      WHERE theme = ?
      ORDER BY question_id ASC
      `,
      [theme]
    );

    /* 2) 3지선다 */
    const [mcRowsRaw] = await conn.query(
      `
      SELECT
        question_id AS id,
        theme,
        difficulty,
        question_text AS question,
        image_url,
        choice_1, choice_2, choice_3,
        JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.answer')) AS ans_raw,
        COALESCE(
          JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.explanation')),
          JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.explaintion')),
          JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.explaination')),
          JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.explainiton')),
          JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.설명')),
          JSON_UNQUOTE(JSON_EXTRACT(correct_choice, '$.해설'))
        ) AS explanation,
        points
      FROM quiz_multiple_choice
      WHERE theme = ?
      ORDER BY question_id ASC
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

    /* 3) 선연결(matching) */
    const [matchRaw] = await conn.query(
      `
      SELECT
        quiz_id AS id,
        theme,
        difficulty,
        points,
        JSON_UNQUOTE(JSON_EXTRACT(items,'$')) AS items_json   -- 문자열로 뽑기(안전)
      FROM matching_quiz
      WHERE theme = ?
      ORDER BY quiz_id ASC
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


/* ----------------------- Start ---------------------- */
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
