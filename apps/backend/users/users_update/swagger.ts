export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Users Update Microservice',
    version: '1.0.0',
    description: 'Search and update user by ID'
  },
  paths: {
    '/api/users/{id}': {
      get: {
        summary: 'Get user by ID (for update)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        responses: {
          200: {
            description: 'User found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    lastname: { type: 'string' },
                    email: { type: 'string' },
                    degree: { type: 'string' },
                    telephone_number: { type: 'string' },
                    status: { type: 'boolean' },
                    rol_id: { type: 'string', format: 'uuid' }
                  }
                }
              }
            }
          },
          404: { description: 'User not found' },
          500: { description: 'Server error' }
        }
      },
      put: {
        summary: 'Update user by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  email: { type: 'string' },
                  degree: { type: 'string' },
                  telephone_number: { type: 'string' },
                  status: { type: 'boolean' },
                  rol_id: { type: 'string', format: 'uuid' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        lastname: { type: 'string' },
                        email: { type: 'string' },
                        degree: { type: 'string' },
                        telephone_number: { type: 'string' },
                        status: { type: 'boolean' },
                        rol_id: { type: 'string', format: 'uuid' },
                        updated_at: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          },
          404: { description: 'User not found' },
          500: { description: 'Server error' }
        }
      }
    }
  }
};
