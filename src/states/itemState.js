import { hookstate } from '@hookstate/core'; 

export const itemState = hookstate({
    items: [],
    editItem: {},
    card: {},
    isEdit: false,
    isAdd: false,
});