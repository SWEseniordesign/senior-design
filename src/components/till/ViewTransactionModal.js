import { useHookstate } from "@hookstate/core";
import { Modal, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useQuery } from "react-query";
import { COLOR_PALETTE } from "../../Constants";
import { getAllTransactions } from "../../requests/tills-req";
import { tabState } from "../../states/tabState";
import { MTTable } from "../mui/MTTable";

const useStyles = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
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
export const ViewTransactionModal = (props) => {

    const {open, setOpen, tillId} = props;

    const {isLoading: isLoadingTransactions, data: transactions} = useQuery('transactions', () => getAllTransactions({tillId: tillId}))

    const handleCloseModal = () => {
        setOpen(false);
    }

    const tableColumns = [
        {id: 0, dataPropId: 'employee', label: 'Employee', subprops: [
            {id: 0, dataPropId: 'id', label: 'Employee Id', width: '100%'},
            {id: 1, dataPropId: 'email', label: 'Employee Email', width: '100%'},
        ], width: '100%'},
        {id: 1, dataPropId: 'date', label: 'Date', width: '100%'},
        {id: 2, dataPropId: 'totalPrice', label: 'Total Price', width: '100%'}
    ]
    
    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                <div className={classes.title}>
                    <Typography variant={'h4'} color={'info'}>Transaction History</Typography>
                </div>
                {!isLoadingTransactions && <MTTable columns={tableColumns} rows={transactions.transactions} hasPagination />}
            </Paper>
        </Modal>
    )
}