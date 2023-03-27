import { hookstate } from '@hookstate/core'; 

export const cardState = hookstate({
    cards: [],
    editCard: {},
    isEdit: false,
    isAdd: false,
});