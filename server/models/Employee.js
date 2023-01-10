const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isManager: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);