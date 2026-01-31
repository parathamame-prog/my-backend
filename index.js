const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ---> 1. අලුත් පැකේජ් එක ගත්තා
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Database Connection
const mongoDBURL = "mongodb+srv://admin:Milano%402020@cluster0.mjo8qeg.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoDBURL)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.json({ message: "Backend is Running Smoothly!" });
});

// REGISTER ROUTE (Hash Password)
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and Password required" });
        }

        // ---> 2. පාස්වර්ඩ් එක Hash කිරීම (ආරක්ෂිත කිරීම)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ---> 3. Database එකට යවන්නේ Hash කළ පාස්වර්ඩ් එකයි
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        res.json({ success: true, message: "User Registered Successfully!" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// LOGIN ROUTE (Compare Password)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // ---> 4. ඇතුළත් කළ පාස්වර්ඩ් එක සහ Database එකේ ඇති Hash එක සැසඳීම
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ success: true, message: "Login Successful!", userId: user._id });
        } else {
            res.json({ success: false, message: "Invalid Password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});