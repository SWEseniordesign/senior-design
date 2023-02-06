import { Modal, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

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

    const classes = useStyles();

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
        >
            <Paper className={classes.paper}>
                <Typography>Hello</Typography>
            </Paper>
        </Modal>
    )
}