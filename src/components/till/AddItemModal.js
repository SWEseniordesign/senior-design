import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { createItem } from "../../requests/items-req";
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

//* The modal that pops up when the user wants to add a item.
export const AddItemModal = (props) => {

    const {open, setOpen, items, card} = props;

    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleAddItem = async (e) => {
        setLoading(true);
        
        let addResponse = await createItem(
            {
                cardId: card.id, 
                name: newItemName, 
                price: newItemPrice,
                image: '',
                props: [],
                stock: 1
            }
        );

        if(addResponse.code === 201){
            items.push({id: items.length !== 0 ? items[items.length-1].id + 1 : 0, name: newItemName, price: newItemPrice})
            setSaveMessage("Tab Created!");
        } else {
            setSaveMessage("Error create the tab");
        }
        setLoading(false);
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
                    <Typography variant="h5">Add Item to {card.name}</Typography>
                    <MTTextField label={'Name'} value={newItemName} onChangeFunc={setNewItemName}/>
                    <MTTextField label={'Price'} value={newItemPrice} onChangeFunc={setNewItemPrice} icon={'$'}/>
                    <MtButton label={'ADD'} variant={'contained'} onClick={() => handleAddItem()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}