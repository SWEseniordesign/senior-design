const mongoose = require('mongoose');
/*
TODO
After looking at this I think that a business ObjectId should probably be stored in Till?
*/
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