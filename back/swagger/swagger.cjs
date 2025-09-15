// swagger/swagger.cjs
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Codespaces 환경 감지
const isCodespaces = process.env.CODESPACE_NAME !== undefined;
const codespaceUrl = isCodespaces 
  ? `https://${process.env.CODESPACE_NAME}-4000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev'}`
  : 'http://localhost:4000';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plainedu Quiz API',
      version: '1.0.0',
      description: 'Plain Education 퀴즈 애플리케이션 API 문서',
      contact: {
        name: 'Plain Education Team',
        email: 'support@plainedu.com'
      }
    },
    servers: [
      ...(isCodespaces ? [
        {
          url: codespaceUrl,
          description: 'GitHub Codespaces (현재 환경)'
        }
      ] : []),
      {
        url: 'http://localhost:4000',
        description: '로컬 개발 서버'
      },
      {
        url: 'https://{codespace}-4000.app.github.dev',
        description: 'GitHub Codespaces (수동 설정)',
        variables: {
          codespace: {
            default: 'your-codespace-name',
            description: 'Codespace 이름'
          }
        }
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: '사용자 ID' },
            name: { type: 'string', description: '사용자 이름' },
            email: { type: 'string', format: 'email', description: '이메일 주소' },
            nickname: { type: 'string', description: '닉네임' },
            gender: { type: 'string', enum: ['M', 'F'], description: '성별' },
            tier: { type: 'integer', description: '티어' },
            subscription: { type: 'integer', description: '구독 상태' }
          }
        },
        QuizResult: {
          type: 'object',
          required: ['userId', 'theme', 'score', 'totalQuestions'],
          properties: {
            userId: { type: 'integer', description: '사용자 ID', example: 1 },
            theme: { type: 'string', description: '퀴즈 테마', example: 'A' },
            score: { type: 'integer', description: '점수', example: 8 },
            totalQuestions: { type: 'integer', description: '전체 문제 수', example: 10 }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: '문제 ID' },
            type: { 
              type: 'string', 
              enum: ['true_false', 'multiple_choice', 'matching'], 
              description: '문제 유형' 
            },
            theme: { type: 'string', description: '테마' },
            difficulty: { type: 'integer', description: '난이도' },
            question: { type: 'string', description: '문제 내용' },
            points: { type: 'integer', description: '배점' },
            answer: { type: 'string', description: '정답' },
            explanation: { type: 'string', description: '해설' }
          }
        },
        QuizStats: {
          type: 'object',
          properties: {
            overall: {
              type: 'object',
              properties: {
                total_questions: { type: 'integer', description: '전체 문제 수' },
                attempted_questions: { type: 'integer', description: '시도한 문제 수' },
                solved_questions: { type: 'integer', description: '정답 문제 수' },
                accuracy_rate: { type: 'number', description: '정답률' }
              }
            },
            byTheme: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  theme: { type: 'string', description: '테마' },
                  total_in_theme: { type: 'integer', description: '테마 내 전체 문제 수' },
                  attempted_in_theme: { type: 'integer', description: '테마 내 시도한 문제 수' },
                  solved_in_theme: { type: 'integer', description: '테마 내 정답 문제 수' }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: '오류 메시지' },
            error: { type: 'string', description: '상세 오류 정보' }
          }
        }
      }
    }
  },
  apis: ['./swagger/routes/*.cjs'], // API 문서가 있는 파일들
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .info .title { color: #3b82f6 }
  `,
  customSiteTitle: 'Plainedu API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
  }
};

module.exports = {
  swaggerSpecs,
  swaggerUi,
  swaggerUiOptions
};
