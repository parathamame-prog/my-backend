const express = require('express');
const app = express();
const PORT = 3000;

// වෙබ් අඩවියට එන අයට පෙන්වන පණිවිඩය
app.get('/', (req, res) => {
    res.json({ message: "Hello! Backend is working successfully." });
});

// Server එක පණගැන්වීම
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});