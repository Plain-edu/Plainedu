// swagger/routes/health.cjs

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: 서버 상태 확인 API
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: 서버 상태 확인
 *     tags: [Health]
 *     description: 서버가 정상적으로 작동하는지 확인합니다.
 *     responses:
 *       200:
 *         description: 서버 정상 작동
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 */

/**
 * @swagger
 * /api/db-test:
 *   get:
 *     summary: 데이터베이스 연결 테스트
 *     tags: [Health]
 *     description: 데이터베이스 연결 상태를 확인합니다.
 *     responses:
 *       200:
 *         description: 데이터베이스 연결 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Database connection successful"
 *       500:
 *         description: 데이터베이스 연결 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
