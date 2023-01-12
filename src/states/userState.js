import React from 'react';
import { hookstate } from '@hookstate/core'; 

export const userState = hookstate({
    user: {},
    isLoggedIn: false
});