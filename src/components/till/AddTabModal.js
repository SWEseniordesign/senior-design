import { none, useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
import { createTab } from "../../requests/tabs-req";
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

//* The modal that pops up when the user wants to add a tab.
export const AddTabModal = (props) => {

    const {tillId} = props;
    const localTabState = useHookstate(tabState);
    
    const [newTabName, setNewTabName] = useState('');
    const [newTabColor, setNewTabColor] = useState('#FFFFFF');
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    //* Handles adding a tab
    const handleAddTab = async (e) => {
        setLoading(true);
        localTabState.tabs[localTabState.tabs.get().length-1].set(none);

        let addResponse = await createTab({tillId: tillId, name: newTabName, color: newTabColor.hex, cards: []});
        if(addResponse.code === 201){
            localTabState.tabs.merge([{id: localTabState.tabs.get().length, name: newTabName, color: newTabColor.hex, cards: []}]);
            setSaveMessage("Tab Created!");
        } else {
            setSaveMessage("Error create the tab");
        }
        localTabState.tabs.merge([{id: localTabState.tabs.get().length+1, name: '+', canAdd: true}]);
        localTabState.activeTab.set('');

        setLoading(false);

        setNewTabColor('#FFFFFF');

        let timeout = setTimeout(() => {
            localTabState.isAdd.set(false);
        }, 2000)

        return () => clearTimeout(timeout);
    }

    //* Handles closing the modal
    const handleCloseModal = () => {
        localTabState.isAdd.set(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={localTabState.isAdd.get()}
            handleOnClose={handleCloseModal}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5">Add Tab</Typography>
                    <MTTextField label={'Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                    <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                    <MtButton label={'ADD'} variant={'contained'} onClick={() => handleAddTab()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}