import { IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
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
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: 'calc(100vh - 75px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    actions: {
        width: '100%',
        borderBottom: '2px solid black',
    },
    action_buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        textAlign: 'center',
    },
    tabbar: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        marginTop: '12px',
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
    
}))

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
                    <Grid2 container spacing={2} sx={{width: '95%', border: '1px solid black', padding: '24px 8px 12px 24px'}}>
                        <Grid2 container className={classes.actions}>
                            <Grid2 xs={12} lg={4}>
                                {!isLoadingTill ? <Typography sx={{
                                fontSize: '24px'
                                }}>{till?.formattedTill?.name}</Typography> : 
                                <Skeleton className={classes.loader} variant={'rectangle'} />}
                            </Grid2>
                            <Grid2 container xs={12} lg={8} className={classes.action_buttons}>
                                <Grid2 xs={12} md={4} lg={3.5} xl={3}><MtButton label={'Manage Employees'} variant={'outlined'} /></Grid2>
                                <Grid2 xs={12} md={4.5} lg={4.7} xl={4}><MtButton label={'View Transactions History'} variant={'outlined'} /></Grid2>
                                <Grid2 xs={12} md={2} lg={2} xl={2}><MtButton label={'Edit Till'} variant={'outlined'} /></Grid2>
                                <Grid2 xs={12} md={1.5} lg={1.5} xl={1}><MtButton label={'SAVE'} variant={'contained'} /></Grid2>
                            </Grid2>
                        </Grid2>
                        <Grid2 xs={12} lg={12}>
                            {!!(till) ? 
                                <div className={classes.tabbar}>
                                    <MTTabs till={till} openEditModal={openEditModel} setOpenEditModal={setOpenEditModal} isLoadingTill={isLoadingTill} isEdit={isEdit} />
                                    <Tooltip title={"List of Tabs"} arrow>
                                        <IconButton size="large" sx={{borderRadius: 0, borderBottom: '1px solid black'}} onClick={() => setOpenEditModal((editModal) => !editModal)}>
                                            <SettingsIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                :
                                <div className={classes.noTillErrorMessage}>
                                    <Typography variant="h4">Problem loading till</Typography>
                                    <Typography variant="subtitle">Either the user is not logged in or perhaps the till does not exist.</Typography>
                                </div>
                            }
                        </Grid2>
                    </Grid2>
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