const express = require('express');
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcrypt');

const app = express();
app.use(express.json());

// MySQL Pool 설정 — 실제 DB 정보로 수정하세요
const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'wkddnjs788',
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

    // users 테이블에 사용자 등록 (tier=0, subscription=0 기본값)
    const [result] = await conn.execute(
      `INSERT INTO users
       (name, email, password, nickname, gender, tier, subscription)
       VALUES (?, ?, ?, ?, ?, 0, 0)`,
      [name, email, hash, nickname, gender]
    );
    const userId = result.insertId;

    // user_points 초기 정보 생성
    await conn.execute(
      `INSERT INTO user_points (user_id)
       VALUES (?)`,
      [userId]
    );

    conn.release();
    res.status(201).json({ userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));