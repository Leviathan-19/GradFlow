export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Login Microservice',
    version: '1.0.0',
    description: 'Microservice for user authentication'
  },
  paths: {
    '/api/auth/login': {
      post: {
        summary: 'User login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@email.com'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'secret123'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful'
          },
          401: {
            description: 'Invalid credentials'
          },
          403: {
            description: 'User inactive'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  }
};
