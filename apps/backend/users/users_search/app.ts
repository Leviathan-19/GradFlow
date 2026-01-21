import express from 'express';
import usersRoutes from './users.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'users_search',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', usersRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;
