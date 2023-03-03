import { getUserBusiness } from "../../requests/users-req";
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

export const checkUserForBusiness = async (nav) => {

    const business = await getUserBusiness();

    if(business){
        nav(-1);
    } else {
        return true;
    }
}