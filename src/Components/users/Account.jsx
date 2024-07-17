import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import countries from './countries'; // Import countries and states data

const Account = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        shippingInfo: {
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        },
        billingInfo: {
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });
    const navigate = useNavigate();
    const autocompleteRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data) {
                    setUser(response.data);
                    setFormData({
                        shippingInfo: response.data.shippingInfo,
                        billingInfo: response.data.billingInfo
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (editMode) {
            const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
                types: ['address'],
                componentRestrictions: { country: 'us' }
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                const address = place.formatted_address;
                const city = place.address_components.find(component => component.types.includes('locality'))?.long_name;
                const state = place.address_components.find(component => component.types.includes('administrative_area_level_1'))?.short_name;
                const zip = place.address_components.find(component => component.types.includes('postal_code'))?.long_name;
                const country = place.address_components.find(component => component.types.includes('country'))?.long_name;

                setFormData(prevState => ({
                    ...prevState,
                    shippingInfo: {
                        ...prevState.shippingInfo,
                        address,
                        city,
                        state,
                        zip,
                        country
                    }
                }));
            });
        }
    }, [editMode]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [name]: value
            }
        }));
    };

    const handleCountryChange = (e, section) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                country: value,
                state: '' // Reset state when country changes
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('http://localhost:5000/user', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data) {
                setUser(response.data);
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    const renderStateDropdown = (section) => {
        const country = formData[section].country;
        if (!country) return null;
        const states = countries.find(c => c.name === country)?.states || [];
        return (
            <div className="mb-4">
                <label className="block text-gray-700">State</label>
                <select
                    name="state"
                    value={formData[section].state}
                    onChange={(e) => handleChange(e, section)}
                    className="w-full px-3 py-2 mt-1 border rounded-lg"
                >
                    <option value="">Select a state</option>
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                <h1 className="text-4xl font-bold mb-8 text-center">Account Information</h1>
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                        <p className="mb-2"><strong>Username:</strong> {user.username}</p>
                        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                        {user.profilePicture && (
                            <img
                                src={`data:image/jpeg;base64,${user.profilePicture}`}
                                alt="Profile"
                                className="w-32 h-32 rounded-full mt-4"
                            />
                        )}
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold mb-4">Points & Preferences</h2>
                        <p className="mb-2"><strong>Points:</strong> {user.points}</p>
                        <h3 className="text-xl font-semibold mt-4">Preferences</h3>
                        <ul className="list-disc list-inside mt-2">
                            {user.preferences.map((preference, index) => (
                                <li key={index}>{preference}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-8">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
                        {editMode ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Address</label>
                                    <input
                                        ref={autocompleteRef}
                                        type="text"
                                        name="address"
                                        value={formData.shippingInfo.address}
                                        onChange={(e) => handleChange(e, 'shippingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.shippingInfo.city}
                                        onChange={(e) => handleChange(e, 'shippingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        value={formData.shippingInfo.country}
                                        onChange={(e) => handleCountryChange(e, 'shippingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map((country, index) => (
                                            <option key={index} value={country.name}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {renderStateDropdown('shippingInfo')}
                                <div className="mb-4">
                                    <label className="block text-gray-700">Zip</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.shippingInfo.zip}
                                        onChange={(e) => handleChange(e, 'shippingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
                                <button type="button" onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 ml-2 rounded-lg">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <p className="mb-2"><strong>Address:</strong> {user.shippingInfo.address}</p>
                                <p className="mb-2"><strong>City:</strong> {user.shippingInfo.city}</p>
                                <p className="mb-2"><strong>State:</strong> {user.shippingInfo.state}</p>
                                <p className="mb-2"><strong>Zip:</strong> {user.shippingInfo.zip}</p>
                                <p className="mb-2"><strong>Country:</strong> {user.shippingInfo.country}</p>
                                <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg">Edit</button>
                            </>
                        )}
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
                        {editMode ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.billingInfo.address}
                                        onChange={(e) => handleChange(e, 'billingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.billingInfo.city}
                                        onChange={(e) => handleChange(e, 'billingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        value={formData.billingInfo.country}
                                        onChange={(e) => handleCountryChange(e, 'billingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map((country, index) => (
                                            <option key={index} value={country.name}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {renderStateDropdown('billingInfo')}
                                <div className="mb-4">
                                    <label className="block text-gray-700">Zip</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.billingInfo.zip}
                                        onChange={(e) => handleChange(e, 'billingInfo')}
                                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
                                <button type="button" onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 ml-2 rounded-lg">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <p className="mb-2"><strong>Address:</strong> {user.billingInfo.address}</p>
                                <p className="mb-2"><strong>City:</strong> {user.billingInfo.city}</p>
                                <p className="mb-2"><strong>State:</strong> {user.billingInfo.state}</p>
                                <p className="mb-2"><strong>Zip:</strong> {user.billingInfo.zip}</p>
                                <p className="mb-2"><strong>Country:</strong> {user.billingInfo.country}</p>
                                <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg">Edit</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
