import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Popover, Tab, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
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
    popover: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: '12px'
    }
})

export const MTTabs = (props) => {

    const {tabs, addTabsFunc} = props;

    const [value, setValue] = useState('OVERVIEW');
    const [anchorEl, setAnchorEl] = useState(null);
    const [modifiedTab, setModifiedTab] = useState({});
    const [popoverTextField, setPopoverTextField] = useState('');

    const handlePopoverClick = (event) => {
        let clickedTabTitle = event.target.innerText;
        setModifiedTab(tabs.find(({label}) => label === clickedTabTitle));
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const tabChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleAddTab = (e) => {
        let plusTab = tabs.slice(-1);
        let newList = tabs.filter((tab) => tab.id !== -1);

        newList = newList.concat({id: newList[newList.length - 1].id + 1, label: `NEW TAB (${newList[newList.length - 1].id + 1})`});
        newList = newList.concat(plusTab);
        addTabsFunc(newList);
    }

    const handleTabChanges = () => {
        console.log(modifiedTab)
        let modified = tabs.map((tab) => {
            if(tab.label === modifiedTab.label){
                return {...tabs, label: popoverTextField};
            } else {
                return tab;
            }
        })
        addTabsFunc(modified);
    }

    const addTabStyle = {
        fontSize: '16px',
        bgcolor: 'lightgrey',
        opacity: '0.5'
    }

    console.log(tabs)

    const classes = useStyle();
    const open = Boolean(anchorEl);

    return (
        <div className={classes.root}>
            <TabContext value={value}>
                <div className={classes.tabBar}>
                    <TabList
                        onChange={tabChange}
                    >
                        {tabs.map((tab) => {
                            if(tab.label === '+'){
                                return <Tab 
                                        sx={addTabStyle}
                                        key={tab.id} 
                                        onClick={(e) => handleAddTab(e)}
                                        value={tab.label} 
                                        label={tab.label} />
                            } else {
                                return <div>
                                            <Tab 
                                                sx={{fontSize: '16px', bgcolor: !!(tab.color) ? tab.color : ''}}
                                                key={tab.id} 
                                                value={tab.label} 
                                                onClick={(e) => handlePopoverClick(e)}
                                                label={tab.label} />
                                                <Popover
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handlePopoverClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    PaperProps={{
                                                        style: { 
                                                            width: '30%',
                                                            height: '20%',

                                                        },
                                                      }}
                                                >
                                                    <div className={classes.popover}>
                                                        <MTTextField label={'New Tab Name'} value={popoverTextField} onChangeFunc={setPopoverTextField} />
                                                        <MtButton label={'SAVE'} variant={'contained'} onClick={() => handleTabChanges()} />
                                                    </div>
                                                </Popover>
                                        </div>
                            }   
                            
                        })}
                    </TabList>
                </div>
                {tabs.map((tab) => {
                    if(tab.label === '+'){
                        return <TabPanel value={'+'}></TabPanel>

                    } else {
                        return <TabPanel value={tab.label}>{tab.label}</TabPanel>
                    }   
                    
                })}
            </TabContext>
        </div>
    )

}