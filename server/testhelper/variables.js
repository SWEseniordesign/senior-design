let testUser = {
    fname: 'Test',
    lname: 'User',
    email: 'test@gmail.com',
    password: '123',
    businessId: null
};

let testUser1 = {
    fname: 'Test',
    lname: 'User',
    email: 'test1@gmail.com',
    password: '123',
    businessId: null
};

let testUser2 = {
    fname: 'Test',
    lname: 'User',
    email: 'test2@gmail.com',
    password: '123',
    businessId: null
};

let testUser3 = {
    fname: 'Test',
    lname: 'User',
    email: 'test3@gmail.com',
    password: '123',
    businessId: null
};

let testUserBusId = {
    fname: 'Test',
    lname: 'User',
    email: 'run_test3@gmail.com',
    password: '123',
    businessId: '63d2b33a2a75670dbd74fb3b'
};

let testBusiness = {
    name: 'Test Business 1',
    type: 'Wholesale',
    admins: [],
    tills: []
};

let testBusiness2 = {
    name: 'Test Business 2',
    type: 'Wholesale',
    admins: [],
    tills: []
};

let testBusinessType1 = {
    name: 'Test Business: Type 1',
    type: 'Wholesale',
    admins: [],
    tills: ['1f213']
};

let testBusinessType2 = {
    name: 'Test Business: Type 2',
    type: 'Wholesale',
    admins: [],
    tills: ['yoyoyoyoyoyo']
};

let testTill = {
    name: 'Test Location 1',
    managerPassword: 123,
    employees: [],
    tabs: [],
    props: [],
    businessId: ''
};

let testTill2 = {
    name: '123 @ Test Street',
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

let testItem = {
    name: 'BigMac',
    price: 69.09,
    image: '',
    props: [],
    stock: 4
};

let testEmployee = {
    email: 'test@test.ca',
    isManager: true
};

 const fakeObjectIdType1 = 'yo';
 const fakeObjectIdType2 = 'yoyoyoyoyoyo';
 const fakeObjectId = '63d2b33a2a75670dbd74fb3b';

module.exports = {
    testUser,
    testUser1,
    testUser2,
    testUser3,
    testUserBusId,
    testBusiness,
    testBusiness2,
    testBusinessType1,
    testBusinessType2,
    testTill,
    testTill2,
    testTab,
    testCard,
    testItem,
    testEmployee,
    fakeObjectIdType1,
    fakeObjectIdType2,
    fakeObjectId
};