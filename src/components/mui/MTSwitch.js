import * as React from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    MTSwitch: {
        '&.MuiButtonBase-root':{
            color: 'secondary',
        },
    }
})
export default function BasicSwitches(props) {
  const classes = useStyles();
  return (
    <FormControlLabel  control={<Switch color = 'primary' className = {classes.MTSwitch} />} label = {props.label} />
  );
}