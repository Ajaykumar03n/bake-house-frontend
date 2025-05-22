import React, { useState } from 'react';
import axios from 'axios';

export const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        try {
            const response = await axios.post("https://bake-house-backend.onrender.com/api/auth/reset-password", {
                email,
                oldPassword,
                newPassword,
            });

            const { message } = response.data;
            if (message === 'passwordchanged') {
                setMessage('Password reset successfully!');
            } else if (message === 'invalidCredentials') {
                setMessage('Invalid email or old password.');
            } else {
                setMessage('Error resetting password.');
            }
        } catch (error) {
            setMessage('Error occurred while resetting password.');
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Old Password:</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};
