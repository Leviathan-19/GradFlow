export const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Users Delete Microservice",
    version: "1.0.0",
    description: "Delete users by ID",
  },
  servers: [
    {
      url: "/users_create/api",
    },
  ],
  paths: {
    "/users/{id}": {
      delete: {
        summary: "Delete a user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          200: { description: "User deleted" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
    },
  },
};
