import React, { useState } from 'react';
import { FaUser, FaLock, FaBell, FaSave, FaKey } from 'react-icons/fa';

const SettingsPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 w-screen">
            <h2 className="text-3xl font-semibold mb-6">Settings</h2>

            <div className="space-y-6 w-full max-w-6xl">
                <ProfileSettings />
                <AccountSettings />
            </div>
        </div>
    );
};

const ProfileSettings = () => {
    const [adminKey] = useState(() => Math.random().toString(36).substring(2, 10));

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaUser className="mr-2" /> Profile Settings
            </h3>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input type="file" className="mt-1 p-2 w-full border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" className="mt-1 p-2 w-full border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="mt-1 p-2 w-full border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Key</label>
                    <div className="mt-1 p-2 w-full border rounded-md bg-gray-200 flex items-center">
                        <FaKey className="mr-2" /> {adminKey}
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                    <FaSave className="mr-2" /> Save Changes
                </button>
            </form>
        </div>
    );
};

const AccountSettings = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaLock className="mr-2" /> Account Settings
        </h3>
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" className="mt-1 p-2 w-full border rounded-md" />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                <FaSave className="mr-2" /> Save Changes
            </button>
        </form>
    </div>
);

export default SettingsPage;
