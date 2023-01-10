/**
 * Makes requests to the server related to items.
 */

export async function temp () {
    let data;
    await fetch('http://localhost:8080/items/temp')
        .then(res => res.json())
        .then(balls => data = balls)
        .catch(err => console.log(err));   
    return data;
}

// TODO
export async function getItem (name) {
    let data;
    await fetch('http://localhost:8080/getitem', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name})
    })
    .then(res => res.json())
    .then(balls => data = balls)
    .catch(err => console.log(err));   
    return data;
}