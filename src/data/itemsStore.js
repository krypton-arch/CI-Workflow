// In-memory data store for Items
const initialItems = [
  {
    id: 1,
    name: 'Developer Laptop',
    description: 'High-performance workstation with 32GB RAM',
    price: 1499.99,
    inStock: true
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    description: 'Ergonomic Bluetooth wireless mouse',
    price: 49.99,
    inStock: true
  },
  {
    id: 3,
    name: '4K Monitor',
    description: '27-inch IPS UHD 4K display',
    price: 349.99,
    inStock: false
  }
];

let items = JSON.parse(JSON.stringify(initialItems));
let nextId = 4;

const itemsStore = {
  getAll: () => items,
  getById: (id) => items.find((item) => item.id === id),
  create: (itemData) => {
    const newItem = {
      id: nextId++,
      name: itemData.name,
      description: itemData.description || '',
      price: Number(itemData.price),
      inStock: itemData.inStock !== undefined ? Boolean(itemData.inStock) : true
    };
    items.push(newItem);
    return newItem;
  },
  update: (id, updateData) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updateData,
      id // preserve original id
    };
    return items[index];
  },
  delete: (id) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const [deletedItem] = items.splice(index, 1);
    return deletedItem;
  },
  reset: () => {
    items = JSON.parse(JSON.stringify(initialItems));
    nextId = 4;
  }
};

module.exports = itemsStore;
