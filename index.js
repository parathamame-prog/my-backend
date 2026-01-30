const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

// 1. Middleware: මෙය නැතුව JSON කියවන්න බැහැ
app.use(express.json());

// 2. Database Connection
const mongoDBURL = "mongodb+srv://admin:Milano%402020@cluster0.mjo8qeg.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoDBURL)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 3. User Model (Schema)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// 4. Home Route
app.get('/', (req, res) => {
    res.json({ message: "Backend is Running Smoothly!" });
});

// 5. REGISTER Route (අලුත් කෙනෙක් හැදීම)
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("📝 Registering User:", username); // Console එකේ පෙන්වයි

        // Check if data is empty
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and Password required" });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        
        console.log("✅ User Saved to DB");
        res.json({ success: true, message: "User Registered Successfully!" });

    } catch (error) {
        console.log("❌ Register Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 6. LOGIN Route (ඇතුල් වීම)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("🔑 Login Attempt for:", username); // කවුද ලොග් වෙන්න හදන්නේ කියලා පෙන්වයි

        // Database එකේ නම සහ පාස්වර්ඩ් ගැලපෙන කෙනෙක් ඉන්නවද බැලීම
        const user = await User.findOne({ username: username, password: password });

        if (user) {
            console.log("✅ User Found!");
            res.json({ success: true, message: "Login Successful!", userId: user._id });
        } else {
            console.log("❌ User Not Found or Password Wrong");
            res.json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});