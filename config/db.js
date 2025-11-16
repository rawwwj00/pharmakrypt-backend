const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pharmakrypt';


function connectDb(){
return mongoose.connect(MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
});
}


module.exports = connectDb;