/*
    TODO test
    Creates an item
*/
export async function createItem(obj) {
    let data;
    await fetch('http://localhost:8080/items/create', {
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
    TODO test & change accessing
    Gets a specific item
*/
export async function getItem (obj) {
    let data;
    await fetch('http://localhost:8080/items/get', {
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
    TODO test
    Changes a items name
*/
export async function changeName(obj) {
    let data;
    await fetch('http://localhost:8080/items/', {
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
    TODO test
    Changes a items image
*/
export async function changeImage(obj) {
    let data;
    await fetch('http://localhost:8080/items/', {
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
    TODO test
    Changes a items props
*/
export async function changeProps(obj) {
    let data;
    await fetch('http://localhost:8080/items/', {
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
    TODO test
    Changes a items stock
*/
export async function changeStock(obj) {
    let data;
    await fetch('http://localhost:8080/items/', {
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