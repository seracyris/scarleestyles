import React from 'react';
import { Link } from 'react-router-dom';
import { TbShoppingCartHeart } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../stores/cart';
import PropTypes from 'prop-types';

const ProductCart = ({ data }) => {
    const { id, name, price, images, slug } = data;
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({
            productId: id,
            quantity: 1
        }));
    };

    return (
        <div className='bg-white rounded-2xl overflow-hidden shadow-md transition-transform transform hover:scale-105 hover:shadow-lg w-full'>
            <Link to={`/products/${slug}`}>
                <div className='h-48 bg-cover bg-center' style={{ backgroundImage: `url(${images[0] || 'https://via.placeholder.com/400'})` }}>
                    <img src={images[0] || 'https://via.placeholder.com/400'} alt={slug} className='w-full h-full object-cover opacity-0' />
                </div>
            </Link>
            <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-900 text-center'>{name}</h3>
                <div className='flex justify-between items-center mt-4'>
                    <p className='pl-5 text-lg font-medium text-gray-700'>
                        ${price}
                    </p>
                    <button
                        className='bg-gradient-to-r from-purple-500 to-blue-500 text-white py-1 px-2 rounded-lg text-sm hover:from-purple-600 hover:to-blue-600 flex items-center gap-2 transition-colors'
                        onClick={handleAddToCart}
                    >
                        <TbShoppingCartHeart className='w-4 h-4' />
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

ProductCart.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        slug: PropTypes.string.isRequired,
        size: PropTypes.string, // Adjusted to not be required
        color: PropTypes.string, // Adjusted to not be required
    }).isRequired,
};

export default React.memo(ProductCart);
