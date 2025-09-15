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
      title: 'Plainedu Quiz Platform API',
      version: '1.0.0',
      description: `
        ## Plain Education 퀴즈 플랫폼 API 문서
        
        ### 📋 개요
        Plain Education 퀴즈 플랫폼의 RESTful API 서비스입니다.
        사용자 관리, 퀴즈 기능, 통계 및 뱃지 시스템을 제공합니다.
        
        ### 🔧 기술 스택
        - **Backend**: Node.js + Express.js
        - **Database**: MySQL 8.0
        - **Authentication**: JWT Token
        - **Documentation**: Swagger/OpenAPI 3.0
        
        ### 🌐 환경
        - **개발 서버**: ${codespaceUrl}
        - **로컬 서버**: http://localhost:4000
        
        ### 📖 사용법
        1. 회원가입 또는 로그인으로 인증
        2. API 엔드포인트별 기능 테스트
        3. 응답 데이터 구조 확인
      `,
      termsOfService: 'https://plainedu.com/terms',
      contact: {
        name: 'Plain Education Development Team',
        email: 'dev@plainedu.com',
        url: 'https://plainedu.com/support'
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT'
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
    .swagger-ui { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .swagger-ui .topbar { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 10px 0;
    }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info { 
      margin: 30px 0;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .swagger-ui .info .title { 
      color: #1e40af;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .swagger-ui .info .description {
      color: #4b5563;
      line-height: 1.6;
    }
    .swagger-ui .info .description h3 {
      color: #1f2937;
      margin-top: 20px;
    }
    .swagger-ui .scheme-container {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .swagger-ui .opblock { 
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .swagger-ui .opblock .opblock-summary { 
      padding: 15px 20px;
    }
    .swagger-ui .btn.try-out { 
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
    }
    .swagger-ui .btn.execute { 
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
    }
  `,
  customSiteTitle: 'Plainedu API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    docExpansion: 'list',
    operationsSorter: 'alpha',
    tagsSorter: 'alpha',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
};

module.exports = {
  swaggerSpecs,
  swaggerUi,
  swaggerUiOptions
};
