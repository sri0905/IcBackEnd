const mongoose = require('mongoose');

const { Schema } = mongoose;

const dressSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    size: {
        type: Number
    },
    dressType: {
        type: String,
        required: true
    },
    color: {
        name: {
            type: String
        },
        hex: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('dress', dressSchema);
