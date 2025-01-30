const express = require('express');
const cors = require('cors');

// Import controllers
const loginController = require('./controllers/loginController');
const googleLoginController = require('./controllers/googleLoginController');
const eventsController = require('./controllers/eventsController');

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Route for handling login
app.post('/api/login', loginController.handleLogin);

// Route for handling Google login
app.post('/api/google-login', googleLoginController.handleGoogleLogin);

// Endpoint to fetch events from the database
app.get('/api/events', eventsController.getEvents);

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
