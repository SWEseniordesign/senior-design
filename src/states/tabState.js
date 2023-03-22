import { hookstate, none } from '@hookstate/core'; 

export const tabState = hookstate({
    tabs: [],
    activeTab: {},
    isEdit: false,
    isAdd: false,
    isListOfTabs: false
});