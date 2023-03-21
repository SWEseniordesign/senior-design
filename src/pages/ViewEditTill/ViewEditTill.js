import { IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import MtButton from "../../components/mui/MTButton";
import { MTTabs } from "../../components/mui/MTTabs";
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import CartDrawer from "../../components/drawer/CartDrawer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTill } from "../../requests/tills-req";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useHookstate } from "@hookstate/core";
import { tabState } from "../../states/tabState";
import { ViewTransactionModal } from "../../components/till/ViewTransactionModal";

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
        width: '95%',
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
    },
}))

export const ViewEditTill = () => {

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [isEdit, setIsEdit] = useState(location.pathname.includes('edit'));
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);

    const localTabState = useHookstate(tabState);

    const {isLoading: isLoadingTill, data: till} = useQuery("tills", () => getTill({id: params.id}), { refetchOnWindowFocus: false });

    const handleEditTill = () => {
        setIsEdit(true);
        navigate(location.pathname.replace('view', 'edit'));
    }

    const handleViewTill = () => {
        setIsEdit(false);
        navigate(`${location.pathname.replace('edit', 'view')}`);
    }

    const classes = useStyles();

    return (
        <div>
            {isEdit ? 
                //? The following JSX is for when the till is being edited. (In edit mode)
                <div className={classes.root}>
                    <Grid2 container spacing={2} sx={{width: '95%', padding: '24px 8px 12px 24px'}}>
                        <Grid2 container className={classes.actions}>
                            <Grid2 xs={12} lg={4}>
                                {!isLoadingTill ? <Typography sx={{
                                fontSize: '24px'
                                }}>{till?.formattedTill?.name}</Typography> :
                                <Skeleton className={classes.loader} variant={'rectangle'} />}
                            </Grid2>
                            <Grid2 container xs={12} lg={8} className={classes.action_buttons}>
                                <Grid2 xs={12} md={5} lg={3.5} xl={3}><MtButton makeResponsive label={'Manage Employees'} variant={'outlined'} /></Grid2>
                                <Grid2 xs={12} md={5} lg={4.7} xl={4}>
                                    {!isLoadingTill ? 
                                        <MtButton makeResponsive label={'View Transactions History'} variant={'outlined'} onClick={() => setTransactionModalOpen(true)} /> : 
                                        <Skeleton className={classes.loader} variant={'rectangle'} />
                                }</Grid2>
                                <Grid2 xs={12} md={2} lg={2} xl={2}><MtButton makeResponsive label={'View Till'} variant={'outlined'} onClick={handleViewTill} /></Grid2>
                                {/* <Grid2 xs={12} md={1.5} lg={1.5} xl={1}><MtButton makeResponsive label={'SAVE'} variant={'contained'} /></Grid2> */}
                            </Grid2>
                        </Grid2>
                        <Grid2 xs={12} lg={12}>
                            {!!(till) ?
                                <div className={classes.tabbar}>
                                    <MTTabs till={till} isLoadingTill={isLoadingTill} isEdit={isEdit} />
                                    <Tooltip title={"List of Tabs"} arrow>
                                        <IconButton size="large" sx={{borderRadius: 0, borderBottom: '1px solid black'}} onClick={() => localTabState.isListOfTabs.set(true)}>
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
                    {transactionModalOpen && <ViewTransactionModal open={transactionModalOpen} setOpen={setTransactionModalOpen} tillId={till.formattedTill.id} />}
                </div>
            :
            //? The following JSX is for when the till is being viewed as a employee. (Not in edit mode)
            <div className={classes.root}>
                    <Grid2 container spacing={2} sx={{width: '95%', padding: '24px 8px 12px 24px'}}>
                        <Grid2 container className={classes.actions}>
                            <Grid2 xs={12} lg={4}>
                                {!isLoadingTill ? <Typography sx={{
                                fontSize: '24px'
                                }}>{till?.formattedTill?.name}</Typography> :
                                <Skeleton className={classes.loader} variant={'rectangle'} />}
                            </Grid2>
                            <Grid2 container xs={12} lg={8} className={classes.action_buttons}>
                                <Grid2 xs={12} md={6} lg={4.7} xl={4}><MtButton makeResponsive label={'View Transactions History'} variant={'outlined'} /></Grid2>
                                <Grid2 xs={12} md={6} lg={2} xl={2}><MtButton makeResponsive label={'Edit Till'} variant={'outlined'} onClick={handleEditTill} /></Grid2>
                                <Grid2 xs={12} md={6} lg={2} xl={2}>
                                    <IconButton onClick={() => setCartDrawerOpen(!cartDrawerOpen)}>
                                        <ShoppingCartIcon fontSize="medium" />
                                    </IconButton>
                                    <CartDrawer openDrawer={cartDrawerOpen} setOpenDrawer={setCartDrawerOpen} />
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        <Grid2 xs={12} lg={12}>
                            {!!(till) ?
                                <div className={classes.tabbar}>
                                    <MTTabs till={till} isLoadingTill={isLoadingTill} isEdit={isEdit} />
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
        }
        </div>
    )
}