const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const quoteRoutes = require('./routes/quoteRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use('/api', quoteRoutes);
app.use('/auth', authRoutes);

module.exports = app;
