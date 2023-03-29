import { hookstate } from '@hookstate/core'; 

export const orderState = hookstate({
    order: [],
    isOpen: false,
    employeeId: '',
    tillId: ''
});