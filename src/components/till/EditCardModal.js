import { useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import { updateCard } from "../../requests/cards-req";
import { cardState } from "../../states/cardState";
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
    }
})

//* The modal that pops up when the user wants to edit a card.
export const EditCardModal = (props) => {

    const {cards} = props;

    const localCardState = useHookstate(cardState);

    const [newTabName, setNewTabName] = useState('');
    const [newTabColor, setNewTabColor] = useState('#FFFFFF');
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    //* Handles editing a card
    const handleEditCard = async (e) => {
        setLoading(true);
    
        let editResponse = await updateCard({ cardId: localCardState.editCard.get().id, name: newTabName, color: newTabColor.hex });

        if(editResponse.updated){
            setSaveMessage("Card Saved!");
        } else {
            setSaveMessage("Error saving the card");
        }

        cards.map((card) => {
            if(card.id === localCardState.editCard.get().id){
                card.name = newTabName;
                card.color = newTabColor.hex;
            }
            return card;
        })

        setLoading(false);

        let timeout = setTimeout(() => {
            if(editResponse.updated) localCardState.isEdit.set(false);
        }, 2000)

        return () => clearTimeout(timeout);

    }

    //* Handles closing the modal
    const handleCloseModal = () => {
        localCardState.isEdit.set(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={localCardState.isEdit.get()}
            handleOnClose={() => handleCloseModal()}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5">Editing Card: {localCardState.editCard.get().name}</Typography>
                    <MTTextField label={'New Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                    <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                    <MtButton label={'SAVE'} variant={'contained'} onClick={() => handleEditCard()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}