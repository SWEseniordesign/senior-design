import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { tabState } from "../../states/tabState";
import { ListTabsModel } from "../till/ListTabsModel";
import { AddTabModal } from "../till/AddTabModal";


const useStyle = makeStyles({
    root: {
        width: '100%',
    },
    tabBar: {
        width: 'inherit',
        borderBottom: '1px solid black',
    },
    addTab: {

    },
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
    }
})

export const MTTabs = (props) => {

    const {openEditModal, setOpenEditModal, children} = props;

    const [value, setValue] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);

    const tabChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    }

    const addTabStyle = {
        fontSize: '16px',
        bgcolor: 'lightgrey',
        opacity: '0.5'
    }


    const classes = useStyle();

    return (
        <div className={classes.root}>
            <TabContext value={value}>
                <div className={classes.tabBar}>
                    <TabList onChange={tabChange}>
                        {tabState.tabs.get().map((tab) => {
                            if(tab.label === '+'){
                                return <Tab 
                                        sx={addTabStyle}
                                        key={tab.id} 
                                        value={tab.id}
                                        onClick={handleOpenAddModal}
                                        label={tab.label} />
                            } else {
                                return <Tab 
                                        sx={{fontSize: '16px', bgcolor: !!(tab.color) ? tab.color : ''}}
                                        key={tab.id} 
                                        value={tab.id}
                                        label={tab.label} />
                            }   
                        })}
                    </TabList>
                </div>
                <TabPanel value={value} index={value}>{children}</TabPanel>
            </TabContext>
            {openAddModal && <AddTabModal open={openAddModal} setOpen={setOpenAddModal} />}
            {openEditModal && <ListTabsModel open={openEditModal} setOpen={setOpenEditModal} />}
        </div>
    )
}