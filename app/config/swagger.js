const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js CRUD API with JWT Authentication',
      version: '1.0.0',
      description: 'A complete CRUD API with JWT authentication, MongoDB, and Jest testing',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated user ID'
            },
            username: {
              type: 'string',
              description: 'User username',
              minLength: 3,
              maxLength: 30
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated task ID'
            },
            title: {
              type: 'string',
              description: 'Task title',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Task description',
              maxLength: 500
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed'],
              default: 'pending'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              default: 'medium'
            },
            dueDate: {
              type: 'string',
              format: 'date-time'
            },
            user: {
              type: 'string',
              description: 'User ID who owns the task'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Fix the path to match your project structure
  apis: [
    path.join(__dirname, '../routes/*.js'), // If routes are in app/routes
    path.join(__dirname, '../app/routes/*.js') // Try this if above doesn't work
  ],
};

const specs = swaggerJsdoc(options);

// Debug: Check if paths are found
console.log('Swagger specs generated. Paths found:', Object.keys(specs.paths || {}).length);

module.exports = {
  swaggerUi,
  specs
};