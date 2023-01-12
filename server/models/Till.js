const mongoose = require('mongoose');

const TillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    managerPassword: {
        type: Number,
        required: true
    },
    employees: {
        type: [Number]
    },
    tabs: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    props: {
        type: [String]
    }
});

module.exports = mongoose.model('Till', TillSchema);