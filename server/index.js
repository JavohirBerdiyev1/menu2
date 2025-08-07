const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const { MONGODB_URI, JWT_SECRET, PORT = 4000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Category = mongoose.model('Category', categorySchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});
const Item = mongoose.model('Item', itemSchema);

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  
  const user = await User.findOne({ username });
  console.log(user);
  
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  // const match = await bcrypt.compare(password, user.password);
  // if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/logout', (req, res) => {
  // With JWT there is no server-side logout. Client should discard the token.
  res.json({ message: 'Logged out' });
});

// Category routes
app.get('/api/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

app.post('/api/categories', authenticate, async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.status(201).json(category);
});

app.get('/api/categories/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.sendStatus(404);
  res.json(category);
});

app.put('/api/categories/:id', authenticate, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.sendStatus(404);
  res.json(category);
});

app.delete('/api/categories/:id', authenticate, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.sendStatus(404);
  res.sendStatus(204);
});

// Item routes
app.get('/api/items', async (req, res) => {
  const items = await Item.find().populate('category');
  res.json(items);
});

app.post('/api/items', authenticate, async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.status(201).json(item);
});

app.get('/api/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id).populate('category');
  if (!item) return res.sendStatus(404);
  res.json(item);
});

app.put('/api/items/:id', authenticate, async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.sendStatus(404);
  res.json(item);
});

app.delete('/api/items/:id', authenticate, async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.sendStatus(404);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
