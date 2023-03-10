import { useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import { editTab } from "../../requests/tabs-req";
import { tabState } from "../../states/tabState";
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

//* The modal that pops up when the user wants to edit a tab.
export const EditTabModal = (props) => {
    const {open, setOpen, tabEditId} = props;

    const [newTabName, setNewTabName] = useState('');
    const [newTabColor, setNewTabColor] = useState('#FFFFFF');
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const localTabState = useHookstate(tabState);

    const handleAddTab = async (e) => {
        setLoading(true);
        localTabState.tabs.get().map((tab, i) => {
            if(tab.id === tabEditId){
                console.log(localTabState.tabs[i]);
                localTabState.tabs[i].merge({name: newTabName, color: newTabColor.hex});
            }
        })        
        let editResponse = await editTab({ tabId: tabEditId, name: newTabName, color: newTabColor });
        if(editResponse.success){
            setSaveMessage("Tab Saved!");
        } else {
            setSaveMessage("Error saving the tab");
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
            handleOnClose={() => handleCloseModal()}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5">Editing Tab: {localTabState.tabs.get().filter((tab) => tab.id === tabEditId)[0]?.name}</Typography>
                    <MTTextField label={'New Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                    <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                    <MtButton label={'SAVE'} variant={'contained'} onClick={() => handleAddTab()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}