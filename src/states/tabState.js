import { hookstate } from '@hookstate/core'; 

export const tabState = hookstate({
    tabs: [{id: 0, label: 'OVERVIEW'}, {id: -1, label: '+', canAdd: true}],
    getTabs: () => {}
});