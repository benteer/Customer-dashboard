const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


mongoose.connect('mongodb://127.0.0.1:27017/Database2');
const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Add email for user identification
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
app.post("/sign_up", async (req, res) => {
    console.log(req.body); // Log the request body to see what's being sent
    const { name, email, password } = req.body;

    // Check if any fields are missing
    if (!name || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    const existingUser2= await User.findOne({password})

    if (existingUser || existingUser2) {
        return res.status(400).send("Email already in use.");
    }


    const newUser = new User({ name, email, password });

    try {
        await newUser.save();
        console.log("Record Inserted Successfully");
        return res.redirect("index2.html");
        

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send("index2.html");

        }
        console.error("Error inserting record:", err);
        return res.status(500).send("Error signing up");
    }
});



// Home Route
app.get("/", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": '*' });
    return res.redirect('index.html');



});


// Start Server
const port = 9000;
app.listen(9000, () => {
    console.log("Listening on port 3000");
});