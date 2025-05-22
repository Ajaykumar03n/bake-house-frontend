import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login1 from '../../assets/Login.jpg';

export const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [usererror,setUsererror]=useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }
        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!name) {
            newErrors.name = 'Name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('https://bake-house-backend.onrender.com/api/auth/signup', {
                    name,
                    email,
                    password,
                    phone,
                    area,
                    address,
                    role:"user"
                });

                setMessage(response.data.message || 'Signup successful!');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds


                setName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setArea('');
                setAddress('');
                setErrors({});
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    setUsererror(error.response.data.error);
                } else {
                    setUsererror("Login failed. Please try again later.");
                }
                console.error("Error in Login", error);
            }
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="flex h-screen">
            {/* Left Side - Form */}
            <div
                className="w-[40%] flex items-center justify-center bg-cover bg-center"
            >
                <div className="bg-opacity-90 p-8 rounded-xl space-y-6 w-[85%]">
                    <h1 className="text-3xl font-bold text-center">Sign Up</h1>
                    <p className="text-lg font-light text-center">Create your account</p>

                    {usererror && <p className='text-lg font-bold text-red-500 text-center'>{usererror}</p>}

                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            required
                            className={`w-full border-2 ${errors.name ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none rounded-lg p-2`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className={`w-full border-2 ${errors.email ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none rounded-lg p-2`}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className={`w-full px-4 py-2 rounded-lg border-2 ${errors.password ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-none`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone Number"
                                required
                                className={`w-full px-4 py-2 rounded-lg border-2 ${errors.phone ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-none`}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={area}
                                placeholder="Area"
                                onChange={(e) => setArea(e.target.value)}
                                required
                                className={`w-full border-2 ${errors.name ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none rounded-lg p-2`}
                            />
                            {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={address}
                                placeholder="Address"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className={`w-full border-2 ${errors.name ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none rounded-lg p-2`}
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300"
                        >
                            Sign Up
                        </button>

                        <p className="text-center text-gray-500">OR</p>

                        <button
                            type="button"
                            onClick={goToLogin}
                            className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-600 transition duration-300"
                        >
                            Login
                        </button>

                        {message && (
                            <p className="text-center mt-4 text-sm text-blue-600 font-medium">
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* Right Side - Background Image */}
            <div
                className="w-[60%] bg-cover bg-center"
                style={{ backgroundImage: `url(${Login1})` }}
            />
        </div>
    );
};
