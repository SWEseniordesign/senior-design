import { Modal, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { MTTable } from "./mui/MTTable";

const useStyles = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
    }
})

export const EditTabsModel = (props) => {

    const {tabList, open, setOpen} = props;

    const handleCloseModal = () => {
        setOpen(false);
    }

    const tableColumns = [
        {id: 0, label: 'Name', width: '100%'},
        {id: 1, label: 'Color', width: '100%'}
    ]

    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
        >
            <Paper className={classes.paper}>
                <Typography>Hello</Typography>
                <MTTable columns={tableColumns} rows={tabList} />
            </Paper>
        </Modal>
    )
}