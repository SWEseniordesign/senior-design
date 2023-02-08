import { useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../../Constants";
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

export const EditTabModal = (props) => {
    const {open, setOpen, tabEditId} = props;

    const [newTabName, setNewTabName] = useState('');
    const [newTabColor, setNewTabColor] = useState('#FFFFFF');
    const localTabState = useHookstate(tabState);

    const handleAddTab = (e) => {
        setOpen(false);

        localTabState.tabs.get().map((tab) => {
            if(tab.id === tabEditId){
                localTabState.tabs[tab.id].merge({label: newTabName, color: newTabColor.hex});
            }
        })        
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
                    <Typography variant="h5">Edit Tab: {localTabState.tabs.get().filter((tab) => tab.id === tabEditId)[0]?.label}</Typography>
                    <MTTextField label={'New Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                    <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                    <MtButton label={'SAVE'} variant={'contained'} onClick={handleAddTab} width={'64%'} />
            </Paper>
        </MTModal>
    )
}