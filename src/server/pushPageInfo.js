const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
mongoose.connect('mongodb+srv://seracyris:O03nGE7Iy6QQoOyD@scarleestyles.bu4zoep.mongodb.net/scarleestyles?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    pushPageInfo();
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// User Schema and Model
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

const User = mongoose.model('User', userSchema);

// Order Schema and Model
const orderSchema = new mongoose.Schema({
    orderId: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    products: { type: [String], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true, enum: ['active', 'completed', 'canceled'] }
}, { collection: 'orders' });

const Order = mongoose.model('Order', orderSchema);

// PageInfo Schema and Model
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

const PageInfo = mongoose.model('PageInfo', pageInfoSchema);

const pushPageInfo = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const offlineUsers = totalUsers - activeUsers;

        const totalOrders = await Order.countDocuments({ status: 'completed' });
        const activeOrders = await Order.countDocuments({ status: 'active' });
        const canceledOrders = await Order.countDocuments({ status: 'canceled' });

        const pageInfo = new PageInfo({
            userdata: {
                totalusers: totalUsers,
                activeusers: activeUsers,
                offlineusers: offlineUsers
            },
            orders: {
                totalorders: totalOrders,
                activeorders: activeOrders,
                canceledorders: canceledOrders
            }
        });

        await pageInfo.save();
        console.log('Page info pushed successfully');
    } catch (error) {
        console.error('Error pushing page info:', error);
    } finally {
        mongoose.connection.close();
    }
};
