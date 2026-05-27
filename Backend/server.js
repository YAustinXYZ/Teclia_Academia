import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { initDb } from './db/init.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure a JWT secret exists for development if not provided
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set — using development fallback');
  process.env.JWT_SECRET = 'teclia_dev_secret_change_this';
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Teclia Backend is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
initDb()
  .then(() => {
    console.log('✓ Database initialized');
    app.listen(PORT, () => {
      console.log(`✓ Teclia Backend running on http://localhost:${PORT}`);
        console.log(`\nTest credentials:`);
        console.log(`   Admin: admin@teclia.com / Admin123!`);
        console.log(`   Student: student1@teclia.com / Student123!\n`);
    });
  })
  .catch((err) => {
    console.error('✗ Failed to initialize database:', err);
    process.exit(1);
  });
