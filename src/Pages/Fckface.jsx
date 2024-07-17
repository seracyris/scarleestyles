import React from 'react'
import Navbar from '../Components/Navbar'

const Fckface = () => {
    return (
        <div className='w-screen h-screen bg-slate-800'>
            <Navbar />
            <div className='w-screen h-[50%] bg-slate-400'>

            </div>
            <div className='flex flex-col text-center p-10'>
                <h1 className='font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-white text-3xl sm:text-5xl'>Check out our latest shoot @f_ck.ish</h1>
                <div className='flex justify-center'>
                    <div className='text-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-1' />
                        <a href='https://www.instagram.com/f_ck.ish/' rel='noreferrer' target='_blank'>Photo Description & Link</a>
                    </div>
                    <div className='text-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-2' />
                        <a href='https://www.instagram.com/f_ck.ish/' rel='noreferrer' target='_blank'>Photo Description & Link</a>
                    </div>
                    <div className='text-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-3' />
                        <a href='https://www.instagram.com/f_ck.ish/' rel='noreferrer' target='_blank'>Photo Description & Link</a>
                    </div>
                    <div className='text-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-4' />
                        <a href='https://www.instagram.com/f_ck.ish/' rel='noreferrer' target='_blank'>Photo Description & Link</a>
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <h1 className='font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-black text-3xl sm:text-5xl'>Create your own workshop</h1>
                <div className='flex justify-center'>
                    <div className='bg-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-5' />
                        <a href='/fckface/outfits'>Outfits</a>
                    </div>
                    <div className='bg-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-6' />
                        <a href='/fckface/custom-clothing' rel='noreferrer'>Custom Clothing</a>
                    </div>
                    <div className='bg-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-7' />
                        <a href='/fckface/keychain' rel='noreferrer'>Keychain</a>
                    </div>
                    <div className='bg-white'>
                        <img className='bg-slate-600 w-[15rem] h-[15rem] m-5' src='https://files.catbox.moe/9iub37.png' alt='photo-8' />
                        <a href='/fckface/centerpiece'>Centerpiece</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fckface