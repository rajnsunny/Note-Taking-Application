// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./app/middleware/errorHandler');
const limiter = require('./app/middleware/rateLimiter');
const throttler = require('./app/middleware/throttlingMiddleware');




// Load environment variables
dotenv.config();

// Connect to MongoDB database

const dbConfig = require('./app/config/db');
const db = mongoose.connect(dbConfig.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => {
    console.log('Connected to MongoDB');
  //  await db.collection('notes').createIndex({ title: "text", content: "text" });

})
.catch(err => console.error('MongoDB connection error:', err));





// Create Express app instance
const app = express();

// Middleware configuration
app.use(express.json()); // Parse incoming JSON data

app.use(errorHandler);

// Import routes
const authRoutes = require('./app/routes/authRoutes');
const notesRoutes = require('./app/routes/notesRoutes');
const searchRoutes = require('./app/routes/searchRoutes');


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/search',searchRoutes);




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Global rate limiter

app.use(limiter);
app.use(throttler);


  
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
