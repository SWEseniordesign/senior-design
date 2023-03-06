import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import MtButton from "../../components/mui/MTButton";
import { MTTabs } from "../../components/mui/MTTabs";
import SettingsIcon from '@mui/icons-material/Settings';
import { Responsive, WidthProvider } from "react-grid-layout";
import { AddItemModal } from "../../components/till/AddItemModal";
import { AddCardModal } from "../../components/till/AddCardModal";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './ViewEditTill.css'
import { COLOR_PALETTE } from "../../Constants";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTill } from "../../requests/tills-req";
import { getAllTabs, getTab } from "../../requests/tabs-req";
import { getCard } from "../../requests/cards-req";
import { tabState } from "../../states/tabState";
import { none, useHookstate } from "@hookstate/core";

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
    layout: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        border: '1px solid lightgrey',
        height: '100%'
    },
    cardTitleBar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid grey',
        gap: '12px',
        height: '100%',
    },
    grid: {
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'auto auto auto',
        padding: '12px',

        height: '100%', 
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar':{
            width:0,
        }
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '7vh',
        height: '100%',
        border: '1px solid lightgrey',
        borderRadius: '5px'
    },
    dragDots: {
        height: '2px',
        width: '2px',
        backgroundColor: COLOR_PALETTE.NAVY_BLUE,
        opacity: 0.4,
    },
    addCard: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    loader: {
        width: '100%',
        height: '100%'
    }
    
})


// Can be removed once the backend call is created/called
const c = [
    {id: 0, label: 'Test1', dimensions: {x: 0, y: 0, w: 1, h: 2} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false},
    {id: 1, label: "Test2", dimensions: {x: 1, y: 0, w: 1, h: 2} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false},
    {id: 2, label: "Test3", dimensions: {x: 2, y: 0, w: 1, h: 1} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false}
]

export const ViewEditTill = () => {

    const params = useParams();
    const location = useLocation();

    const [isEdit, setIsEdit] = useState(location.pathname.includes('edit'));
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditModel, setOpenEditModal] = useState(false);
    const {isLoading: tillDataIsLoading, data: till} = useQuery("tills", () => getTill({id: params.id}));

    const classes = useStyles();

    return (
        <div>
            {isEdit ? 
                //? The following JSX is for when the till is being edited. (In edit mode)
                <div className={classes.root}>
                    <div className={classes.actions}>
                        <Typography sx={{
                            fontSize: '24px'
                        }}>{till?.formattedTill.name}</Typography>
                        <div className={classes.action_buttons}>
                            <MtButton label={'Manage Employees'} variant={'outlined'} />
                            <MtButton label={'View Transactions History'} variant={'outlined'} />
                            <MtButton label={'Edit Till'} variant={'outlined'} />
                            <MtButton label={'SAVE'} variant={'contained'} />
                        </div>
                    </div>
                    <div className={classes.tabbar}>
                        <MTTabs till={till} openEditModal={openEditModel} setOpenEditModal={setOpenEditModal} tillDataIsLoading={tillDataIsLoading} />
                        <IconButton size="small" onClick={() => setOpenEditModal((editModal) => !editModal)}>
                            <SettingsIcon fontSize="medium" />
                        </IconButton>
                    </div>
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
                    <MTTabs openEditModal={openEditModel} setOpenEditModal={setOpenEditModal}/>
                </div>
            </div>
        }
        </div>
    )
}