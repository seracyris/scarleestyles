import React from 'react'
import Filler_Img from '../../Assets/Pictures/filler_img.png'

const Hero = () => {
    return (
        <div className='bg-slate-500 w-screen h-[30%] flex flex-col'>
            <div className=' flex w-screen h-[30%] justify-center py-[5%]'>
                <div className='pr-14 flex-col text-center'>
                    <img className='h-64 w-64' src={Filler_Img} alt='filler_img' />
                    <h1 className='text-xl text-gray-300 font-bold pt-2'>Product Name</h1>
                    <p className='text-xs text-gray-400'>This is a description of the item</p>
                </div>
                <div className='px-14 flex flex-col text-center'>
                    <h1 className='text-xl text-gray-300 font-bold'>Product Name</h1>
                    <p className='text-xs text-gray-400 pb-2'>This is a description of the item</p>
                    <img className='h-64 w-64' src={Filler_Img} alt='filler_img' />
                </div>
                <div className='pl-14 flex flex-col text-center'>
                    <img className='w-[30rem] h-64' src={Filler_Img} alt='filler_img' />
                    <div className='bg-slate-600'>
                        <h1 className='text-xl text-gray-300 font-bold'>Product Name</h1>
                        <p className='text-xs text-gray-400 pb-2'>This is a description of the item</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero