import { useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { updateItem } from "../../requests/items-req";
import { itemState } from "../../states/itemState";
import MtButton from "../mui/MTButton";
import { MTModal } from "../mui/MTModal";
import MTTextField from "../mui/MTTextField";

const useStyle = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
    },
    group: {
        display: 'flex',
        gap: '12px',
    }
})

//* The modal that pops up when the user wants to edit a tab.
export const EditItemModal = (props) => {
    const {item, card} = props;

    const localItemState = useHookstate(itemState);

    const [newItemName, setNewItemName] = useState(localItemState.item.get().name);
    const [newItemPrice, setNewItemPrice] = useState(localItemState.item.get().price);
    const [newItemImage, setNewItemImage] = useState(localItemState.item.get().image);
    const [newItemStock, setNewItemStock] = useState(localItemState.item.get().stock);

    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleEditItem = async (e) => {
        setLoading(true);

        let updatedItem = {
            itemId: localItemState.item.get().id,
            name: newItemName,
            price: newItemPrice,
            image: newItemImage,
            props: [],
            stock: newItemStock
        }      

        let editResponse = await updateItem(updatedItem);

        if(editResponse.updated){
            card.items = card.items.map((cItem) => {
                if(item.id === cItem.id){
                    return updatedItem;
                }
                return cItem;
            })

            setSaveMessage("Item Saved!");
        } else {
            setSaveMessage("Error saving the item");
        }
        setLoading(false);

        let timeout = setTimeout(() => {
            localItemState.isEdit.set(false);
        }, 2000)

        return () => clearTimeout(timeout);

    }

    const handleCloseModal = () => {
        localItemState.isEdit.set(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={localItemState.isEdit.get()}
            handleOnClose={() => handleCloseModal()}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5" sx={{overflow: 'hidden', whiteSpace: 'nowrap'}}>Editing Item: {localItemState.item.get().name}</Typography>
                    <MTTextField label={'New Name'} value={newItemName} onChangeFunc={setNewItemName} isFullWidth />
                    <div className={classes.group}>
                        <MTTextField label={'New Price'} value={newItemPrice} onChangeFunc={setNewItemPrice}/>
                        <MTTextField label={'New Stock'} value={newItemStock} onChangeFunc={setNewItemStock}/>
                    </div>
                    <MTTextField label={'New Image'} value={newItemImage} onChangeFunc={setNewItemImage}/>
                    <MtButton label={'SAVE'} variant={'contained'} onClick={() => handleEditItem()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}