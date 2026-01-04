import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import { validateOpenAIConfig } from './config/openai.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logInfo } from './utils/logger.js';

// Import routes
import userRoutes from './routes/user.js';
import availabilityRoutes from './routes/availability.js';
import interviewRoutes from './routes/interview.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logInfo(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Interview Scheduler API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/interview', interviewRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Validate OpenAI configuration
    validateOpenAIConfig();

    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('  Interview Scheduler API');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`  ✓ Server running on port ${PORT}`);
      console.log(`  ✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  ✓ API URL: http://localhost:${PORT}`);
      console.log(`  ✓ Health check: http://localhost:${PORT}/health`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
