const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Database3', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    backupFrequency: { type: String, required: true },
    services: { type: String }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from "public" folder

// Route to serve index2.html
app.get('/some-route', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

// POST route to handle form submissions

app.post('/onboard', async (req, res) => {
    const { name, email, phone, company, role, backupFrequency, services } = req.body;
    try {
        const newUser = new User({ name, email, phone, company, role, backupFrequency, services });
        await newUser.save();
        res.status(201).json({ message: 'Onboarding successful!' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


