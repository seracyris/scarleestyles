import React, { useState, useEffect } from 'react';
import { SiDialogflow } from "react-icons/si";
import { FaEdit } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEditUser = (user) => {
        setSelectedUser(user);
    };

    const handleSaveUser = async (updatedUser) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${updatedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 w-screen text-center">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Profile</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Purchases</th>
                            <th className="py-2">Amount Spent</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-t">
                                <td className="py-2 px-4 flex justify-center">
                                    <img src={user.profilePicture || 'https://via.placeholder.com/50'} alt={user.username} className="rounded-full w-12 h-12" />
                                </td>
                                <td className="py-2 px-4">{user.username}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4 text-center">{user.previousPurchases.length}</td>
                                <td className="py-2 px-4 text-center">${user.points.toFixed(2)}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedUser && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="bg-white rounded max-w-md mx-auto p-6 space-y-4">
                            <h3 className="text-lg font-semibold">Edit User</h3>
                            <div>
                                <label className="block text-sm">Name</label>
                                <input
                                    type="text"
                                    value={selectedUser.username}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm">Email</label>
                                <input
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm">Purchases</label>
                                <input
                                    type="number"
                                    value={selectedUser.previousPurchases.length}
                                    readOnly
                                    className="mt-1 block w-full px-3 py-2 border rounded bg-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm">Amount Spent</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={selectedUser.points}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, points: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                    onClick={() => handleSaveUser(selectedUser)}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
