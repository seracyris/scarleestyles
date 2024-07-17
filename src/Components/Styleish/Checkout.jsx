// src/components/CheckoutPage.js
import React from 'react';
import { products } from './Products';

const CheckoutPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <div className="mt-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            {products.map((product) => (
                                <div key={product.id} className="border-b border-gray-200 py-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img className="h-20 w-20 object-cover rounded" src={product.image} alt={product.name} />
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                                                <p className="text-sm text-gray-500">{product.description}</p>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-4 sm:px-6 flex justify-end">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Proceed to Payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
