/*
Create a tab document.
    Ex:
    let tab = {
        tillId: ObjectId
        name: 'Fredericton',
        color: 'red,
        cards: [ObjectId],
    };
*/
export async function createTab (obj) {
    let data;
    await fetch('https://localhost:8080/tab/create', {
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
Get a Till from its name
*/
export async function getTab (obj) {
    let data;
    await fetch('https://localhost:8080/tab/get', {
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
modify a Tab's cards
*/
export async function addCards (obj) {
    let data;
    await fetch('https://localhost:8080/tab/cards', {
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
modify a Tab's color
*/
export async function changeColor (obj) {
    let data;
    await fetch('https://localhost:8080/tab/color', {
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