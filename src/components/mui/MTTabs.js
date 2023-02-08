import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Modal, Paper, Tab, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import { ListTabsModel } from "../ListTabsModel";
import { AddTabModal } from "../AddTabModal";
import MtButton from "./MTButton";
import { MTModal } from "./MTModal";
import MTTextField from "./MTTextField";

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

    const {tabs, addTabsFunc, openEditModal, setOpenEditModal, children} = props;

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
                        {tabs.map((tab) => {
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
            <AddTabModal tabs={tabs} setTabsFunction={addTabsFunc} open={openAddModal} setOpen={setOpenAddModal} />
            <ListTabsModel tabList={tabs} setTabsList={addTabsFunc} open={openEditModal} setOpen={setOpenEditModal} />
        </div>
    )
}