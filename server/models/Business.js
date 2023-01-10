const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    admins: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    tills: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('Business', BusinessSchema);