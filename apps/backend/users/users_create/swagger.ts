export const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'Users Create Microservice',
    version: '1.0.0',
    description: 'Microservice for creating users'
  },
  servers: [
    {
      url: '/users_create/api'
    }
    ],
  paths: {
    '/users': {
      post: {
        summary: 'Create user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'name1',
                  'name2',
                  'lastname1',
                  'lastname2',
                  'email',
                  'password',
                  'degree',
                  'rol_id'
                ],
                properties: {
                  name1: { type: 'string' },
                  name2: { type: 'string' },
                  lastname1: { type: 'string' },
                  lastname2: { type: 'string' },
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
