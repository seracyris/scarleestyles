const ProductService = {
    getProductById: async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/products/${id}`);
            if (!response.ok) {
                throw new Error('Product not found');
            }
            const product = await response.json();
            console.log('Fetched Product by ID:', product);
            return product;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return null;
        }
    },
    getProductBySlug: async (slug) => {
        try {
            const response = await fetch(`http://localhost:5000/products/slug/${slug}`);
            if (!response.ok) {
                throw new Error('Product not found');
            }
            const product = await response.json();
            console.log('Fetched Product by Slug:', product);
            return product;
        } catch (error) {
            console.error('Error fetching product by Slug:', error);
            return null;
        }
    }
};

export default ProductService;
