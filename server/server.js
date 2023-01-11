const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
let   cors = require('cors');

// Load config
dotenv.config();
connectDB();

const app = express();

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors
app.use(cors({ origin: true, credentials: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Sessions
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // for saving session info in the database
// }));

// Routes
app.use('/items', require('./routes/items'));
app.use('/auth', require('./routes/auth'));
app.use('/employee', require('./routes/employee'));
app.use('/business', require('./routes/business'));
app.use('/till', require('./routes/till'));
app.use('/tab', require('./routes/tab'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);