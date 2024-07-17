import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Select from 'react-select';

const libraries = ['places'];

const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    // Add more countries as needed
];

const cityOptions = {
    US: [
        { value: 'New York', label: 'New York' },
        { value: 'Los Angeles', label: 'Los Angeles' },
        // Add more US cities as needed
    ],
    CA: [
        { value: 'Toronto', label: 'Toronto' },
        { value: 'Vancouver', label: 'Vancouver' },
        // Add more Canadian cities as needed
    ],
};

const Register = () => {
    const [stage, setStage] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: null,
        shippingInfo: {
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        },
        preferences: []
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [autocomplete, setAutocomplete] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNestedChange = (value, category, field) => {
        setFormData({
            ...formData,
            [category]: {
                ...formData[category],
                [field]: value
            }
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profilePicture: e.target.files[0]
        });
    };

    const validateStageOne = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStageTwo = () => {
        const newErrors = {};
        const shippingInfo = formData.shippingInfo;
        if (!shippingInfo.address) newErrors.shippingAddress = 'Shipping address is required';
        if (!shippingInfo.city) newErrors.shippingCity = 'Shipping city is required';
        if (!shippingInfo.state) newErrors.shippingState = 'Shipping state is required';
        if (!shippingInfo.zip) newErrors.shippingZip = 'Shipping ZIP code is required';
        if (!shippingInfo.country) newErrors.shippingCountry = 'Shipping country is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStage = () => {
        let isValid = false;
        if (stage === 1) {
            isValid = validateStageOne();
        } else if (stage === 2) {
            isValid = validateStageTwo();
        }

        if (isValid) {
            setStage(stage + 1);
        }
    };

    const handlePreviousStage = () => {
        setStage(stage - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStageOne() || !validateStageTwo()) {
            return;
        }

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('username', formData.username);
            formDataToSubmit.append('email', formData.email);
            formDataToSubmit.append('password', formData.password);
            formDataToSubmit.append('profilePicture', formData.profilePicture);
            formDataToSubmit.append('shippingInfo', JSON.stringify(formData.shippingInfo));
            formDataToSubmit.append('preferences', JSON.stringify(formData.preferences));

            const response = await axios.post('http://localhost:5000/register', formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/login'); // Navigate to the login page
        } catch (error) {
            console.error('Error registering:', error);
            console.log(error.response.data); // Log server response for debugging
        }
    };

    const handlePlaceSelect = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            const addressComponents = place.address_components;
            let city = '';
            let state = '';
            let country = '';
            let zip = '';

            addressComponents.forEach(component => {
                const types = component.types;
                if (types.includes('locality')) {
                    city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                }
                if (types.includes('country')) {
                    country = component.long_name;
                }
                if (types.includes('postal_code')) {
                    zip = component.long_name;
                }
            });

            setFormData({
                ...formData,
                shippingInfo: {
                    address: place.formatted_address,
                    city,
                    state,
                    country,
                    zip
                }
            });
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const renderStageOne = () => (
        <>
            <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : ''}`}
                    required
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                    required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4 relative">
                <label className="block text-gray-700">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="mb-4 relative">
                <label className="block text-gray-700">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Profile Picture</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                type="button"
                onClick={handleNextStage}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Next
            </button>
        </>
    );

    const renderStageTwo = () => (
        <div className="w-full p-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Shipping Information</h3>
            <LoadScript
                googleMapsApiKey="AIzaSyDIt1wFwxzYLsxwBL68ld7kJTVuQCqjiQc"
                libraries={libraries}
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(false)}
            >
                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <Autocomplete
                        onLoad={autocomplete => setAutocomplete(autocomplete)}
                        onPlaceChanged={handlePlaceSelect}
                    >
                        <input
                            type="text"
                            name="address"
                            value={formData.shippingInfo.address}
                            onChange={(e) => handleNestedChange(e.target.value, 'shippingInfo', 'address')}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shippingAddress ? 'border-red-500' : ''}`}
                            required
                        />
                    </Autocomplete>
                    {errors.shippingAddress && <p className="text-red-500 text-sm">{errors.shippingAddress}</p>}
                </div>
            </LoadScript>
            {!isLoaded && <p>Loading...</p>}
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-gray-700">City</label>
                    <Select
                        options={cityOptions[formData.shippingInfo.country] || []}
                        onChange={(selectedOption) => handleNestedChange(selectedOption.value, 'shippingInfo', 'city')}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shippingCity ? 'border-red-500' : ''}`}
                        isSearchable={false}
                        required
                    />
                    {errors.shippingCity && <p className="text-red-500 text-sm">{errors.shippingCity}</p>}
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-gray-700">State</label>
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.shippingInfo.state}
                        onChange={(e) => handleNestedChange(e.target.value, 'shippingInfo', 'state')}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shippingState ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.shippingState && <p className="text-red-500 text-sm">{errors.shippingState}</p>}
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-gray-700">ZIP Code</label>
                    <input
                        type="text"
                        name="zip"
                        placeholder="ZIP Code"
                        value={formData.shippingInfo.zip}
                        onChange={(e) => handleNestedChange(e.target.value, 'shippingInfo', 'zip')}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shippingZip ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.shippingZip && <p className="text-red-500 text-sm">{errors.shippingZip}</p>}
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-gray-700">Country</label>
                    <Select
                        options={countryOptions}
                        onChange={(selectedOption) => handleNestedChange(selectedOption.value, 'shippingInfo', 'country')}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shippingCountry ? 'border-red-500' : ''}`}
                        isSearchable={false}
                        required
                    />
                    {errors.shippingCountry && <p className="text-red-500 text-sm">{errors.shippingCountry}</p>}
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNextStage}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Next
                </button>
            </div>
        </div>
    );

    const renderStageThree = () => (
        <div className="w-full p-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Preferences</h3>
            <div className="mb-4">
                <label className="block text-gray-700">Preferences (comma separated)</label>
                <input
                    type="text"
                    name="preferences"
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value.split(',') })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={handlePreviousStage}
                    className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Register
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex">
                {stage === 1 ? (
                    <div className="w-full md:w-1/2 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-gray-900">Register</h2>
                            <p className="text-gray-600">Please fill in the details below to create an account</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {renderStageOne()}
                        </form>
                    </div>
                ) : (
                    <div className="w-full p-8">
                        <form onSubmit={handleSubmit}>
                            {stage === 2 && renderStageTwo()}
                            {stage === 3 && renderStageThree()}
                        </form>
                    </div>
                )}
                {stage === 1 && (
                    <div className="hidden md:block md:w-1/2 bg-blue-100 rounded-r-lg p-8">
                        <div className="flex flex-col items-center justify-center h-full">
                            <img src="/path-to-your-image.png" alt="Illustration" className="mb-4" />
                            <p className="text-gray-600">Manage your task in a easy and more efficient way with Tasky...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
