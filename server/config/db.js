const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to Database...');
        console.log(`Script ran: ${process.env.npm_lifecycle_event}`);
        if(process.env.npm_lifecycle_event === 'dev'){
            const conn = await mongoose.connect(process.env.MONGO_URI_TEST, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            });
            console.log('DB: test');
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        else {
            const conn = await mongoose.connect(process.env.MONGO_URI_MYTILL, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            });
            console.log('DB: myTill');
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
        
        //console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;