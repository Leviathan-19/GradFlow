export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Users Create Microservice',
    version: '1.0.0',
    description: 'Microservice for creating users'
  },
  paths: {
    '/api/users': {
      post: {
        summary: 'Create user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'name',
                  'lastname',
                  'email',
                  'password',
                  'degree',
                  'rol_id'
                ],
                properties: {
                  name: { type: 'string' },
                  lastname: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  degree: { type: 'string' },
                  telephone_number: { type: 'string' },
                  rol_id: { type: 'string', format: 'uuid' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' },
          500: { description: 'Internal server error' }
        }
      }
    }
  }
};
