import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [password, setPassword] = useState(localStorage.getItem('password') || '');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', response.data.token);
            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }
            navigate('/'); // Redirect to home or any other route
        } catch (error) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex">
                <div className="w-full md:w-1/2 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900">Welcome Back!</h2>
                        <p className="text-gray-600">Please enter login details below</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the email"
                                required
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter the Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2"
                                />
                                Remember Me
                            </label>
                            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">Sign in</button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Or continue</p>
                        <button className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-300 mt-2">Log in with Google</button>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a></p>
                    </div>
                </div>
                <div className="hidden md:block md:w-1/2 bg-blue-100 rounded-r-lg p-8">
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src="/path-to-your-image.png" alt="Illustration" className="mb-4" />
                        <p className="text-gray-600">Manage your task in a easy and more efficient way with Tasky...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
