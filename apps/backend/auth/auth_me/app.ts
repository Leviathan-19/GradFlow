import express from 'express';
import cors from 'cors';
import usersRoutes from './auth.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'auth_me',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', usersRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

export default app;
