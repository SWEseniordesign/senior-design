let testUser = {
    fname: 'Test',
    lname: 'User',
    email: 'run_test@gmail.com',
    password: 'peanut_butter_baby',
    businessId: null
};

let testUser1 = {
    fname: 'Test',
    lname: 'User',
    email: 'run_test1@gmail.com',
    password: 'peanut_butter_baby',
    businessId: null
};

let testUserBusId = {
    fname: 'Test',
    lname: 'User',
    email: 'run_test3@gmail.com',
    password: 'peanut_butter_baby',
    businessId: '63d2b33a2a75670dbd74fb3b'
};

let testBusiness = {
    name: 'Walmart',
    type: 'Wholesale',
    admins: [],
    tills: []
};

let testTill = {
    name: 'Sandwiches',
    managerPassword: 123,
    employees: [],
    tabs: [],
    props: [],
    businessId: ''
};

let testTab = {
    name: 'Sandwiches',
    managerPassword: 123,
    employees: [],
    tabs: [],
    props: [],
    tillId: ''
};

let testCard = {
    name: 'Burgers',
    color: 'red',
    dimensions: {x: null, y: null, width: null, height: null},
    items: [],
    tabId: ''
};

 const fakeObjectIdType1 = 'yo';
 const fakeObjectIdType2 = 'yoyoyoyoyoyo';
 const fakeObjectId = '63d2b33a2a75670dbd74fb3b';

module.exports = {
    testUser,
    testUser1,
    testUserBusId,
    testBusiness,
    testTill,
    testTab,
    testCard,
    fakeObjectIdType1,
    fakeObjectIdType2,
    fakeObjectId
};