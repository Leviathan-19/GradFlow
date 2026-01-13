export const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Auth Me Microservice",
    version: "1.0.0",
    description: "Microservice for user info",
  },
  paths: {
    "/api/auth/me": {
      get: {
        summary: "Get authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Authenticated user data",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Invalid token",
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
};
