const mongoose = require('mongoose');

const TabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String
    },
    cards: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('Tab', TabSchema);