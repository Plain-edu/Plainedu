// swagger/routes/auth.cjs

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: 사용자 인증 관련 API
 */

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
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
