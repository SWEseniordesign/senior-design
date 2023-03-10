import React from 'react';
import { hookstate } from '@hookstate/core'; 
import { localstored } from '@hookstate/localstored';

export const userState = hookstate({
    token: '',
    tillId: '',
}, localstored({ key: 'state-key' }));