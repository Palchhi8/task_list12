const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Import Task model
const Task = require('./schemas/Task');

// Root Route (For API Testing)
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('❌ Could not connect to MongoDB:', err);
        process.exit(1); // Exit process on DB connection failure
    });

// Fetch All Tasks (GET /tasks)
app.get('/tasks', async (req, res) => {
    console.log('📥 Fetching tasks...');
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(tasks);
    } catch (err) {
        console.error('❌ Error fetching tasks:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create New Task (POST /tasks)
app.post('/tasks', async (req, res) => {
    console.log('📤 Creating a new task...');
    try {
        const { title, description } = req.body;

        // Validate Input
        if (!title || !description) {
            return res.status(400).json({ message: '❌ Title and description are required' });
        }

        // Create a new Task instance
        const newTask = new Task({ title, description, createdAt: new Date() });

        // Save Task to MongoDB
        await newTask.save();

        console.log('✅ Task created successfully:', newTask);
        res.status(201).json(newTask);
    } catch (err) {
        console.error('❌ Error creating task:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});
