const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        //if yarn server was ran, connect to myTill
        if(process.env.npm_lifecycle_event === 'server'){
            console.log('Connecting to Database: myTill');
            const conn = await mongoose.connect(process.env.MONGO_URI_MYTILL, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        else { //else connect to test
            console.log('Connecting to Database: test');
            const conn = await mongoose.connect(process.env.MONGO_URI_TEST, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;