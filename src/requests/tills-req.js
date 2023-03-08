import { userState } from "../states/userState";

/*
Create a till document.
    Pass in a json object with a name and managerPassword field, and the other three fields can be
    empty as shown below. name is unique.
    let till = {
        name: 'Fredericton',
        managerPassword: 69420,
        employees: [],
        tabs: [],
        props: []
    };
*/
export async function createTill (obj) {
    let data;
    await fetch('http://localhost:8080/till/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => {return err;});   
    return data;
}

/*
Get a Till from its name
*/
export async function getTill (obj) {
    let data;
    await fetch('http://localhost:8080/till/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
Get all tills for a business
*/
export async function getAllTills (obj) {
    let data;
    await fetch('http://localhost:8080/till/getall', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
Add a Employee to a Till
*/
export async function addEmployee (obj) {
    let data;
    await fetch('http://localhost:8080/till/addemployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
modify a Till's tabs
*/
export async function addTabs (obj) {
    let data;
    await fetch('http://localhost:8080/till/tabs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

/*
modify a Till's props
*/
export async function addProps (obj) {
    let data;
    await fetch('http://localhost:8080/till/props', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}

export async function authTill (obj) {
    let data;
    await fetch('http://localhost:8080/till/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': userState.token.get()
        },
        body: JSON.stringify(obj)
    })
   .then(res => data = res.json())
   .catch(err => console.log(err));
   return data;
}