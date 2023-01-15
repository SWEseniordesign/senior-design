const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    props: {
        type: [String]
    },
    stock: {
        type: Number,
    }
});

module.exports = mongoose.model('Item', ItemSchema);