import { IconButton, Skeleton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import MtButton from "../../components/mui/MTButton";
import { MTTabs } from "../../components/mui/MTTabs";
import SettingsIcon from '@mui/icons-material/Settings';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTill } from "../../requests/tills-req";

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
    },
    noTillErrorMessage: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: '10%'
    },
    loader: {
        width: '100%',
        height: '100%'
    }
    
})

export const ViewEditTill = () => {

    const params = useParams();
    const location = useLocation();

    const [isEdit, setIsEdit] = useState(location.pathname.includes('edit'));
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditModel, setOpenEditModal] = useState(false);
    const {isLoading: isLoadingTill, data: till} = useQuery("tills", () => getTill({id: params.id}));

    const classes = useStyles();

    return (
        <div>
            {isEdit ? 
                //? The following JSX is for when the till is being edited. (In edit mode)
                <div className={classes.root}>
                    <div className={classes.actions}>
                        {!isLoadingTill ? <Typography sx={{
                            fontSize: '24px'
                        }}>{till?.formattedTill?.name}</Typography> : 
                        <Skeleton className={classes.loader} variant={'rectangle'} />}
                        <div className={classes.action_buttons}>
                            <MtButton label={'Manage Employees'} variant={'outlined'} />
                            <MtButton label={'View Transactions History'} variant={'outlined'} />
                            <MtButton label={'Edit Till'} variant={'outlined'} />
                            <MtButton label={'SAVE'} variant={'contained'} />
                        </div>
                    </div>
                    {!!(till) ? 
                        <div className={classes.tabbar}>
                            <MTTabs till={till} openEditModal={openEditModel} setOpenEditModal={setOpenEditModal} isLoadingTill={isLoadingTill} isEdit={isEdit} />
                            <IconButton size="small" onClick={() => setOpenEditModal((editModal) => !editModal)}>
                                <SettingsIcon fontSize="medium" />
                            </IconButton>
                        </div>
                        :
                        <div className={classes.noTillErrorMessage}>
                            <Typography variant="h4">Problem loading till</Typography>
                            <Typography variant="subtitle">Either the user is not logged in or perhaps the till does not exist.</Typography>
                        </div>
                    }
                </div>
            :
            //? The following JSX is for when the till is being viewed as a employee. (Not in edit mode)
            <div className={classes.root}>
                <div className={classes.actions}>
                    <Typography sx={{
                        fontSize: '24px'
                    }}>Actions</Typography>
                    <div className={classes.action_buttons}>
                        <MtButton label={'Manage Employees'} variant={'outlined'} />
                        <MtButton label={'View Transactions History'} variant={'outlined'} />
                        <MtButton label={'Edit Till'} variant={'outlined'} />
                    </div>
                </div>
                <div className={classes.tabbar}>
                    <MTTabs till={till} openEditModal={openEditModel} setOpenEditModal={setOpenEditModal}/>
                </div>
            </div>
        }
        </div>
    )
}