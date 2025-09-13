// swagger/routes/user.cjs

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 관리 API
 */

/**
 * @swagger
 * /api/profile/{userId}:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [User]
 *     description: 특정 사용자의 프로필 정보를 조회합니다.
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
 *         description: 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
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
 * /api/profile:
 *   post:
 *     summary: 사용자 프로필 수정
 *     tags: [User]
 *     description: 사용자의 프로필 정보를 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - nickname
 *               - gender
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *               nickname:
 *                 type: string
 *                 description: 새 닉네임
 *                 example: "새닉네임"
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 description: 성별
 *                 example: "M"
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "프로필이 저장되었습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/rankings:
 *   get:
 *     summary: 사용자 랭킹 조회
 *     tags: [User]
 *     description: 상위 10명의 사용자 랭킹을 조회합니다.
 *     responses:
 *       200:
 *         description: 랭킹 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nickname:
 *                     type: string
 *                     description: 닉네임
 *                     example: "길동이"
 *                   tier:
 *                     type: integer
 *                     description: 티어
 *                     example: 5
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/ranking:
 *   post:
 *     summary: 사용자 랭킹 업데이트
 *     tags: [User]
 *     description: 사용자의 점수에 따라 티어를 업데이트합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - score
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *               score:
 *                 type: integer
 *                 description: 점수
 *                 example: 50000
 *     responses:
 *       200:
 *         description: 랭킹 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "랭킹이 저장되었습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
