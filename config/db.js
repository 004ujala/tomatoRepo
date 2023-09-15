const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log('db connected successfully');
    } catch (error) {
        console.log(`error in db connecting`);
    }
}


module.exports = connectDB;


