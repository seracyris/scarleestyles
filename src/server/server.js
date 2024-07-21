const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://seracyris:O03nGE7Iy6QQoOyD@scarleestyles.bu4zoep.mongodb.net/scarleestyles?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Schemas and Models
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    keywords: { type: [String], required: true },
    sizes: {
        XXS: { type: Number, required: true },
        XS: { type: Number, required: true },
        S: { type: Number, required: true },
        M: { type: Number, required: true },
        L: { type: Number, required: true },
        XL: { type: Number, required: true },
        XXL: { type: Number, required: true },
        OneSize: { type: Number, required: true }
    },
    colors: { type: [String], required: true }
}, { collection: 'products' });

const userSchema = new mongoose.Schema({
    userId: { type: String, default: uuidv4 },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    preferences: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    adminKey: { type: String, default: '' },
    shippingInfo: {
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    billingInfo: {
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    points: { type: Number, default: 0 },
    previousPurchases: { type: [String], default: [] },
    currentOrders: { type: [String], default: [] },
    pendingOrders: { type: [String], default: [] },
    previousOrders: { type: [String], default: [] }
}, { collection: 'users' });

const orderSchema = new mongoose.Schema({
    orderId: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    products: { type: [String], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true, enum: ['active', 'completed', 'canceled'] }
}, { collection: 'orders' });

const pageInfoSchema = new mongoose.Schema({
    userdata: {
        totalusers: { type: Number, default: 0 },
        activeusers: { type: Number, default: 0 },
        offlineusers: { type: Number, default: 0 }
    },
    orders: {
        totalorders: { type: Number, default: 0 },
        activeorders: { type: Number, default: 0 },
        canceledorders: { type: Number, default: 0 }
    }
}, { collection: 'pageinfo' });

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const PageInfo = mongoose.model('PageInfo', pageInfoSchema);

// Function to update page info
const updatePageInfo = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const offlineUsers = totalUsers - activeUsers;

        const totalOrders = await Order.countDocuments({ status: 'completed' });
        const activeOrders = await Order.countDocuments({ status: 'active' });
        const canceledOrders = await Order.countDocuments({ status: 'canceled' });

        await PageInfo.findOneAndUpdate(
            {},
            {
                'userdata.totalusers': totalUsers,
                'userdata.activeusers': activeUsers,
                'userdata.offlineusers': offlineUsers,
                'orders.totalorders': totalOrders,
                'orders.activeorders': activeOrders,
                'orders.canceledorders': canceledOrders
            },
            { new: true, upsert: true }
        );

        console.log('Page info updated successfully');
    } catch (error) {
        console.error('Error updating page info:', error);
    }
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            console.log('Failed to authenticate token');
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.userId;
        next();
    });
};

// Middleware to verify JWT and check admin status
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            console.log('Failed to authenticate token');
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        try {
            const user = await User.findById(decoded.userId);
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.isAdmin) {
                console.log('Access denied');
                return res.status(403).json({ message: 'Access denied' });
            }
            req.userId = decoded.userId;
            next();
        } catch (err) {
            console.log('Server error');
            return res.status(500).json({ message: 'Server error' });
        }
    });
};

// User Routes
app.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { username, email, password, shippingInfo, billingInfo, preferences } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePicture: req.file ? req.file.buffer.toString('base64') : '',
            shippingInfo: JSON.parse(shippingInfo),
            billingInfo: JSON.parse(billingInfo),
            preferences: JSON.parse(preferences)
        });
        await newUser.save();
        await updatePageInfo(); // Update page info after user registration
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login a user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Order Routes
app.post('/orders', async (req, res) => {
    const { userId, products, totalAmount, status } = req.body;
    try {
        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            status
        });
        await newOrder.save();
        await updatePageInfo(); // Update page info after order creation
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findOneAndUpdate({ orderId: id }, req.body, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await updatePageInfo(); // Update page info after order update
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ orderId: id });

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await updatePageInfo(); // Update page info after order deletion
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to verify token and extract user info
const verifyTokens = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        try {
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(500).json({ message: 'Server error' });
        }
    });
};

// Endpoint to get user info
app.get('/user-info', verifyTokens, (req, res) => {
    res.json({
        isAdmin: req.user.isAdmin,
        username: req.user.username,
        email: req.user.email,
        profilePicture: req.user.profilePicture
    });
});

// Protect /admin routes
app.use('/admin', verifyAdmin);

app.get('/admin', (req, res) => {
    console.log('Admin page accessed');
    res.json({ message: 'Welcome to the admin page' });
});

// Endpoint to get page info
app.get('/pageinfo', async (req, res) => {
    try {
        const pageInfo = await PageInfo.findOne();
        res.json(pageInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get the most recent user, product, and order
app.get('/recent-entries', async (req, res) => {
    try {
        const recentUser = await User.findOne().sort({ _id: -1 }).limit(1);
        const recentProduct = await Product.findOne().sort({ _id: -1 }).limit(1);
        const recentOrder = await Order.findOne().sort({ _id: -1 }).limit(1);

        res.json({
            recentUser: recentUser || 'None',
            recentProduct: recentProduct || 'None',
            recentOrder: recentOrder || 'None'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get statistics data
app.get('/statistics', async (req, res) => {
    try {
        const dailySales = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const weeklySales = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
                    }
                }
            },
            {
                $group: {
                    _id: { $week: '$createdAt' },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const monthlySales = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: {
                        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const yearlySales = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: {
                        $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 5))
                    }
                }
            },
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.json({
            daily: dailySales,
            weekly: weeklySales,
            monthly: monthlySales,
            yearly: yearlySales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get a product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
