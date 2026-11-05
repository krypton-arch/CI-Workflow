const request = require('supertest');
const app = require('../src/app');

describe('App General Endpoints', () => {
  describe('GET /', () => {
    it('should return welcome message with status 200', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        message: 'Welcome to the CI/CD Express API',
        status: 'success'
      });
    });
  });

  describe('404 Not Found Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/undefined-endpoint');
      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should return 404 for undefined POST route', async () => {
      const response = await request(app).post('/random-post-route').send({});
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle malformed JSON payload with 400 status', async () => {
      const response = await request(app)
        .post('/api/items')
        .set('Content-Type', 'application/json')
        .send('{"name": "Broken JSON, }');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid JSON payload');
    });
  });
});
