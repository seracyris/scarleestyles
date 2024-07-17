import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ShoppingCart from '../Components/Styleish/ShoppingCart';
import Header from '../Components/Styleish/Header';
import ProductList from '../Components/Styleish/ProductList';
import Sidebar from '../Components/Styleish/Sidebar';
import { useSelector } from 'react-redux';
import Hero from '../Components/Styleish/Hero';

const Styleish = () => {
    const statusTabCart = useSelector(store => store.cart.statusTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        size: '',
        color: '',
    });

    const handleFilterChange = (filterName, value) => {
        setFilters({
            ...filters,
            [filterName]: value,
        });
    };

    return (
        <div className='bg-slate-900 min-h-screen'>
            <main className={`w-full max-w-full m-auto transform transition-transform duration-500 ${statusTabCart === false ? "" : "-translate-x-56"}`}>
                <Header setSearchQuery={setSearchQuery} />
                <Hero />
                <div className='flex'>
                    <Sidebar onFilterChange={handleFilterChange} />
                    <ProductList searchQuery={searchQuery} filters={filters} />
                </div>
                <Outlet />
            </main>
            <ShoppingCart />
        </div>
    );
};

export default Styleish;
