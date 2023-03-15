const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    date: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);