const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware: Frontend එකෙන් එවන JSON දත්ත කියවීමට මෙය අනිවාර්යයි
app.use(express.json());

// මූලික Route එක (Home)
app.get('/', (req, res) => {
    res.json({ message: "Welcome to my updated Backend API!" });
});

// 2. GET Route - දත්ත යැවීම (Query Parameters)
// උදාහරණ: /greet?name=Chathura
app.get('/greet', (req, res) => {
    const userName = req.query.name; // URL එකෙන් නම ලබා ගැනීම
    if (userName) {
        res.json({ message: `Hello, ${userName}! Welcome back.` });
    } else {
        res.json({ message: "Hello! I don't know your name yet." });
    }
});

// 3. POST Route - දත්ත ලබා ගැනීම (Receiving Data)
// උදාහරණ: User කෙනෙක් Login වෙනකොට
app.post('/login', (req, res) => {
    const { username, password } = req.body; // Body එකෙන් දත්ත ගැනීම

    // සරල පරීක්ෂාවක් (මෙය නිකන් උදාහරණයක් පමණි)
    if (username === "admin" && password === "12345") {
        res.json({ success: true, message: "Login Successful!" });
    } else {
        res.json({ success: false, message: "Invalid username or password" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});