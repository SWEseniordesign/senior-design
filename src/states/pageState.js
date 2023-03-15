import { hookstate } from "@hookstate/core";

export const pageState = hookstate({
    previousPage: '',
    hasBeenRedirected: false, 
    reasonForRedirect: ''
});