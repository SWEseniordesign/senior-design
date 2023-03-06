import { hookstate, none } from '@hookstate/core'; 

export const tabState = hookstate({
    tabs: [{id: 0, name: 'OVERVIEW'}, {id: -1, name: '+', canAdd: true}]
});