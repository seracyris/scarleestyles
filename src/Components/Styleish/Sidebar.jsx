import React from 'react';

const Sidebar = ({ onFilterChange }) => {
    const handleSizeChange = (event) => {
        onFilterChange('size', event.target.value);
    };

    const handleColorChange = (event) => {
        onFilterChange('color', event.target.value);
    };

    return (
        <div className='w-64 bg-slate-800 text-white p-5'>
            <h2 className='text-2xl mb-4'>Filters</h2>
            <div className='mb-4'>
                <label className='block mb-2'>Size</label>
                <select onChange={handleSizeChange} className='w-full p-2 bg-slate-700 border border-slate-600 rounded'>
                    <option value=''>All Sizes</option>
                    <option value='small'>Small</option>
                    <option value='medium'>Medium</option>
                    <option value='large'>Large</option>
                </select>
            </div>
            <div className='mb-4'>
                <label className='block mb-2'>Color</label>
                <select onChange={handleColorChange} className='w-full p-2 bg-slate-700 border border-slate-600 rounded'>
                    <option value=''>All Colors</option>
                    <option value='red'>Red</option>
                    <option value='blue'>Blue</option>
                    <option value='green'>Green</option>
                </select>
            </div>
        </div>
    );
};

export default Sidebar;
