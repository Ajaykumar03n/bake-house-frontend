import React from 'react';
import Login1 from '../../assets/Login.jpg';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';

export const LoginPage = () => {

    const navigate = useNavigate();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');

    const signup=()=>{
        navigate("/signup");
    }

    async function submit (e){
        e.preventDefault();
        try{
            const response = await axios.post(
                "https://bake-house-backend.onrender.com/api/auth/login",
                { email, password },
                { withCredentials: true } // ✅ Send cookies (refreshToken)
            );
            if (response.data.accessToken) {
                localStorage.setItem('token',response.data.accessToken);
                localStorage.setItem('role',response.data.role);
                localStorage.setItem('userId',response.data.userId);
                localStorage.setItem('email',email);
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`; // ✅ Store token in Axios header
                if(response.data.role==="admin"){
                    navigate("/adminhome");
                }
                else if(response.data.role==="employee"){
                    navigate("/employeehome");
                }
                else{
                    navigate("/");
                }
            } else {
                setError('Invalid Credential!!Check for the email and password.');
            }
        }
        catch (error) {
            setError('Invalid Credential!! Check for the email and password.');
            console.error("Error in Login", error);
        }
        
    }
    return (
        <div className="flex h-screen">
            <div className="w-[40%] flex items-center justify-center">
                <div className='space-y-6 flex flex-col items-center justify-center'>
                    <h1 className="text-3xl font-bold text-center">LOGIN!!</h1>
                    <p className='text-lg font-light text-center'>Login to access the service</p>
                    {error && <p className='text-red-500 font-bold text-lg'>{error}</p>}
                    <form className='space-y-4' onSubmit={submit}>
                        <input
                            type='email'
                            placeholder='Email'
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                            className='w-full border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none rounded-lg p-2'
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            required
                            onChange={(e)=>setPassword(e.target.value)}
                            className='w-full border-2 border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-none rounded-lg p-2'
                        />

                        <input
                            type='submit'
                            value="Login"
                            className='w-full bg-green-600 flex items-center justify-center p-3 text-white font-medium rounded-full cursor-pointer'
                        />
                    </form>
                    <div className='py-4'>
                        <p className='text-right text-blue-500 font-medium cursor-pointer'>Forget Password?</p>
                    </div>
                    <div className='flex justify-between mt-4'>
                        <p className='mr-4'>For Opening New Account</p>
                        <button className='underline text-blue-500 font-medium' onClick={signup}>Sign Up</button>
                    </div>

                </div>
            </div>

            {/* Right Side - Background Image */}
            <div
                className="w-[60%] bg-cover bg-center"
                style={{ backgroundImage: `url(${Login1})` }}
            >
            </div>
        </div>
    );
};
