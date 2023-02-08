import { IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import MtButton from "../../components/mui/MTButton";
import { MTTabs } from "../../components/mui/MTTabs";
import SettingsIcon from '@mui/icons-material/Settings';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: 'calc(100vh - 75px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    actions: {
        width: '95%',
        height: '60px',
        borderBottom: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px',
        justifyContent: 'space-between'
    },
    action_buttons: {
        display: 'flex',
        gap: '24px'
    },
    tabbar: {
        width: '95%',
        display: 'flex',
        alignItems: 'flex-start',
        // border: '2px solid black'
    }
})

export const ViewEditTill = () => {

    const [isEdit, setIsEdit] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditModel, setOpenEditModal] = useState(false);
    const [tabs, setTabs] = useState([{id: 0, label: 'OVERVIEW'}, {id: -1, label: '+', canAdd: true}]);

    

    const classes = useStyles();

    return (
        <div>
            {isEdit ? 
            <div className={classes.root}>
                <div className={classes.actions}>
                    <Typography sx={{
                        fontSize: '24px'
                    }}>Actions</Typography>
                    <div className={classes.action_buttons}>
                        <MtButton label={'Manage Employees'} variant={'outlined'} />
                        <MtButton label={'View Transactions History'} variant={'outlined'} />
                        <MtButton label={'Edit Till'} variant={'outlined'} />
                        <MtButton label={'SAVE'} variant={'contained'} />
                    </div>
                </div>
                <div className={classes.tabbar}>
                    <MTTabs tabs={tabs} addTabsFunc={setTabs} openEditModal={openEditModel} setOpenEditModal={setOpenEditModal}><Typography>Yo</Typography></MTTabs>
                    <IconButton size="small" onClick={() => setOpenEditModal((editModal) => !editModal)}>
                        <SettingsIcon fontSize="medium" />
                    </IconButton>
                </div>
            </div>
            :
            <div>

            </div>    
        }
        </div>
    )
}