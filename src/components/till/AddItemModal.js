import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import MtButton from "../mui/MTButton";
import { MTModal } from "../mui/MTModal";
import MTTextField from "../mui/MTTextField";

const useStyle = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
    }
})

export const AddItemModal = (props) => {

    const {open, setOpen, items} = props;

    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    const handleAddItem = (e) => {
        setOpen(false);
        console.log(items);
        items.push({id: items[items.length-1].id + 1, label: newItemName, price: newItemPrice})

    }

    const handleCloseModal = () => {
        setOpen(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={open}
            handleOnClose={handleCloseModal}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5">Add Item</Typography>
                    <MTTextField label={'Name'} value={newItemName} onChangeFunc={setNewItemName}/>
                    <MTTextField label={'Price'} value={newItemPrice} onChangeFunc={setNewItemPrice} icon={'$'}/>
                    <MtButton label={'ADD'} variant={'contained'} onClick={() => handleAddItem()} width={'64%'} />
            </Paper>
        </MTModal>
    )
}