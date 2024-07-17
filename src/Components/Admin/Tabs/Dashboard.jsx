import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [pageInfo, setPageInfo] = useState(null);
    const [recentEntries, setRecentEntries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPageInfo = async () => {
            try {
                const pageInfoResponse = await fetch('http://localhost:5000/pageinfo');
                const recentEntriesResponse = await fetch('http://localhost:5000/recent-entries');

                if (!pageInfoResponse.ok || !recentEntriesResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const pageInfoData = await pageInfoResponse.json();
                const recentEntriesData = await recentEntriesResponse.json();

                setPageInfo(pageInfoData);
                setRecentEntries(recentEntriesData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPageInfo();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-4 bg-slate-800 min-h-screen'>
            <h1 className='text-3xl font-semibold text-white mb-6'>Dashboard</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded shadow'>
                    <h2 className='text-xl font-bold mb-2'>Statistics</h2>
                    <p>Total Users: {pageInfo.userdata.totalusers}</p>
                    <p>Active Users: {pageInfo.userdata.activeusers}</p>
                    <p>Offline Users: {pageInfo.userdata.offlineusers}</p>
                </div>
                <div className='bg-white p-4 rounded shadow'>
                    <h2 className='text-xl font-bold mb-2'>Recent Activities</h2>
                    <ul>
                        <li>Recently Signed Up User: {recentEntries.recentUser.username || 'None'}</li>
                        <li>Last Product Added: {recentEntries.recentProduct.name || 'None'}</li>
                        <li>Last Order Placed: {recentEntries.recentOrder.orderId || 'None'}</li>
                    </ul>
                </div>
                <div className='bg-white p-4 rounded shadow'>
                    <h2 className='text-xl font-bold mb-2'>Notifications</h2>
                    <ul>
                        <li>Server maintenance at 3 AM</li>
                        <li>New feature released</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
