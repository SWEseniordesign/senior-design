const mongoose = require('mongoose');
const { boolean } = require('yargs');

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
    },
    static: {
        type: boolean
    }
});

module.exports = mongoose.model('Card', CardSchema);