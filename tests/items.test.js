const request = require('supertest');
const app = require('../src/app');
const itemsStore = require('../src/data/itemsStore');

describe('Items API (/api/items)', () => {
  // Reset store before each test to guarantee test isolation
  beforeEach(() => {
    itemsStore.reset();
  });

  describe('GET /api/items', () => {
    it('should return initial items list', async () => {
      const res = await request(app).get('/api/items');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return an item by ID if it exists', async () => {
      const res = await request(app).get('/api/items/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('price');
    });

    it('should return 404 if item does not exist', async () => {
      const res = await request(app).get('/api/items/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 if ID is invalid', async () => {
      const res = await request(app).get('/api/items/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid item ID');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const newItem = {
        name: 'Mechanical Keyboard',
        description: 'RGB Backlit mechanical keyboard with brown switches',
        price: 89.99,
        inStock: true
      };

      const res = await request(app).post('/api/items').send(newItem);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Item created successfully');
      expect(res.body.item).toHaveProperty('id');
      expect(res.body.item.name).toBe(newItem.name);
      expect(res.body.item.price).toBe(newItem.price);

      // Verify item can be retrieved
      const getRes = await request(app).get(`/api/items/${res.body.item.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.name).toBe(newItem.name);
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app).post('/api/items').send({ price: 29.99 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'Item name is required and must be a non-empty string'
      );
    });

    it('should return 400 when name is an empty string or spaces', async () => {
      const res = await request(app).post('/api/items').send({ name: '   ', price: 29.99 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'Item name is required and must be a non-empty string'
      );
    });

    it('should return 400 when price is missing or invalid', async () => {
      const res = await request(app).post('/api/items').send({ name: 'Gaming Mouse', price: -10 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Valid positive item price is required');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      const updateData = {
        name: 'Updated Laptop',
        description: 'Updated specs',
        price: 1199.99,
        inStock: false
      };

      const res = await request(app).put('/api/items/1').send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Item updated successfully');
      expect(res.body.item.name).toBe(updateData.name);
      expect(res.body.item.description).toBe(updateData.description);
      expect(res.body.item.price).toBe(updateData.price);
      expect(res.body.item.inStock).toBe(false);
    });

    it('should return 404 when updating non-existent item', async () => {
      const res = await request(app)
        .put('/api/items/9999')
        .send({ name: 'Does Not Exist', price: 100 });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 when updating with invalid ID', async () => {
      const res = await request(app).put('/api/items/not-a-number').send({ name: 'New Name' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid item ID');
    });

    it('should return 400 when updating with empty name string', async () => {
      const res = await request(app).put('/api/items/1').send({ name: '   ' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Name must be a non-empty string');
    });

    it('should return 400 when update payload has invalid fields', async () => {
      const res = await request(app).put('/api/items/1').send({ price: -5 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Price must be a positive number');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const res = await request(app).delete('/api/items/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Item deleted successfully');
      expect(res.body.deletedItem.id).toBe(1);

      // Verify it's gone
      const getRes = await request(app).get('/api/items/1');
      expect(getRes.status).toBe(404);
    });

    it('should return 404 when deleting a non-existent item', async () => {
      const res = await request(app).delete('/api/items/9999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 when ID is invalid', async () => {
      const res = await request(app).delete('/api/items/not-a-number');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid item ID');
    });
  });
});
