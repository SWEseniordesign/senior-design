import { userState } from "../states/userState";

/*
Create a card document.
    Pass in a json object with a name, and the other three fields can be
    empty as shown below. name is unique.
    let card = {
        name: 'Burgers',
        color: 'blue,
        dimensions: {},
        items: []
    };
*/
export async function createCard (obj) {
    let data;
    await fetch('http://localhost:8080/card/create', {
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
Get a card from its name
*/
export async function getCard (obj) {
    let data;
    await fetch('http://localhost:8080/card/get', {
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
Get all cards and items within them from tabId
*/
export async function getAllCards (obj) {
    let data;
    await fetch('http://localhost:8080/card/getall', {
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
modify a card's dimensions
*/
export async function modifyCardPosition (obj) {
    let data;
    await fetch('http://localhost:8080/card/modifyposition', {
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
Delet a card and it's items
*/
export async function deleteCard (obj) {
    let data;
    await fetch('http://localhost:8080/card/delete', {
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
modify a card's color
*/
export async function changeColor (obj) {
    let data;
    await fetch('http://localhost:8080/card/color', {
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
modify a card's items
*/
export async function changeItems (obj) {
    let data;
    await fetch('http://localhost:8080/card/items', {
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