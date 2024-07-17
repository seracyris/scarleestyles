import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, toggleStatusTab } from '../stores/cart';
import Header from '../Components/Styleish/Header';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ProductService from '../services/ProductService';

const Detail = () => {
    const { slug } = useParams();
    const [detail, setDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                console.log(`Fetching product details for slug: ${slug}`);
                const response = await ProductService.getProductBySlug(slug);
                if (!response) {
                    throw new Error('Product not found');
                }
                console.log('Product data fetched:', response);
                setDetail(response);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [slug]);

    const handleMinusQuantity = () => {
        setQuantity(quantity - 1 < 1 ? 1 : quantity - 1);
    };

    const handlePlusQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        if (detail) {
            dispatch(addToCart({
                productId: detail.id,
                quantity: quantity
            }));
            dispatch(toggleStatusTab()); // Ensure this action is dispatched
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % detail.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + detail.images.length) % detail.images.length);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!detail) {
        return <div>No product details available</div>;
    }

    return (
        <div className='bg-slate-100 min-h-screen flex flex-col items-center'>
            <Header />
            <div className='container mx-auto px-4 py-10 flex flex-col items-center'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl'>
                    <div className='relative'>
                        {detail.images && detail.images.length > 0 && (
                            <div className='relative'>
                                <div className='w-full h-96'>
                                    <img src={detail.images[currentImageIndex]} alt={detail.name} className='w-full h-full object-contain rounded-lg' />
                                </div>
                                {detail.images.length > 1 && (
                                    <div className='absolute top-1/2 left-0 right-0 flex justify-between px-4'>
                                        <button onClick={prevImage} className='bg-gray-800 text-white rounded-full p-2'>
                                            <FaArrowLeft />
                                        </button>
                                        <button onClick={nextImage} className='bg-gray-800 text-white rounded-full p-2'>
                                            <FaArrowRight />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col gap-5 justify-center'>
                        <h1 className='text-4xl font-bold text-gray-800'>{detail.name}</h1>
                        <p className='text-3xl text-gray-600'>${detail.price}</p>
                        <div className='flex items-center gap-5'>
                            <div className='flex items-center gap-2'>
                                <button className='bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-800' onClick={handleMinusQuantity}>-</button>
                                <span className='text-xl'>{quantity}</span>
                                <button className='bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-800' onClick={handlePlusQuantity}>+</button>
                            </div>
                            <button className='bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg' onClick={handleAddToCart}>
                                Add To Cart
                            </button>
                        </div>
                        <p className='text-gray-700'>{detail.description}</p>
                        <div>
                            <h3 className='text-lg font-bold text-gray-800'>Available Sizes:</h3>
                            <div className='grid grid-cols-3 gap-2'>
                                {detail.sizes && Object.entries(detail.sizes).map(([size, qty]) => (
                                    qty > 0 && <span key={size} className='bg-gray-200 rounded-full px-3 py-1 text-center'>{size}: {qty}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className='text-lg font-bold text-gray-800'>Available Colors:</h3>
                            <ul className='flex gap-2'>
                                {detail.colors && detail.colors.map(color => (
                                    <li key={color} className='w-6 h-6 rounded-full' style={{ backgroundColor: color }}></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-lg font-bold text-gray-800'>Keywords:</h3>
                            <ul className='flex gap-2'>
                                {detail.keywords && detail.keywords.map(keyword => (
                                    <li key={keyword} className='bg-gray-200 rounded-full px-3 py-1 text-gray-800'>{keyword}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
