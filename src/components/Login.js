import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import '../css/Login.css';

// import partials
import Header from './partials/Header';
import Footer from './partials/Footer';
import tukibLogo from '../assets/tukib_logo.png';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [role, setRole] = useState('');
	const [loading, setLoading] = useState(false); // Added loading state
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true); // Start loading
		setRole(''); // Reset role state before logging in

		// Reset localStorage to avoid conflicts
		localStorage.removeItem('user');
		localStorage.removeItem('googleToken');

		try {
			const response = await fetch('http://localhost:5000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			setLoading(false); // Stop loading
			if (data.success) {
				localStorage.setItem('user', JSON.stringify(data.user));
				setSuccess('Login successful!');
				setRole(data.user.role);
			} else {
				setError(data.message);
				setSuccess('');
			}
		} catch (error) {
			console.error('Error logging in', error);
			setLoading(false); // Stop loading
			setError('Error logging in. Please try again.');
		}
	};

	// Handle Google Login Success
	const handleGoogleLoginSuccess = async (credentialResponse) => {
		setLoading(true); // Start loading
		setRole(''); // Reset role state before logging in

		// Reset localStorage to avoid conflicts
		localStorage.removeItem('user');
		localStorage.removeItem('googleToken');

		const token = credentialResponse.credential;

		// Decode token to get user email
		const decodedToken = jwtDecode(token);
		const userEmail = decodedToken.email;

		try {
			// Send the Google email to the backend for validation
			const response = await fetch('http://localhost:5000/api/google-login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: userEmail }), // Send the email for role check
			});

			const data = await response.json();
			setLoading(false); // Stop loading
			if (data.success) {
				localStorage.setItem('googleToken', token); // Store the token
				setRole(data.user.role); // Set the role from backend response
			} else {
				setError('Unauthorized user.');
			}
		} catch (error) {
			console.error('Error logging in via Google:', error);
			setLoading(false); // Stop loading
			setError('Error logging in via Google.');
		}
	};

	// Handle role-based redirection
	useEffect(() => {
		if (role === 'admin') {
			navigate('/adminDashboard');
		} else if (role === 'client') {
			navigate('/clientProfile');
		}
	}, [role, navigate]);

	return (
		<div className='login'>
			<Header />
			<main className='login-content'>
				<div className='mobile-powered-by d-md-none'>
					<h1>Powered By</h1>
					<div className='tukib-logo'>
						<img
							src={tukibLogo}
							alt='TUKIB Logo'
						/>
					</div>
				</div>

				<div className='login-container'>
					<div className='login-form'>
						<h2>Login</h2>
						<form onSubmit={handleLogin}>
							<div className='form-group'>
								<label htmlFor='Email'>Email</label>
								<input
									type='text'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='password'>Password</label>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<button
								type='submit'
								className='login-button'
								disabled={loading}>
								{loading ? 'Logging in...' : 'Login'}
							</button>
						</form>
						{error && <p style={{ color: 'red' }}>{error}</p>}
						{success && <p style={{ color: 'green' }}>{success}</p>}

						{/* Google Login Button */}
						<GoogleOAuthProvider clientId='99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com'>
							<div className='google-login'>
								<GoogleLogin
									onSuccess={handleGoogleLoginSuccess}
									onError={() => setError('Google login failed')}
									autoSelect={false}
								/>
							</div>
						</GoogleOAuthProvider>
					</div>
				</div>

				<div className='login-reminders d-none d-md-inline'>
					<h1>Powered By</h1>
					<div className='tukib-logo'>
						<img
							src={tukibLogo}
							alt='TUKIB Logo'
						/>
					</div>
					<h1>Important</h1>
					<ul className='login-reminders-list'>
						<li>DO NOT DISCLOSE YOUR LOG-IN PASSWORD TO ANYONE.</li>
						<li>
							DO NOT PUT HYPHEN (-) BETWEEN YOUR STUDENT I.D. TYPE IT IN FULL
							E.g. 201512345
						</li>
					</ul>
				</div>

				<div className='mobile-reminders d-md-none'>
					<h1>Important</h1>
					<ul className='login-reminders-list'>
						<li>DO NOT DISCLOSE YOUR LOG-IN PASSWORD TO ANYONE.</li>
						<li>
							DO NOT PUT HYPHEN (-) BETWEEN YOUR STUDENT I.D. TYPE IT IN FULL
							E.g. 201512345
						</li>
					</ul>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Login;
