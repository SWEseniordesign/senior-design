const mongoose = require('mongoose');


/**
 * Attempts to make connection to database
 *
 * @expects yarn server or yarn test or yarn dev to be ran
 * @success MongoDB Connected: ...
 * @error error then exit
 */
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
        else if (process.env.npm_lifecycle_event === 'test') { //else connect to test
            console.log('Connecting to Database: test');
            const conn = await mongoose.connect(process.env.MONGO_URI_TEST, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        else {
            console.log('Connecting to Database: dev');
            const conn = await mongoose.connect(process.env.MONGO_URI_DEV, {
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