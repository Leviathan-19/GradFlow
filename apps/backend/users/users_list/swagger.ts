export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Users List Microservice',
    version: '1.0.0',
    description: 'List all users'
  },
  paths: {
    '/api/users': {
      get: {
        summary: 'Get all users',
        responses: {
          200: {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name1: { type: 'string' },
                      name2: { type: 'string' },
                      lastname1: { type: 'string' },
                      lastname2: { type: 'string' },
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
