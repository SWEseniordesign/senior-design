const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const Item = require('./models/Item');
var cors = require('cors');

// Load config
dotenv.config();
connectDB();

const app = express();

// Cors
app.use(cors({ origin: true, credentials: true }));

// Middleware
app.use(express.json());


// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/items', require('./routes/items'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));