import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-screen h-screen bg-slate-800'>
            <div className='bg-slate-700 w-32 h-screen'>
                <div className='flex flex-col justify-center h-screen'>
                    <a className='float-left text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' href='/'>Home</a>
                    <a className='float-left text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' href='/'>Clearance</a>
                    <a className='float-left text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' href='/'>Style.ish</a>
                    <a className='float-left text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' href='/'>F_ckface</a>
                    <a className='float-left text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' href='/'>Contact</a>
                    <a className='float-left text-slate-400 text-center px-[14px] py-[12px] hover:text-slate-50' href='/'>About</a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar