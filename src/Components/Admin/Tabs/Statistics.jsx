import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StatisticsPage = () => {
    const [timeframe, setTimeframe] = useState('daily');
    const [salesData, setSalesData] = useState({ daily: [], weekly: [], monthly: [], yearly: [] });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:5000/statistics');
                const productsResponse = await fetch('http://localhost:5000/products');

                if (!response.ok || !productsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                const productsData = await productsResponse.json();

                setSalesData({
                    daily: data.daily.map(entry => entry.totalAmount),
                    weekly: data.weekly.map(entry => entry.totalAmount),
                    monthly: data.monthly.map(entry => entry.totalAmount),
                    yearly: data.yearly.map(entry => entry.totalAmount)
                });
                setProducts(productsData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const chartLabels = {
        daily: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        yearly: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    };

    const chartData = {
        labels: chartLabels[timeframe],
        datasets: [
            {
                label: 'Sales',
                data: salesData[timeframe],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen overflow-hidden">
            <h1 className="text-4xl font-bold mb-8 text-center">Sales Statistics</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col justify-center items-center">
                <div className="flex justify-center mb-4">
                    <button
                        className={`px-4 py-2 mx-2 rounded ${timeframe === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTimeframe('daily')}
                    >
                        Daily
                    </button>
                    <button
                        className={`px-4 py-2 mx-2 rounded ${timeframe === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTimeframe('weekly')}
                    >
                        Weekly
                    </button>
                    <button
                        className={`px-4 py-2 mx-2 rounded ${timeframe === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTimeframe('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`px-4 py-2 mx-2 rounded ${timeframe === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setTimeframe('yearly')}
                    >
                        Yearly
                    </button>
                </div>
                <div className="h-64">
                    <Line data={chartData} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-auto" style={{ maxHeight: '400px' }}>
                <h2 className="text-2xl font-semibold mb-4">Catalog of Sold Items</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Price</th>
                                <th className="py-2 px-4 border">Image</th>
                                <th className="py-2 px-4 border">Description</th>
                                <th className="py-2 px-4 border">Slug</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="py-2 px-4 border">{product.id}</td>
                                    <td className="py-2 px-4 border">{product.name}</td>
                                    <td className="py-2 px-4 border">${product.price.toFixed(2)}</td>
                                    <td className="py-2 px-4 border">
                                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td className="py-2 px-4 border">{product.description}</td>
                                    <td className="py-2 px-4 border">{product.slug}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
