import { getUserBusiness } from "../../requests/users-req";
import { pageState } from "../../states/pageState";
import { userState } from "../../states/userState";

export const checkLoggedInStatus_Redirect = (nav) => {
    if(userState.token.get() !== ''){
        return true
    } 
    pageState.hasBeenRedirected.set(true);
    pageState.reasonForRedirect.set('Access denied. User not logged in.');
    nav('/');
}

export const isLoggedIn_Redirect = (nav) => {
    if(userState.token.get() === ''){
        return true
    } 
    pageState.hasBeenRedirected.set(true);
    pageState.reasonForRedirect.set('User already logged in.');
    nav('/');
}

export const createAccount_Redirect = (nav) => {
    if(userState.token.get() === ''){
        return true
    } 
    pageState.hasBeenRedirected.set(true);
    pageState.reasonForRedirect.set('Cannot create an account while logged in.');
    nav('/');
}

export const checkUserForBusiness = async (nav) => {

    const businessRes = await getUserBusiness();

    if(businessRes.business){
        pageState.hasBeenRedirected.set(true);
        pageState.reasonForRedirect.set('Already have a business. Cannot create multiple businesses.');
        nav('/');
    } else if(businessRes.code === 401){
        pageState.hasBeenRedirected.set(true);
        pageState.reasonForRedirect.set('Access denied. User not logged in.');
        nav('/');
    } else if(!businessRes.business){
        return true;
    }
}