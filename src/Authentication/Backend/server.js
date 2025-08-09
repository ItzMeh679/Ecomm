require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express App
const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173', // Vite default port
        process.env.CLIENT_URL,
        'https://accounts.google.com' // For Google OAuth
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // For parsing application/json with size limit
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Request logging middleware (optional, for debugging)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Database Connection with better error handling
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); // Exit if database connection fails
    });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

// API Routes
const UserRouter = require('./api/User.js');
app.use("/user", UserRouter);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
});

// Root Route
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to Just Small Gifts API!",
        version: "1.0.0",
        endpoints: {
            auth: "/user",
            health: "/health"
        }
    });
});

// Serve Static Files (for production deployment)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    
    // Handle specific errors
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            status: "FAILED",
            message: "Invalid JSON format"
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: "FAILED",
            message: err.message
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        status: "FAILED",
        message: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        status: "FAILED",
        message: "API endpoint not found"
    });
});

// Serve React app (catch-all handler for client-side routing)
app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`\n📋 Available endpoints:`);
        console.log(`   Health Check: http://localhost:${port}/health`);
        console.log(`   API Info: http://localhost:${port}/api`);
        console.log(`   User Auth: http://localhost:${port}/user`);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});