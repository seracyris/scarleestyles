import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from './CartItem';
import { toggleStatusTab } from '../../stores/cart';
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
    const carts = useSelector(store => store.cart.items);
    const statusTab = useSelector(store => store.cart.statusTab);
    const dispatch = useDispatch();

    const handleCloseTabCart = () => {
        dispatch(toggleStatusTab());
    };

    const navigate = useNavigate();
    const handleCheckout = () => {
        let path = '/styleish/checkout';
        navigate(path);
    };

    return (
        <div className={`fixed top-0 right-0 bg-gray-700 shadow-2xl w-96 h-full grid grid-rows-[60px_1fr_60px] transform transition-transform duration-500 ${statusTab === false ? "translate-x-full" : ""}`}>
            <h2 className='p-5 text-white text-2xl'>Shopping Cart</h2>
            <div className='p-5 overflow-y-auto'>
                {carts.length > 0 ? (
                    carts.map((item, key) => <CartItem key={key} data={item} />)
                ) : (
                    <p className='text-white'>Your cart is empty</p>
                )}
            </div>
            <div className='grid grid-cols-2'>
                <button className='bg-black text-white' onClick={handleCloseTabCart}>CLOSE</button>
                <button className='bg-green-600 text-white' onClick={handleCheckout}>CHECKOUT</button>
            </div>
        </div>
    );
};

export default ShoppingCart;
