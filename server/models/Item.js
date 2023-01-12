const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
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
        required: true
    },
    props: {
        type: [String]
    },
    stock: {
        type: Number,
    }
});

module.exports = mongoose.model('Item', ItemSchema);