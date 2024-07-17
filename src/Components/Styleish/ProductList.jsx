import React, { useEffect, useState } from 'react';
import ProductCart from './ProductCart';

const ProductList = ({ searchQuery, filters }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch product data from the backend API
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                const data = await response.json();
                if (response.ok) {
                    setProducts(data);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (error) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSize = filters.size ? product.size && product.size.includes(filters.size) : true;
        const matchesColor = filters.color ? product.color && product.color.includes(filters.color) : true;
        return matchesSearch && matchesSize && matchesColor;
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='flex-1 px-6 py-10'>
            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {filteredProducts.map((product) =>
                        <ProductCart key={product.id} data={product} />
                    )}
                </div>
            ) : (
                <div className='text-white text-center'>No products found</div>
            )}
        </div>
    );
};

export default ProductList;
