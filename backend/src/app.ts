import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { errorHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import referralRoutes from './routes/referral.routes';
import earningsRoutes from './routes/earnings.routes';
import payoutRoutes from './routes/payout.routes';
import assetRoutes from './routes/asset.routes';
import settingsRoutes from './routes/settings.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling
app.use(errorHandler);

export default app;
