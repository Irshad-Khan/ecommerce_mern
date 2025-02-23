const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100,'Product name can not exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        maxLength: [5, 'Product price can not exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: [
                'Electronics',
                'Camera',
                'Laptop',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Home & Garden',
                'Sports & Outdoors',
                'Toys & Games',
                'Clothes/Shoes',
                'Beauty & Health',
                'Kitchen & Dining',
                'Pet Supplies',
                'Travel & Luggage',
                'Services',
                'Entertainment',
                'Gifts & Cards',
                'Business & Industrial',
                'Music',
                'Animals & Pets',
                'Office Supplies',
                'Furniture',
                'Home Decor',
                'Home Automation',
                'Tools & Gadgets',
                'Construction & Tools',
                'Automotive',
                'Office Supplies',
                'Office Products',
                'Office Furniture',
                'Office Technology',
                'Office Supplies',
                'Office Equipment',
                'Office Accessories',
                'Office Furniture',
                'Other'
            ],
            message: 'Please select correct product category'
        }  
    },
    seller: {
        type: String,
        required: [true, 'Product seller is required']
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user:{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);