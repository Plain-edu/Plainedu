/**
 * MySQL 데이터베이스 연결 설정
 * 
 * 목적: MySQL 데이터베이스와의 안정적인 연결 관리
 * 
 * 주요 기능:
 * 1. MySQL 연결 풀(Connection Pool) 생성
 * 2. 환경 변수를 통한 DB 설정 관리
 * 3. 연결 상태 확인 및 에러 처리
 * 4. 다중 연결 지원으로 성능 최적화
 * 
 * 연결 풀의 장점:
 * - 연결 재사용으로 성능 향상
 * - 동시 접속자 수 제한으로 안정성 확보
 * - 자동 연결 관리로 메모리 누수 방지
 * 
 * 환경 변수 (.env 파일):
 * - DB_HOST: 데이터베이스 호스트
 * - DB_USER: 데이터베이스 사용자명
 * - DB_PASSWORD: 데이터베이스 비밀번호
 * - DB_DATABASE: 데이터베이스 이름
 * 
 * 사용처: server.js에서 pool 객체로 import하여 쿼리 실행
 */

const mysql = require('mysql2/promise'); // Promise 기반 MySQL 드라이버
require('dotenv').config(); // 환경 변수 로드

// Railway DATABASE_URL 파싱 함수
function parseDatabaseUrl(url) {
    if (!url) return null;
    const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) return null;
    
    return {
        user: match[1],
        password: match[2],
        host: match[3],
        port: parseInt(match[4]),
        database: match[5]
    };
}

// 연결 설정 결정
let connectionConfig;

if (process.env.DATABASE_URL) {
    // Railway 환경에서는 DATABASE_URL 사용
    const urlConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    connectionConfig = urlConfig || {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    };
} else {
    // 로컬 환경에서는 개별 환경변수 사용
    connectionConfig = {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    };
}

// 연결 풀 생성 (동시 연결 관리)
const pool = mysql.createPool({
    ...connectionConfig,
    waitForConnections: true,            // 연결 대기 허용
    connectionLimit: 10,                 // 최대 동시 연결 수
    queueLimit: 0                        // 대기열 제한 없음
});

// 데이터베이스 연결 테스트
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL 데이터베이스에 성공적으로 연결되었습니다.');
        console.log(`📊 연결된 데이터베이스: ${connectionConfig.database}`);
        console.log(`🌐 호스트: ${connectionConfig.host}`);
        connection.release(); // 연결 반환
    })
    .catch(err => {
        console.error('❌ MySQL 데이터베이스 연결 실패:', err.message);
        console.error('🔧 환경 변수 및 MySQL 서버 상태를 확인하세요.');
        process.exit(1); // 연결 실패 시 서버 종료
    });

// 연결 풀 내보내기 (server.js에서 사용)
module.exports = pool;
