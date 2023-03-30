import { useHookstate } from "@hookstate/core";
import { Modal, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { COLOR_PALETTE } from "../../Constants";
import { tabState } from "../../states/tabState";
import { MTTable } from "../mui/MTTable";

const useStyles = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '48px 12px 48px 12px'
    },
    title: {
        display: 'flex',
        width: '90%',
        marginBottom: '12px',
        borderBottom: '1px solid lightgrey'
    }
})

//* The modal that pops up when the user wants to view the list of tabs.
export const ListTabsModel = (props) => {

    const {deleteTabFunc} = props;

    const localTabState = useHookstate(tabState);

    //* Handles closing the modal
    const handleCloseModal = () => {
        localTabState.isListOfTabs.set(false);
    }

    //* Table columns for the list of tabs
    const tableColumns = [
        {id: 0, dataPropId: 'name', label: 'Name', width: '100%'},
        {id: 1, dataPropId: 'color', label: 'Color', width: '100%'}
    ]

    const classes = useStyles();

    return (
        <Modal
            open={localTabState.isListOfTabs.get()}
            onClose={handleCloseModal}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                <div className={classes.title}>
                    <Typography variant={'h4'}>List of Tabs</Typography>
                </div>
                <MTTable columns={tableColumns} rows={tabState.tabs.get()} hasPagination actionStyle={'dropdown'} action={deleteTabFunc} />
            </Paper>
        </Modal>
    )
}