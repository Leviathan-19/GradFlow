import express from 'express';
import rolesRoutes from './auth.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';

const app = express();

app.use(express.json());

// Routes
app.use('/api', rolesRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;
