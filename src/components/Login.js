import React, { useState } from 'react';
import axiosInstance from '../axiosConfig'; // Import the configured axios instance
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axiosInstance.post('/api/login/', {
    //             username,
    //             password
    //         });
    //         setError('');
    //         // Redirect to the main page or handle successful login
    //         navigate('/');
    //     } catch (error) {
    //         setError('Login failed');
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://46.249.98.145:8000/api/login/', {
                username,
                password
            });
            // Store the token in local storage or state
            localStorage.setItem('token', response.data.token);
            console.log('Login successful');
            console.log(response);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
