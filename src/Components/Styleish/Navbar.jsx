import React, { useState } from 'react'
import { FaBars, FaSearch } from 'react-icons/fa'
import './navbar.css'


const Navbar = () => {
    /*const [style, setStyle] = useState('center')
    const [navstyle, setNavstyle] = useState('nav-hidden')
    const [searchbar, setSearchbar] = useState('search-close')
    
    const changeSearch = () => {
        if (searchbar !== 'search-close') {
            setSearchbar('search-close')
        }
        else {
            setSearchbar('search-open')
        }
    }
    
    const changeStyle = () => {
        if (style !== 'center') {
            setStyle('center')
            setNavstyle('nav-hidden')
        }
        else {
            setStyle('left')
            setNavstyle('nav-show')
        }
    } */


    return (
        <div></div>
        /*<div className='w-screen h-16 bg-slate-800 flex flex-row text-white items-center justify-center'>
            <div className={style}>
                <a href='/styleish'><h1 className='pr-2 font-bold'>Style.ish</h1></a>
                <button className='button' onClick={changeStyle}>
                    <FaBars />
                </button>
            </div>
            <div className={navstyle}>
                <a href='/'>HOME</a>
                <a href='/styleish'>STYLE.ISH</a>
                <a href='/fckface'>F_CKFACE</a>
                <a href='/fckish-photos'>F_CK.ISH PHOTOS</a>
                <a href='/contact'>CONTACT</a>
                <a href='/about'>ABOUT</a>
            </div>
            <div className='absolute right-0 flex items-center justify-center'>
                <div className={searchbar}><button className='button' onClick={changeSearch}><FaSearch className='searchicon' /></button><input className='input' /></div>
            </div>
        </div>*/
    )
}

export default Navbar