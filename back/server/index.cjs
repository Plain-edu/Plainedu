// server/index.cjs (또는 index.js)
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
  password: 'wkddnjs788',
  database: 'plaindb',
  waitForConnections: true,
  connectionLimit: 10,
});

/* ------------------ Helper 함수들 ------------------- */
const mapGender = (g) => {
  // 프론트에서 'male'/'female'로 올 수도 있고 'M'/'F'로 올 수도 있으니 통일
  if (!g) return null;
  const s = String(g).toLowerCase();
  if (s.startsWith('m')) return 'M';
  if (s.startsWith('f')) return 'F';
  return null;
};

/* -------------------- Health Check ------------------ */
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
  console.log('Signup request received:', req.body);

  const { name, email, password, nickname, gender } = req.body || {};
  if (!name || !email || !password || !nickname || !gender) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  // 'male'/'female' 혹은 'M'/'F' → DB ENUM('M','F')로 맞춤
  const genderValue = mapGender(gender);
  if (!genderValue) {
    return res.status(400).json({ message: '성별 값이 올바르지 않습니다.' });
  }

  try {
    const conn = await pool.getConnection();
    try {
      // 이메일 중복
      const [exists] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (exists.length) return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });

      // 비밀번호 해시
      const hash = await bcrypt.hash(password, 10);

      // users 생성 (tier=0, subscription=0)
      const [result] = await conn.execute(
        `INSERT INTO users (name, email, password, nickname, gender, tier, subscription)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [name, email, hash, nickname, genderValue]
      );
      const userId = result.insertId;

      // user_points 초기 레코드 (컬럼 기본값 가정)
      await conn.execute(`INSERT INTO user_points (user_id) VALUES (?)`, [userId]);

      console.log('Signup successful for user:', userId);
      res.status(201).json({ userId });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Signup error:', err);
    // 유니크 제약 방어
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

/* ----------------------- 로그인 ---------------------- */
/* POST /api/signin
   body: { email, password }
   성공 시: { userId, email, name, nickname, gender, tier, subscription } */
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

      if (!rows.length) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      // 비밀번호 제외하고 반환
      return res.json({
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

  // 데모용 임시 ID 대응
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

/* ----------------------- Start ---------------------- */
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
