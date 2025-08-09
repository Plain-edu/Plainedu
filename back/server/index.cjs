const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// MySQL Pool 설정 — 실제 DB 정보로 수정하세요
const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'plain',
  database: 'plaindb',
  waitForConnections: true,
  connectionLimit: 10,
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password, nickname, gender } = req.body;
  if (!name || !email || !password || !nickname || !gender) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    const conn = await pool.getConnection();

    // 이메일 중복 검사
    const [exists] = await conn.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (exists.length > 0) {
      conn.release();
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hash = await bcrypt.hash(password, 10);

    // gender 값을 DB 형식에 맞게 변환 (male -> M, female -> F)
    const genderValue = gender === 'male' ? 'M' : 'F';

    // users 테이블에 사용자 등록 (tier=0, subscription=0 기본값)
    const [result] = await conn.execute(
      `INSERT INTO users
       (name, email, password, nickname, gender, tier, subscription)
       VALUES (?, ?, ?, ?, ?, 0, 0)`,
      [name, email, hash, nickname, genderValue]
    );
    const userId = result.insertId;

    // user_points 초기 정보 생성
    await conn.execute(
      `INSERT INTO user_points (user_id)
       VALUES (?)`,
      [userId]
    );

    conn.release();
    console.log('Signup successful for user:', userId);
    res.status(201).json({ userId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

// 서버 상태 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 데이터베이스 연결 테스트 엔드포인트
app.get('/api/db-test', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute('SELECT 1');
    conn.release();
    res.json({ status: 'OK', message: 'Database connection successful' });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: err.message });
  }
});

app.post('/api/signup', async (req, res) => {
  console.log('Signup request received:', req.body);
  const { name, email, password, nickname, gender } = req.body;
  if (!name || !email || !password || !nickname || !gender) {
    console.log('Missing required fields:', { name, email, password: !!password, nickname, gender });
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    console.log('Attempting database connection...');
    const conn = await pool.getConnection();
    console.log('Database connection successful');

    // 이메일 중복 검사
    const [exists] = await conn.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (exists.length > 0) {
      conn.release();
      console.log('Email already exists:', email);
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 해싱
    console.log('Hashing password...');
    const hash = await bcrypt.hash(password, 10);

    // users 테이블에 사용자 등록 (tier=0, subscription=0 기본값)
    console.log('Inserting user into database...');
    const [result] = await conn.execute(
      `INSERT INTO users
       (name, email, password, nickname, gender, tier, subscription)
       VALUES (?, ?, ?, ?, ?, 0, 0)`,
      [name, email, hash, nickname, gender]
    );
    const userId = result.insertId;
    console.log('User created with ID:', userId);

    // user_points 초기 정보 생성
    console.log('Creating user_points record...');
    await conn.execute(
      `INSERT INTO user_points (user_id)
       VALUES (?)`,
      [userId]
    );

    conn.release();
    console.log('Signup successful for user:', userId);
    res.status(201).json({ userId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

// 사용자 프로필 조회
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Profile request for userId:', userId);
  
  // 임시 사용자 ID (user_xxx 형태)인 경우 기본 프로필 반환
  if (userId.startsWith('user_')) {
    console.log('Returning default profile for temporary user:', userId);
    return res.json({
      userId: userId,
      name: '임시 사용자',
      nickname: '게스트',
      email: 'guest@example.com',
      gender: 'other',
      tier: 0,
      subscription: 0,
      totalAssets: 1000000,
      quizProgress: 0,
      quizAccuracy: 0,
      acquiredTitles: ['첫 방문']
    });
  }
  
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      conn.release();
      console.log('User not found in database:', userId);
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    const user = users[0];
    conn.release();
    console.log('User profile found:', user.id);
    res.json({
      userId: user.id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      gender: user.gender,
      tier: user.tier,
      subscription: user.subscription
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: err.message });
  }
});

// 사용자 프로필 저장/업데이트
app.post('/api/profile', async (req, res) => {
  const { userId, nickname, gender, birthdate, totalAssets, quizProgress, quizAccuracy, acquiredTitles, score } = req.body;
  
  try {
    const conn = await pool.getConnection();
    
    // 사용자 정보 업데이트
    await conn.execute(
      'UPDATE users SET nickname = ?, gender = ? WHERE id = ?',
      [nickname, gender, userId]
    );
    
    conn.release();
    res.json({ message: '프로필이 저장되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 랭킹 조회
app.get('/api/rankings', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rankings] = await conn.execute(
      'SELECT u.nickname, u.tier FROM users u ORDER BY u.tier DESC LIMIT 10'
    );
    
    conn.release();
    res.json(rankings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 랭킹 저장/업데이트
app.post('/api/ranking', async (req, res) => {
  const { userId, nickname, score, title } = req.body;
  
  try {
    const conn = await pool.getConnection();
    
    // 사용자의 tier 업데이트 (점수 기반)
    await conn.execute(
      'UPDATE users SET tier = ? WHERE id = ?',
      [Math.floor(score / 10000), userId]
    );
    
    conn.release();
    res.json({ message: '랭킹이 저장되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));