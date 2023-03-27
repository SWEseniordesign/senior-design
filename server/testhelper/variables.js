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
    name: 'We Da Best Food',
    type: 'Quick Service',
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
    name: 'Fredericton North',
    managerPassword: 123,
    employees: [],
    tabs: [],
    props: [],
    businessId: '',
    transactions: []
};
    let testTabPizza = {
        name: 'Pizza',
        color: '',
        cards: []
    };
        let testCardClassicPizza = {
            name: 'Classic',
            color: 'yellow',
            dimensions: {x: 0, y: 0, width: 1, height: 1},
            items: [],
            static: false,
            tabId: ''
        };
            let testItem1CP = {
                name: 'Pepperoni',
                price: 19.99,
                image: '',
                props: [],
                stock: 45
            };

            let testItem2CP = {
                name: 'Meat Lover\'s',
                price: 20.99,
                image: '',
                props: [],
                stock: 37
            };
        let testCardSpecialityPizza = {
            name: 'Speciality',
            color: 'pink',
            dimensions: {x: 1, y: 1, width: 2, height: 1},
            items: [],
            static: true,
            tabId: ''
        };
            let testItem1SP = {
                name: 'Smokey Maple Bacon',
                price: 24.99,
                image: '',
                props: [],
                stock: 45
            };
            let testItem2SP = {
                name: 'Margherita',
                price: 24.99,
                image: '',
                props: [],
                stock: 69
            };

    let testTabSandwiches = {
        name: 'Sandwiches',
        color: '',
        cards: []
    };
        let testCardBurgers = {
            name: 'Burgers',
            color: 'red',
            dimensions: {x: 0, y: 0, width: 1, height: 1},
            items: [],
            static: false,
            tabId: ''
        };
            let testItem1B = {
                name: 'BigMac',
                price: 69.09,
                image: '',
                props: [],
                stock: 4
            };

            let testItem2B = {
                name: 'Baconator',
                price: 15.00,
                image: '',
                props: [],
                stock: 100
            };
        let testCardClassicSand = {
            name: 'Classic',
            color: 'blue',
            dimensions: {x: 1, y: 1, width: 2, height: 1},
            items: [],
            static: true,
            tabId: ''
        };
            let testItem1C = {
                name: 'Club Sandwich',
                price: 69.09,
                image: '',
                props: [],
                stock: 4
            };
            let testItem2C = {
                name: 'Crispy Chicken Sandwich',
                price: 15.00,
                image: '',
                props: [],
                stock: 100
            };


let testTill2 = {
    name: 'Fredericton South(No Tabs/cards/items)',
    managerPassword: 123,
    employees: [],
    tabs: [],
    props: [],
    businessId: '',
    transactions: []
};

let testEmployee = {
    email: 'test@test.ca',
    isManager: true
};

let testEmployee2 = {
    email: 'john@test.ca',
    isManager: false
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
    static: true,
    tabId: ''
};

let testItem = {
    name: 'BigMac',
    price: 69.09,
    image: '',
    props: [],
    stock: 4
};

let testTransaction = {
    employeeId: '',
    price: 69,
    tillId: '',
    items: []
}

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
    testTabPizza,
    testCardClassicPizza,
    testItem1CP,
    testItem2CP,
    testCardSpecialityPizza,
    testItem1SP,
    testItem2SP,
    testTabSandwiches,
    testCardBurgers,
    testItem1B,
    testItem2B,
    testCardClassicSand,
    testItem1C,
    testItem2C,
    testEmployee,
    testEmployee2,
    testTab,
    testCard,
    testItem,
    fakeObjectIdType1,
    fakeObjectIdType2,
    fakeObjectId,
    testTransaction
};