/*
Create a business document.
    Pass in a json object with a email and isManager field, and the other two fields can be
    empty as shown below. name is unique. type should be Wholesale or Quickservice an is required.
    let business = {
        name: 'McDonalds',
        ownerId: '6377f3e996d92774ba4dcce8',
        type: 'Wholesale',
        admins: [],
        tills: []
    };
*/
export async function createBusiness (obj) {
    let data;
    await fetch('http://localhost:8080/business/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => {return err;});   
    return data;
}

/*
Get a business from its name
    Pass in a json object with a key called name or a object shown in the above comments
*/
export async function getBusiness (obj) {
    let data;
    await fetch('http://localhost:8080/business/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
TODO
Add admins to a business
    Pass in a json object with a key called name or a object shown in the above comments
*/
export async function addAdmins (obj) {
    let data;
    await fetch('http://localhost:8080/business/admins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
TODO
Add tills to a business
    Pass in a json object with a key called name or a object shown in the above comments
*/
export async function addTills (obj) {
    let data;
    await fetch('http://localhost:8080/business/edittills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
TODO
Fetches a businesses' tills
*/
export async function getTills (obj) {
    let data;
    await fetch('http://localhost:8080/business/tills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}