import { userState } from "../states/userState";

/*
Create an employee document.
    Pass in a json object with a email and isManager field.
*/
export async function createEmployee (obj) {
    let data;
    await fetch('http://localhost:8080/employee/create', {
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
Get an employee
*/
export async function getEmployee (obj) {
    let data;
    await fetch('http://localhost:8080/employee/get', {
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
