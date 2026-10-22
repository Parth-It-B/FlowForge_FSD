import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security-focused HTTP response headers
app.use(helmet());

// CORS configuration with allowed origin and cookie credentials
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
  })
);

// Rate limiting to mitigate brute-force attacks and abuse
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit sensitive auth endpoints to 30 requests per 15 mins
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsers and cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FlowForge REST API',
  });
});

// Mount application routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
