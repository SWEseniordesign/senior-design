import { hookstate } from '@hookstate/core'; 

export const userState = hookstate({
    token: '',
    isLoggedIn: false
});