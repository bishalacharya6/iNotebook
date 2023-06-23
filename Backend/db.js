const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook?directConnection=true&serverSelectionTimeoutMS=2000meoutMS=2000&appName=mongosh+1.9.1";


async function connectToMongo() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Mongodb connected successfully');
    }
    catch(err){
        console.log(`Sorry there seems to be an error: ${err}`);
    }
}


module.exports = connectToMongo; 