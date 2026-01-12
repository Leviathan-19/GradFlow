export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Roles Microservice',
    version: '1.0.0',
    description: 'Microservice to list system roles'
  },
  paths: {
    '/api/roles': {
      get: {
        summary: 'Get all active roles',
        responses: {
          200: {
            description: 'List of roles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string', example: 'ADMIN' }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  }
};
