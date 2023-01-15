const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String
    },
    dimensions: {
        type: {x: Number, y: Number, width: Number, height: Number}
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('Card', CardSchema);