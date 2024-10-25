import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfilePic from '../Assets/Pictures/defaultProfilePic.png'; // Ensure you have a default profile picture in your assets
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
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
        <Navbar expand="lg" className="bg-indigo-200 md:h-16">
            <Container>
                <Navbar.Brand href="/">Scarlee Styles</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='flex flex-row justify-between'>
                    <Nav className="text-slate-200 hover:text-black px-4">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/styleish">Style.ish</Nav.Link>
                        <Nav.Link href="/fckface">F_ck Face</Nav.Link>
                        <Nav.Link href="/fckish-photos">F_ckish Photos</Nav.Link>
                        <NavDropdown title="Extra" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/contact">Contact</NavDropdown.Item>
                            <NavDropdown.Item href="/about">About</NavDropdown.Item>
                            <NavDropdown.Item href="/terms-of-service">Terms of Service</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/blog">Blog</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <div className='absolute right-10'>
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;