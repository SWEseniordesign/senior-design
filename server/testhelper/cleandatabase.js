const User = require('../models/User');
const Business = require('../models/Business');
const Card = require('../models/Card');
const Employee = require('../models/Employee');
const Item = require('../models/Item');
const Tab = require('../models/Tab');
const Till = require('../models/Till');


/**
 * ! Note: This is only setup to run in test which may be changed in the future
 * Deletes all data in connected database
 *
 * @success Deletion of test complete
 * @error Error deleting...
 */
async function cleanDatabase(){
    if(process.env.npm_lifecycle_event === 'test'){
        await User.deleteMany({}).catch( err => {return {err: 'Error deleting Users'}});
        await Business.deleteMany({}).catch( err => {return {err: 'Error deleting Businesses'}});
        await Card.deleteMany({}).exec().catch( err => {return {err: 'Error deleting Cards'}});
        await Employee.deleteMany({}).exec().catch( err => {return {err: 'Error deleting Employee'}});
        await Item.deleteMany({}).exec().catch( err => {return {err: 'Error deleting Items'}});
        await Tab.deleteMany({}).exec().catch( err => {return {err: 'Error deleting Tabs'}});
        await Till.deleteMany({}).exec().catch( err => {return {err: 'Error deleting Tills'}});
        return {err: 'Deletion of test complete'}
    }
    else {
        return {err: 'DONT RUN THIS IN DEV OR MYTILL!!!!'}
    }
}
module.exports = cleanDatabase;