const express = require('express');
const OpenApiValidator = require('express-openapi-validator')
const app = express();
const port = 4250;

app.use(express.json());

// Route handler
app.get('/', (req, res) => {
  res.send('Hello, Worgdrgdrgrdgld!');
});

app.use((error, req, res, next) => {
  res.status(error.status || 500)
    .json({ success: false, message: error.message, status: error.status });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});