import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import { createCard } from "../../requests/cards-req";
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

//* The modal that pops up when the user wants to add a card.
export const AddCardModal = (props) => {

    const {open, setOpen, cards, tabId} = props;

    const [newCardName, setNewCardName] = useState('');
    const [newCardColor, setNewCardColor] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleAddCard = async (e) => {
        setLoading(true);

        let newCard = {
            tabId: tabId,
            name: newCardName,
            color: newCardColor.hex,
            dimensions: cards.length === 0 ? {
                x: 0, 
                y: 0, 
                width: 1, 
                height: 1
            } : {
                x: cards[cards.length-1].dimensions.x + 1, 
                y: cards[cards.length-1].dimensions.y, 
                width: 1, 
                height: 1
            },
            items: [],
            static: false
        }

        let addResponse = await createCard(newCard);

        if(addResponse.code === 201){
            if(cards.length === 0){ // If there is no cards (only the add card)
                cards.push({
                    id: addResponse.formattedCard.id,
                    name: newCardName, 
                    color: newCardColor.hex, 
                    dimensions: {
                        x: 0, 
                        y: 0, 
                        w: 1, 
                        h: 1
                    }, 
                    items: [], 
                    static: false
                })            
            } else { // If there are more than 1 card
                cards.push({
                    id: addResponse.formattedCard.id,
                    name: newCardName, 
                    color: newCardColor.hex, 
                    dimensions: {
                        x: cards[cards.length-1].dimensions.x === 2 ? 0 : cards[cards.length-1].dimensions.x + 1, 
                        y: cards[cards.length-1].dimensions.y === 2 ? 0 : cards[cards.length-1].dimensions.y + 1, 
                        w: 1, 
                        h: 1
                    }, 
                    items: [], 
                    static: false
                })
            }
            setSaveMessage("Card Created!");
        } else {
            setSaveMessage("Error create the card");
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
                    <Typography variant="h5">Add Card</Typography>
                    <MTTextField label={'Name'} value={newCardName} onChangeFunc={setNewCardName}/>
                    <CompactPicker color={newCardColor} onChange={(color) => setNewCardColor(color)}/>
                    <MtButton label={'ADD'} variant={'contained'} onClick={() => handleAddCard()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}