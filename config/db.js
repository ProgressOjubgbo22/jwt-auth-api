const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://Gabriel:Jason22@cluster0.sgmbncz.mongodb.net';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL)
        console.log("connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
