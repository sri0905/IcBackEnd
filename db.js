const mongoose = require('mongoose')

const connectToMongoDb = async (req, res) =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/StyleSync")
        console.log("connected to mongoDb successfully")
    } catch (error) {
        console.log("error connecting to mongoDb", error)
    }

}

module.exports = connectToMongoDb