// src/components/OrdersPage.js

import React from 'react';

const orders = [
    { id: 1, customer: 'Test User', date: '07-07-2024', amount: '$100.00', status: 'Pending' },
    { id: 2, customer: 'Test User', date: '07-07-2024', amount: '$250.00', status: 'Completed' },
    { id: 3, customer: 'Test User', date: '07-07-2024', amount: '$180.00', status: 'Processing' },
    // Add more orders as needed
];

const Orders = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 w-screen">
            <div className="max-w-7xl mx-auto py-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-4">Orders</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-6 bg-gray-200"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="py-3 px-6 whitespace-nowrap">{order.id}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{order.customer}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{order.date}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{order.amount}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
