require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./app/config/database');
const { swaggerUi, specs } = require('./app/config/swagger');


const authRoutes = require('./app/routes/authRoutes');
const taskRoutes = require('./app/routes/taskRoutes');

const errorHandler = require('./app/middleware/errorHandler');

const app = express();


connectDB();


app.use(helmet());
app.use(cors());


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


console.log('Swagger paths found:');
console.log(Object.keys(specs.paths || {}));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Node.js CRUD API Documentation"
}));

// Basic route for health check
app.get('/', (req, res) => {
  res.json({
    message: 'Node.js CRUD API with JWT Authentication',
    timestamp: new Date().toISOString(),
    status: 'active',
    documentation: '/api-docs'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;