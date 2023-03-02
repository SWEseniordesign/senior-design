import { userState } from "../../states/userState";

export const checkLoggedInStatus_Redirect = (nav) => {
    if(userState.token.get() !== ''){
        return true
    } 
    nav(-1);
}

export const isLoggedIn_Redirect = (nav) => {
    if(userState.token.get() === ''){
        return true
    } 
    nav('/');
}