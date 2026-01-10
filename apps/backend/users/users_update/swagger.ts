export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Users Update Microservice',
    version: '1.0.0',
    description: 'Update user by ID'
  },
  paths: {
    '/api/users': {
      get: {
        summary: 'Update user by ID',
        responses: {
          200: {
            description: 'Updated user',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      lastname: { type: 'string' },
                      email: { type: 'string' },
                      degree: { type: 'string' },
                      telephone_number: { type: 'string' },
                      status: { type: 'boolean' },
                      created_at: { type: 'string', format: 'date-time' },
                      role: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          500: { description: 'Server error' }
        }
      }
    }
  }
};
