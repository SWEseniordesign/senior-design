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
export async function createTab (obj) {
    let data;
    await fetch('http://localhost:8080/tab/create', {
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
    await fetch('http://localhost:8080/tab/get', {
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
    await fetch('http://localhost:8080/tab/cards', {
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
    await fetch('http://localhost:8080/tab/color', {
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