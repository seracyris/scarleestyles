import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        description: '',
        images: [''],
        sizes: {
            xxs: 0, xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, oneSize: 0
        },
        colors: [],
        keywords: [],
        tags: []
    });
    const [editItem, setEditItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    };

    const handleChange = (e, itemSetter) => {
        const { name, value } = e.target;
        itemSetter(prevState => ({ ...prevState, [name]: value }));
    };

    const handleArrayChange = (e, index, arrayName, itemSetter) => {
        const { value } = e.target;
        itemSetter(prevState => {
            const updatedArray = [...prevState[arrayName]];
            updatedArray[index] = value;
            return { ...prevState, [arrayName]: updatedArray };
        });
    };

    const handleSizeChange = (e, size, itemSetter) => {
        const { value } = e.target;
        itemSetter(prevState => ({
            ...prevState,
            sizes: { ...prevState.sizes, [size]: parseInt(value, 10) }
        }));
    };

    const handleAddField = (itemSetter, field) => {
        itemSetter(prevState => ({
            ...prevState,
            [field]: [...prevState[field], '']
        }));
    };

    const handleRemoveField = (index, itemSetter, field) => {
        itemSetter(prevState => {
            const updatedArray = [...prevState[field]];
            updatedArray.splice(index, 1);
            return { ...prevState, [field]: updatedArray };
        });
    };

    const handleKeyPress = (e, field, itemSetter) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            itemSetter(prevState => ({
                ...prevState,
                [field]: [...prevState[field], e.target.value.trim()]
            }));
            e.target.value = '';
            e.preventDefault();
        }
    };

    const generateSlug = (name, id) => {
        const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${id}`;
        return slug;
    };

    const addItem = async () => {
        if (newItem.name.trim() !== '' && newItem.price.trim() !== '') {
            const formattedPrice = parseFloat(newItem.price).toFixed(2);
            const newId = items.length + 1;
            const newProduct = {
                id: newId,
                ...newItem,
                price: formattedPrice,
                slug: generateSlug(newItem.name, newId),
                sizes: {
                    XXS: newItem.sizes.xxs,
                    XS: newItem.sizes.xs,
                    S: newItem.sizes.s,
                    M: newItem.sizes.m,
                    L: newItem.sizes.l,
                    XL: newItem.sizes.xl,
                    XXL: newItem.sizes.xxl,
                    OneSize: newItem.sizes.oneSize
                }
            };
            try {
                const response = await axios.post('http://localhost:5000/products', newProduct);
                setItems([...items, response.data]);
                setNewItem({
                    name: '',
                    price: '',
                    description: '',
                    images: [''],
                    sizes: {
                        xxs: 0, xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, oneSize: 0
                    },
                    colors: [],
                    keywords: [],
                    tags: []
                });
            } catch (error) {
                console.error('Failed to add item:', error);
            }
        }
    };

    const editSelectedItem = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/products/${editItem.id}`, editItem);
            setItems(items.map(item => (item.id === editItem.id ? response.data : item)));
            setEditItem(null);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to edit item:', error);
        }
    };

    const removeItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/products/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-4 bg-gray-200">
            <div className="overflow-x-auto mb-6 bg-white p-4 rounded-lg shadow-md">
                {items.length === 0 ? (
                    <div className="text-gray-600 text-center">No items in inventory.</div>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Image</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Name</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Price</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Description</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id} className="text-gray-700">
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">{item.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">${item.price}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">{item.description}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                            onClick={() => {
                                                setEditItem(item);
                                                setIsEditing(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900 ml-2"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={isEditing ? editItem.name : newItem.name}
                            onChange={(e) => handleChange(e, isEditing ? setEditItem : setNewItem)}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                            placeholder="Enter item name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={isEditing ? editItem.price : newItem.price}
                            onChange={(e) => handleChange(e, isEditing ? setEditItem : setNewItem)}
                            className="border border-gray-300 p-2 w-full rounded-lg"
                            placeholder="Enter item price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={isEditing ? editItem.description : newItem.description}
                            onChange={(e) => handleChange(e, isEditing ? setEditItem : setNewItem)}
                            rows="3"
                            className="border border-gray-300 p-2 w-full rounded-lg"
                            placeholder="Enter item description"
                        ></textarea>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Images</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(isEditing ? editItem.images : newItem.images).map((image, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => handleArrayChange(e, index, 'images', isEditing ? setEditItem : setNewItem)}
                                        className="border border-gray-300 p-2 w-full rounded-lg mb-2"
                                        placeholder="Enter image URL"
                                    />
                                    <button
                                        onClick={() => handleRemoveField(index, isEditing ? setEditItem : setNewItem, 'images')}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleAddField(isEditing ? setEditItem : setNewItem, 'images')}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                        >
                            + Add another image
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sizes</label>
                        <div className="flex items-center space-x-2">
                            <select
                                name="sizes"
                                className="border border-gray-300 p-2 w-full rounded-lg"
                                onChange={(e) => handleSizeChange(e, e.target.value, isEditing ? setEditItem : setNewItem)}
                            >
                                <option value="xxs">XXS</option>
                                <option value="xs">XS</option>
                                <option value="s">S</option>
                                <option value="m">M</option>
                                <option value="l">L</option>
                                <option value="xl">XL</option>
                                <option value="xxl">XXL</option>
                                <option value="oneSize">One Size</option>
                            </select>
                            <input
                                type="number"
                                className="border border-gray-300 p-2 w-full rounded-lg"
                                placeholder="Enter quantity"
                                onChange={(e) => handleSizeChange(e, e.target.value, isEditing ? setEditItem : setNewItem)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Colors</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                onKeyPress={(e) => handleKeyPress(e, 'colors', isEditing ? setEditItem : setNewItem)}
                                className="border border-gray-300 p-2 w-full rounded-lg"
                                placeholder="Enter color"
                            />
                            <button
                                onClick={() => handleAddField(isEditing ? setEditItem : setNewItem, 'colors')}
                                className="text-green-600 hover:text-green-800"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap mt-2 space-x-2">
                            {(isEditing ? editItem.colors : newItem.colors).map((color, index) => (
                                <span key={index} className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                    {color}
                                    <button
                                        onClick={() => handleRemoveField(index, isEditing ? setEditItem : setNewItem, 'colors')}
                                        className="ml-1 text-red-600 hover:text-red-800"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Keywords</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                onKeyPress={(e) => handleKeyPress(e, 'keywords', isEditing ? setEditItem : setNewItem)}
                                className="border border-gray-300 p-2 w-full rounded-lg"
                                placeholder="Enter keyword"
                            />
                            <button
                                onClick={() => handleAddField(isEditing ? setEditItem : setNewItem, 'keywords')}
                                className="text-green-600 hover:text-green-800"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap mt-2 space-x-2">
                            {(isEditing ? editItem.keywords : newItem.keywords).map((keyword, index) => (
                                <span key={index} className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                    {keyword}
                                    <button
                                        onClick={() => handleRemoveField(index, isEditing ? setEditItem : setNewItem, 'keywords')}
                                        className="ml-1 text-red-600 hover:text-red-800"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tags</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                onKeyPress={(e) => handleKeyPress(e, 'tags', isEditing ? setEditItem : setNewItem)}
                                className="border border-gray-300 p-2 w-full rounded-lg"
                                placeholder="Enter tag"
                            />
                            <button
                                onClick={() => handleAddField(isEditing ? setEditItem : setNewItem, 'tags')}
                                className="text-green-600 hover:text-green-800"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap mt-2 space-x-2">
                            {(isEditing ? editItem.tags : newItem.tags).map((tag, index) => (
                                <span key={index} className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveField(index, isEditing ? setEditItem : setNewItem, 'tags')}
                                        className="ml-1 text-red-600 hover:text-red-800"
                                    >
                                        x
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
                        onClick={isEditing ? editSelectedItem : addItem}
                    >
                        {isEditing ? 'Save Changes' : 'Add Item'}
                    </button>
                    {isEditing && (
                        <button
                            className="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md"
                            onClick={() => {
                                setEditItem(null);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
