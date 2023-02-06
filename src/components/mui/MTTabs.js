import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Modal, Paper, Tab, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { EditTabsModel } from "../EditTabsModel";
import MtButton from "./MTButton";
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
        height: '30%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
    }
})

export const MTTabs = (props) => {

    const {tabs, addTabsFunc, openEditModal, setOpenEditModal, children} = props;

    const [value, setValue] = useState(0);
    const [isAddingTab, setIsAddingTab] = useState(false);
    const [newTabName, setNewTabName] = useState('');
    const [newTabColor, setNewTabColor] = useState('#FFFFFF');

    const tabChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleAddTab = (e) => {
        setIsAddingTab(false);
        let plusTab = tabs.slice(-1);
        let newList = tabs.filter((tab) => !tab.canAdd);

        newList = newList.concat({id: newList[newList.length - 1].id + 1, label: newTabName, color: newTabColor.hex});
        newList = newList.concat(plusTab);
        addTabsFunc(newList);
        setNewTabColor('#FFFFFF');
    }

    const handleOpenAddModal = () => {
        setIsAddingTab(true);
    }

    const handleCloseAddModal = () => {
        setIsAddingTab(false);
    }

    const addTabStyle = {
        fontSize: '16px',
        bgcolor: 'lightgrey',
        opacity: '0.5'
    }


    const classes = useStyle();

    console.log(openEditModal)

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
            {/* Need to make a custom component for the MODELs */}
            <Modal
                open={isAddingTab}
                onClose={handleCloseAddModal}
            >
                <Paper className={classes.paper}>
                        <Typography variant="h5">Add Tab</Typography>
                        <MTTextField label={'Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                        <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                        <MtButton label={'ADD'} variant={'contained'} onClick={handleAddTab} />
                </Paper>
            </Modal>
            <EditTabsModel tabList={tabs} open={openEditModal} setOpen={setOpenEditModal} />
        </div>
    )
}