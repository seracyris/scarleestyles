import React, { useState } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useSpring, animated } from '@react-spring/web';
import CartButton from './CartButton';
import '../Styleish/navbar.css';

const Header = ({ setSearchQuery }) => {
    const [navOpen, setNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const handleChangeNav = () => {
        setNavOpen(!navOpen);
    };

    const handleSearchClick = () => {
        setSearchOpen(!searchOpen);
    };

    const textPosition = useSpring({
        left: navOpen ? '10px' : '50%',
        transform: navOpen ? 'translateX(0)' : 'translateX(-50%)',
        config: { duration: 1000 }
    });

    const navAnimation = useSpring({
        transform: navOpen ? 'translateX(0)' : 'translateX(-100%)',
        config: { duration: 1000 }
    });

    const linksAnimation = useSpring({
        opacity: navOpen ? 1 : 0,
        transform: navOpen ? 'translateX(0)' : 'translateX(-100%)',
        config: { duration: 1000 }
    });

    const searchAnimation = useSpring({
        width: searchOpen ? '200px' : '40px',
        padding: searchOpen ? '5px' : '0px',
        config: { duration: 500 }
    });

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className='w-screen bg-slate-800 h-16 flex items-center justify-between px-10 relative'>
            <animated.div style={textPosition} className='flex text-white font-bold text-2xl items-center cursor-pointer absolute'>
                <a href='/styleish' onClick={() => setNavOpen(false)}>
                    <h1 className='pr-2'>Style.ish</h1>
                </a>
                <FaBars onClick={handleChangeNav} />
            </animated.div>
            <animated.div style={navAnimation} className={`absolute top-0 left-0 w-full h-16 bg-slate-800 flex items-center justify-center ${navOpen ? 'nav-show' : 'nav-hidden'}`}>
                <animated.div style={linksAnimation} className='flex space-x-4'>
                    <a className='text-slate-400 text-center px-4 py-2 hover:text-slate-50' href='/'>HOME</a>
                    <a className='text-slate-400 text-center px-4 py-2 hover:text-slate-50' href='/styleish'>STYLE.ISH</a>
                    <a className='text-slate-400 text-center px-4 py-2 hover:text-slate-50' href='/fckface'>F_CKFACE</a>
                    <a className='text-slate-400 text-center px-4 py-2 hover:text-slate-50' href='/fckish-photos'>F_CK.ISH PHOTOS</a>
                    <a className='text-slate-400 text-center px-4 py-2 hover:text-slate-50' href='/contact'>CONTACT</a>
                    <a className='text-slate-400 text-center px-4 py-2 hover:text-slate-50' href='/about'>ABOUT</a>
                </animated.div>
            </animated.div>
            <div className='absolute right-10 flex items-center space-x-4'>
                <animated.div style={searchAnimation} className='flex items-center w-5 h-10 justify-center bg-[#64748b] rounded-full overflow-hidden'>
                    {searchOpen ? (
                        <>
                            <FaSearch className='searchicon text-white cursor-pointer' />
                            <input
                                className='input flex-1 outline-none bg-transparent text-white'
                                placeholder='Search...'
                                onChange={handleSearchInputChange}
                            />
                        </>
                    ) : (
                        <FaSearch className='searchicon text-white cursor-pointer' onClick={handleSearchClick} />
                    )}
                </animated.div>
                <CartButton />
            </div>
        </div>
    );
};

export default Header;
