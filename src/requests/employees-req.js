/*
This allows us to create an employee document.
    Pass in a json object with a email and isManager field to ensure it works.
*/
export async function saveEmployee (obj) {
    let data;
    await fetch('http://localhost:8080/employee/create', {
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

export async function getEmployee (obj) {
    let data;
    await fetch('http://localhost:8080/employee/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => data = res.json())
    .catch(err => console.log(err));   
    return data;
}