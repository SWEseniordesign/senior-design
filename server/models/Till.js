const mongoose = require('mongoose');

const TillSchema = new mongoose.Schema({
    loginId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    managerPassword: {
        type: Number,
        required: true
    },
    employees: {
        type: [String]
    },
    tabs: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    props: {
        type: [String]
    }
});

module.exports = mongoose.model('Till', TillSchema);