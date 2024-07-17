import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { SideBarItem } from '../Components/Admin/Sidebar';
import { LuLifeBuoy, LuReceipt, LuBoxes, LuPackage, LuUserCircle, LuBarChart3, LuLayoutDashboard, LuSettings } from 'react-icons/lu';
import PageLayout from '../Components/Admin/PageLayout';
import AdminError from '../Components/Admin/AdminError';

const Admin = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [isAdmin, setIsAdmin] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to /login');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user-info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    console.log('Token is invalid, redirecting to /login');
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                console.log('User info fetched:', data);
                setIsAdmin(data.isAdmin);
                setUserInfo(data);
            } catch (error) {
                console.log('Error fetching user info, redirecting to /login:', error);
                navigate('/login');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handlePageClick = (pageName) => {
        setActivePage(pageName);
    };

    if (isAdmin === null) {
        return <div>Loading...</div>; // or a loading indicator
    }

    if (!isAdmin) {
        return <AdminError />;
    }

    return (
        <div className='flex h-screen'>
            <Sidebar userInfo={userInfo}>
                <SideBarItem
                    onClick={() => handlePageClick('Dashboard')}
                    icon={<LuLayoutDashboard size={20} />}
                    active={activePage === 'Dashboard'}
                    text="Dashboard"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Statistics')}
                    icon={<LuBarChart3 size={20} />}
                    active={activePage === 'Statistics'}
                    text="Statistics"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Users')}
                    icon={<LuUserCircle size={20} />}
                    active={activePage === 'Users'}
                    text="Users"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Inventory')}
                    icon={<LuBoxes size={20} />}
                    active={activePage === 'Inventory'}
                    text="Inventory"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Orders')}
                    icon={<LuPackage size={20} />}
                    active={activePage === 'Orders'}
                    text="Orders"
                    alert
                />
                <SideBarItem
                    onClick={() => handlePageClick('Billings')}
                    icon={<LuReceipt size={20} />}
                    active={activePage === 'Billings'}
                    text="Billings"
                />
                <hr className='my-3' />
                <SideBarItem
                    onClick={() => handlePageClick('Settings')}
                    icon={<LuSettings size={20} />}
                    active={activePage === 'Settings'}
                    text="Settings"
                />
                <SideBarItem
                    onClick={() => handlePageClick('Help')}
                    icon={<LuLifeBuoy size={20} />}
                    active={activePage === 'Help'}
                    text="Help"
                />
            </Sidebar>
            <div className='flex-1 overflow-auto'>
                <PageLayout page={activePage} />
            </div>
        </div>
    );
};

export default Admin;
