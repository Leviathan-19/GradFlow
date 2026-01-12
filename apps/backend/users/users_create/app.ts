import express from 'express';
import usersRoutes from './users.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';

const app = express();

app.use(express.json());

// Rutas
app.use('/api', usersRoutes);

// Swagger (PÚBLICO)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;

