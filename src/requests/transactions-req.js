import { userState } from "../states/userState";

/*
    Creates a transaction
*/
export async function createTransaction(obj) {
    let data;
    await fetch('http://localhost:8080/transaction/create', {
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