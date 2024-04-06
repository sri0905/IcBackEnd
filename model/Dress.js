const mongoose = require('mongoose')

const {Schema} = mongoose


const dressSchema = new Schema({
    image:{
        type:String,
        required: true
    },
    color:{
        type:String
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
    }
})
module.exports = mongoose.model('dress', dressSchema)