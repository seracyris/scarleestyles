import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfilePic from '../Assets/Pictures/defaultProfilePic.png'; // Ensure you have a default profile picture in your assets

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedIn(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data) {
                    setIsLoggedIn(true);
                    if (response.data.profilePicture) {
                        setProfilePic(`data:image/jpeg;base64,${response.data.profilePicture}`);
                    } else {
                        setProfilePic(defaultProfilePic);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoggedIn(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setProfilePic(defaultProfilePic);
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='bg-slate-700 w-screen h-16 flex justify-between items-center px-4 pl-10'>
            <div className='flex'>
                <Link className='text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' to='/'>Home</Link>
                <Link className='text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' to='/styleish'>STYLE.ISH</Link>
                <Link className='text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' to='/fckface'>F_CKFACE</Link>
                <Link className='text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' to='/fckish-photos'>F_CK.ISH PHOTOS</Link>
                <Link className='text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' to='/contact'>CONTACT</Link>
                <Link className='text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' to='/about'>ABOUT</Link>
            </div>
            <div className='relative'>
                <img
                    src={profilePic}
                    alt='Profile'
                    className='w-10 h-10 rounded-full cursor-pointer'
                    onClick={toggleDropdown}
                />
                {dropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg'>
                        <ul>
                            {!isLoggedIn ? (
                                <>
                                    <li>
                                        <Link className='block px-4 py-2 text-gray-800 hover:bg-gray-100' to='/login'>Login</Link>
                                    </li>
                                    <li>
                                        <Link className='block px-4 py-2 text-gray-800 hover:bg-gray-100' to='/register'>Register</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className='block px-4 py-2 text-gray-800 hover:bg-gray-100' to='/account'>Account</Link>
                                    </li>
                                    <li>
                                        <Link className='block px-4 py-2 text-gray-800 hover:bg-gray-100' to='/orders'>Orders</Link>
                                    </li>
                                    <li>
                                        <Link className='block px-4 py-2 text-gray-800 hover:bg-gray-100' to='/cart'>Cart</Link>
                                    </li>
                                    <li>
                                        <Link className='block px-4 py-2 text-gray-800 hover:bg-gray-100' to='/settings'>Settings</Link>
                                    </li>
                                    <li>
                                        <button className='block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100' onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
