const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const app = express();

/* ---------- Security middleware ---------- */
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

/* ---------- CORS ---------- */
app.use(cors({
  origin: "*",
  credentials: true
}));

/* ---------- Body parsing ---------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ---------- MongoDB ---------- */
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://exdb:exdb1@cluster0.matwsyf.mongodb.net/?appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

/* ---------- Routes ---------- */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/contact', contactRoutes);

/* ---------- Health check ---------- */
app.get('/', (req, res) => {
  res.json({ message: 'Kasmetics API is running!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

/* ---------- Error handling ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ---------- PORT (ONLY CHANGE) ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});