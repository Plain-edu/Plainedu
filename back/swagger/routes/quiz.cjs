// swagger/routes/quiz.cjs

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: 퀴즈 관련 API
 */

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: 퀴즈 목록 조회
 *     tags: [Quiz]
 *     description: 특정 테마의 퀴즈 문제들을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *           default: "A"
 *         description: 퀴즈 테마 (A, B, C 등)
 *         example: "A"
 *     responses:
 *       200:
 *         description: 퀴즈 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   description: 테마
 *                   example: "A"
 *                 count:
 *                   type: integer
 *                   description: 문제 개수
 *                   example: 10
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/quizzes/{theme}:
 *   get:
 *     summary: 특정 테마 퀴즈 조회
 *     tags: [Quiz]
 *     description: 특정 테마의 퀴즈 문제들을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: theme
 *         required: true
 *         schema:
 *           type: string
 *         description: 퀴즈 테마
 *         example: "A"
 *     responses:
 *       200:
 *         description: 퀴즈 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   example: "A"
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/quiz-result-single:
 *   post:
 *     summary: 개별 문제 결과 저장
 *     tags: [Quiz]
 *     description: 사용자가 푼 개별 문제의 결과를 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - questionId
 *               - solved
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *               questionId:
 *                 type: integer
 *                 description: 문제 ID
 *                 example: 101
 *               solved:
 *                 type: boolean
 *                 description: 정답 여부
 *                 example: true
 *               attemptCount:
 *                 type: integer
 *                 description: 시도 횟수
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: 결과 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "퀴즈 결과가 저장되었습니다."
 *       400:
 *         description: 필수 필드 누락
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
 * /api/quiz-result:
 *   post:
 *     summary: 테마별 전체 퀴즈 결과 저장
 *     tags: [Quiz]
 *     description: 사용자가 완료한 테마별 전체 퀴즈 결과를 저장합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizResult'
 *     responses:
 *       200:
 *         description: 퀴즈 결과 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "퀴즈 결과가 저장되었습니다."
 *                 theme:
 *                   type: string
 *                   example: "A"
 *                 score:
 *                   type: integer
 *                   example: 8
 *                 totalQuestions:
 *                   type: integer
 *                   example: 10
 *                 accuracy:
 *                   type: integer
 *                   description: 정답률 (%)
 *                   example: 80
 *       400:
 *         description: 필수 필드 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 필드가 누락되었습니다."
 *                 required:
 *                   type: string
 *                   example: "userId, theme, score, totalQuestions"
 *                 received:
 *                   type: object
 *       404:
 *         description: 해당 테마의 문제를 찾을 수 없음
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
 * /api/quiz-stats/{userId}:
 *   get:
 *     summary: 사용자 퀴즈 통계 조회
 *     tags: [Quiz]
 *     description: 특정 사용자의 퀴즈 통계를 조회합니다.
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
 *         description: 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizStats'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
