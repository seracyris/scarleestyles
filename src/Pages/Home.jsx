import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Home/Hero';

const Home = () => {
    return (
        <div className='bg-neutral-100 w-screen h-screen'>
            <Navbar />
            <Hero />
        </div>
    )
}

export default Home