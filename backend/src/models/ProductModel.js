const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        auth: { type: String, required: true },
        publisher: { type: String, required: true },
        type: { type: String, required: true },
        price_input: { type: Number, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        selled: { type: Number, default: 0 },
        description: { type: String },
        discount: { type: Number },
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
