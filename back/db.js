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

if (process.env.MYSQL_URL) {
    // Railway MYSQL_URL이 있는 경우 우선 사용
    const urlConfig = parseDatabaseUrl(process.env.MYSQL_URL);
    connectionConfig = urlConfig || {
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT || 3306,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE
    };
} else if (process.env.DATABASE_URL) {
    // Railway DATABASE_URL이 있는 경우
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
    ssl: false,                          // 로컬에서는 SSL 비활성화
    authPlugins: {
        mysql_native_password: () => () => Buffer.alloc(0)
    },
    waitForConnections: true,            // 연결 대기 허용
    connectionLimit: 10,                 // 최대 동시 연결 수
    queueLimit: 0                        // 대기열 제한 없음
});

// 데이터베이스 연결 테스트 및 DB 생성
async function initializeDatabase() {
    try {
        // 먼저 mysql 시스템 DB에 연결해서 plainDB가 있는지 확인
        const systemConfig = { ...connectionConfig };
        delete systemConfig.database; // database 제거해서 시스템 DB 연결
        
        const systemPool = mysql.createPool(systemConfig);
        const connection = await systemPool.getConnection();
        
        // plainDB 데이터베이스 생성 (존재하지 않는 경우)
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${connectionConfig.database}\``);
        console.log(`📊 데이터베이스 '${connectionConfig.database}' 확인/생성 완료`);
        
        connection.release();
        await systemPool.end();
        
        // 이제 실제 데이터베이스에 연결 테스트
        const testConnection = await pool.getConnection();
        console.log('✅ MySQL 데이터베이스에 성공적으로 연결되었습니다.');
        console.log(`📊 연결된 데이터베이스: ${connectionConfig.database}`);
        console.log(`🌐 호스트: ${connectionConfig.host}`);
        testConnection.release();
        
    } catch (err) {
        console.error('❌ MySQL 데이터베이스 연결 실패:', err.message);
        console.error('🔧 MySQL 서버가 실행 중인지, 비밀번호가 정확한지 확인하세요.');
        console.error('💡 MySQL root 비밀번호를 확인하고 .env 파일을 수정해주세요.');
        process.exit(1);
    }
}

// 데이터베이스 초기화 실행
initializeDatabase();

// 연결 풀 내보내기 (server.js에서 사용)
module.exports = pool;
