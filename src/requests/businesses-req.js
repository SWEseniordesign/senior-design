/*
Create a business document.
    Pass in a json object with a email and isManager field, and the other two fields can be
    empty as shown below. name is unique.
    let business = {
        name: 'McDonalds',
        ownerId: '6377f3e996d92774ba4dcce8',
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