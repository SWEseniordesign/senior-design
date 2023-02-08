import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { CompactPicker } from "react-color";
import { COLOR_PALETTE } from "../Constants";
import MtButton from "./mui/MTButton";
import { MTModal } from "./mui/MTModal";
import MTTextField from "./mui/MTTextField";

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

export const AddTabModal = (props) => {

    const {tabs, setTabsFunction, open, setOpen} = props;

    const [newTabName, setNewTabName] = useState('');
    const [newTabColor, setNewTabColor] = useState('#FFFFFF');

    const handleAddTab = (e) => {
        setOpen(false);
        let plusTab = tabs.slice(-1);
        let newList = tabs.filter((tab) => !tab.canAdd);

        newList = newList.concat({id: newList[newList.length - 1].id + 1, label: newTabName, color: newTabColor.hex});
        newList = newList.concat(plusTab);
        setTabsFunction(newList);
        setNewTabColor('#FFFFFF');
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
                    <Typography variant="h5">Add Tab</Typography>
                    <MTTextField label={'Title'} value={newTabName} onChangeFunc={setNewTabName}/>
                    <CompactPicker color={newTabColor} onChange={(color) => setNewTabColor(color)}/>
                    <MtButton label={'ADD'} variant={'contained'} onClick={handleAddTab} width={'64%'} />
            </Paper>
        </MTModal>
    )
}