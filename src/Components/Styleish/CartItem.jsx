import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeQuantity } from '../../stores/cart';
import ProductService from '../../services/ProductService'; // Ensure this path is correct

const CartItem = (props) => {
    const { productId, quantity } = props.data;
    const [detail, setDetail] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const productDetail = await ProductService.getProductById(productId);
                console.log('Product Detail:', productDetail); // Debug log
                if (productDetail) {
                    setDetail(productDetail);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetail();
    }, [productId]);

    const handleMinusQuantity = () => {
        if (quantity > 1) {
            dispatch(changeQuantity({
                productId: productId,
                quantity: quantity - 1
            }));
        } else {
            dispatch(changeQuantity({
                productId: productId,
                quantity: 0
            }));
        }
    };

    const handlePlusQuantity = () => {
        dispatch(changeQuantity({
            productId: productId,
            quantity: quantity + 1
        }));
    };

    if (!detail) {
        return <div className='text-white'>Loading...</div>;
    }

    return (
        <div className='flex justify-between items-center bg-slate-600 text-white p-2 border-b-2 border-slate-700 gap-5 rounded-md'>
            <img src={detail.images[0]} alt={detail.name} className='w-12' />
            <h3>{detail.name}</h3>
            <p>${detail.price * quantity}</p>
            <div className='w-20 flex justify-between'>
                <button className='bg-gray-200 rounded-full w-6 h-6 text-cyan-600' onClick={handleMinusQuantity}>-</button>
                <span>{quantity}</span>
                <button className='bg-gray-200 rounded-full w-6 h-6 text-cyan-600' onClick={handlePlusQuantity}>+</button>
            </div>
        </div>
    );
};

export default CartItem;
