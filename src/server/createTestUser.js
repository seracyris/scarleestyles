const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
mongoose.connect('mongodb+srv://seracyris:O03nGE7Iy6QQoOyD@scarleestyles.bu4zoep.mongodb.net/scarleestyles?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
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

// Function to create a test admin user
const createTestAdminUser = async () => {
    try {
        const existingUser = await User.findOne({ email: 'testadmin@example.com' });
        if (existingUser) {
            console.log('Test admin user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('test', 10);
        const newUser = new User({
            username: 'testadmin',
            email: 'testadmin@example.com',
            password: hashedPassword,
            isAdmin: true
        });

        await newUser.save();
        console.log('Test admin user created successfully');
    } catch (error) {
        console.error('Error creating test admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createTestAdminUser();