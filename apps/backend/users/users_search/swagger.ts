export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Users Search Microservice',
    version: '1.0.0',
    description: 'Get user by ID'
  },
  servers: [
    {
      url: '/users_search/api'
    }
    ],
  paths: {
    '/users/{id}': {
      get: {
        summary: 'Get user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: { description: 'User found' },
          404: { description: 'User not found' },
          500: { description: 'Server error' }
        }
      }
    }
  }
};
