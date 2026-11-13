const express = require('express');
const healthRoutes = require('./routes/health');
const itemsRoutes = require('./routes/items');

const app = express();

// Built-in body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the CI/CD Express API',
    status: 'success'
  });
});

// Feature routes
app.use('/api/health', healthRoutes);
app.use('/api/items', itemsRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized error handling middleware
app.use((err, req, res, _next) => {
  // Handle malformed JSON input
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  // Handle generic internal server errors
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
