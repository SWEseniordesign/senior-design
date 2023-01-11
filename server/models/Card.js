const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String
    },
    dimensions: {
        type: {x: Number, y: Number, width: Number, height: Numbers}
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('Tab', TabSchema);