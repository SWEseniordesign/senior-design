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
export default function MTSwitch(props) {
  const classes = useStyles();

  //* Available props that can be passed into the custom switch. 
  //? eg. <MTTextField (any_of_these_props)={what_you_want_to_pass_in}/>
  const { label } = props;

  return (
    <FormControlLabel control={<Switch color = 'primary' className={classes.MTSwitch} />} label={label} />
  );
}