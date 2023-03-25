import { userState } from "../states/userState";

/*
    Creates a new user
*/
export async function saveUser (obj) {
    let data;
    await fetch('http://localhost:8080/user/register', {
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
    Should allow us to log in a user (doesn't really do that rn Jan12)
*/
export async function login (obj) {
    let data;
    await fetch('https://mytill.netlify.app/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => console.log(res.json()))
    .catch(err => console.log(err));
    return data;
}

/*
    Should allow us to log in a user (doesn't really do that rn Jan12)
*/
export async function getUserBusiness (obj) {
    let data;
    await fetch('http://localhost:8080/user/business', {
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
    REVIEW? Gets a user's first and last name
*/
export async function getUserName (obj) {
    let data;
    await fetch('http://localhost:8080/user/name', {
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
    TODO
    Allows us to update a users password
*/
export async function updatePassword(obj){
    let data;
    await fetch('http://localhost:8080/user/', {
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