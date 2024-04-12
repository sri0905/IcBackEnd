const mongoose = require('mongoose')

const {Schema} = mongoose


const dressSchema = new Schema({
    image:{
        type:String,
        required: true
    },
    colorName:{
        type:String,
        required: true
    },
    brand:{
        type:String
    },
    size:{
        type:Number
    },
    dressType:{
        type:String,
        required:true
    },
    date:{
        type : Date,
        default: Date.now
    },
    colorHex:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('dress', dressSchema)