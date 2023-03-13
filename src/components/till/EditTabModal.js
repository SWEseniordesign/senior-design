import { useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import { updateTab } from "../../requests/tabs-req";
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
    const {tabEdit} = props;

    const [newTabName, setNewTabName] = useState(tabEdit.name);
    const [newTabColor, setNewTabColor] = useState(tabEdit.color);
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const localTabState = useHookstate(tabState);

    const handleAddTab = async (e) => {
        setLoading(true);
        localTabState.tabs.get().map((tab, i) => {
            if(tab.id === tabEdit.id){
                localTabState.tabs[i].merge({name: newTabName, color: newTabColor.hex});
            }
        })        
        let editResponse = await updateTab({ tabId: tabEdit.id, name: newTabName, color: newTabColor.hex });
        if(editResponse.updated){
            setSaveMessage("Tab Saved!");
        } else {
            setSaveMessage("Error saving the tab");
        }
        setLoading(false);

        let timeout = setTimeout(() => {
            if(editResponse.updated) localTabState.isEdit.set(false);
        }, 2000)

        return () => clearTimeout(timeout);

    }

    const handleCloseModal = () => {
        localTabState.isEdit.set(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={localTabState.isEdit.get()}
            handleOnClose={() => handleCloseModal()}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5">Editing Tab: {localTabState.tabs.get().filter((tab) => tab.id === tabEdit.id)[0]?.name}</Typography>
                    <MTTextField label={'New Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                    <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                    <MtButton label={'SAVE'} variant={'contained'} onClick={() => handleAddTab()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}