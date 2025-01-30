const { OAuth2Client } = require('google-auth-library');
const pool = require('../backend'); // Import PostgreSQL pool

const client = new OAuth2Client(
	'99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com'
);

const handleGoogleLogin = async (req, res) => {
	const { token } = req.body;

	try {
		// Verify the Google token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience:
				'99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com', // Google Client ID
		});
		const payload = ticket.getPayload();
		const email = payload.email;

		// Check if the user exists in the database
		const result = await pool.query('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			const role = user.role; // Assuming your users table has a "role" field

			// Send back user info and role
			res.status(200).json({
				success: true,
				user: {
					email: user.email,
					role: role,
				},
				roleSpecificMessage:
					role === 'admin' ? 'Welcome, Admin!' : 'Welcome, Client!',
			});
		} else {
			// User not found in the database
			res
				.status(401)
				.json({ success: false, message: 'User not found in our database.' });
		}
	} catch (error) {
		console.error('Error during Google login:', error);
		res.status(500).json({ success: false, message: 'Google login failed.' });
	}
};

module.exports = { handleGoogleLogin };
