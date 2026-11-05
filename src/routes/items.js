const express = require('express');
const router = express.Router();
const itemsStore = require('../data/itemsStore');

// GET /api/items - Retrieve all items
router.get('/', (req, res) => {
  const items = itemsStore.getAll();
  res.status(200).json(items);
});

// GET /api/items/:id - Retrieve item by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  const item = itemsStore.getById(id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.status(200).json(item);
});

// POST /api/items - Create a new item
router.post('/', (req, res) => {
  const { name, description, price, inStock } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Item name is required and must be a non-empty string'
    });
  }

  if (price === undefined || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Valid positive item price is required'
    });
  }

  const createdItem = itemsStore.create({
    name: name.trim(),
    description,
    price,
    inStock
  });

  res.status(201).json({
    message: 'Item created successfully',
    item: createdItem
  });
});

// PUT /api/items/:id - Update an item
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  const existingItem = itemsStore.getById(id);
  if (!existingItem) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const { name, description, price, inStock } = req.body;
  const updates = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    updates.name = name.trim();
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    updates.price = price;
  }

  if (inStock !== undefined) {
    updates.inStock = Boolean(inStock);
  }

  const updatedItem = itemsStore.update(id, updates);
  res.status(200).json({
    message: 'Item updated successfully',
    item: updatedItem
  });
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  const deletedItem = itemsStore.delete(id);
  if (!deletedItem) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.status(200).json({
    message: 'Item deleted successfully',
    deletedItem
  });
});

module.exports = router;
