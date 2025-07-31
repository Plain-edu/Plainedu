const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Railway MySQL 연결 테스트 시작...');
    console.log('📋 연결 정보:');
    console.log(`   호스트: ${process.env.MYSQL_HOST}`);
    console.log(`   포트: ${process.env.MYSQL_PORT}`);
    console.log(`   사용자: ${process.env.MYSQL_USER}`);
    console.log(`   데이터베이스: ${process.env.MYSQL_DATABASE}`);
    console.log(`   비밀번호 길이: ${process.env.MYSQL_PASSWORD?.length || 0}자`);
    
    try {
        // 1. DATABASE_URL로 연결 시도
        if (process.env.DATABASE_URL) {
            console.log('\n🔗 DATABASE_URL로 연결 시도...');
            const connection = mysql.createConnection(process.env.DATABASE_URL);
            await connection.execute('SELECT 1');
            console.log('✅ DATABASE_URL 연결 성공!');
            await connection.end();
            return;
        }
        
        // 2. 개별 환경변수로 연결 시도
        console.log('\n🔗 개별 환경변수로 연결 시도...');
        const connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            connectTimeout: 10000,
            timeout: 10000
        });
        
        await connection.execute('SELECT 1');
        console.log('✅ 개별 환경변수 연결 성공!');
        await connection.end();
        
    } catch (error) {
        console.error('❌ 연결 실패:', error.message);
        console.error('🔧 에러 코드:', error.code);
        
        // 일반적인 에러 원인 안내
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Railway MySQL 서비스가 중지되었거나 네트워크 문제');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('💡 사용자명 또는 비밀번호가 틀림');
        } else if (error.code === 'ENOTFOUND') {
            console.error('💡 호스트 주소가 틀림');
        }
    }
}

testConnection();
