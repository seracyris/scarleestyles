import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TbShoppingCartHeart } from 'react-icons/tb';
import { toggleStatusTab } from '../../stores/cart'; // Update the import path as needed

const CartButton = () => {
    const totalQuantity = useSelector((store) => store.cart.items.reduce((sum, item) => sum + item.quantity, 0));
    const dispatch = useDispatch();

    const handleOpenTabCart = () => {
        dispatch(toggleStatusTab());
    };

    return (
        <div className='relative cursor-pointer' onClick={handleOpenTabCart}>
            <TbShoppingCartHeart className='w-8 h-8 text-white' />
            {totalQuantity > 0 && (
                <span className='absolute top-2/3 right-1/2 bg-red-500 text-white text-sm w-5 h-5 rounded-full flex justify-center items-center text-center'>
                    {totalQuantity}
                </span>
            )}
        </div>
    );
};

export default CartButton;
