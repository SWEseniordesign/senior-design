import * as React from 'react';
import { makeStyles } from "@mui/styles";
import { TextField } from '@mui/material';

const useStyles = makeStyles({
  MTTextField: {
    height: '50px',
  }
})
export default function MTTextField(props) {    
  const classes = useStyles(props);
  const {onChangeFunc, isFullWidth, isRequired} = props;
  
  return (
    <TextField 
      className={classes.MTButton} 
      variant={props.variant} 
      placeholder={props.placeholder} 
      label={props.label} 
      required={isRequired ? true : false}
      onChange={(e) => onChangeFunc(e.target.value)} 
      type={!!(props.type) ? props.type : undefined}
      value={props.value}
      fullWidth={isFullWidth ? true: false}>
    </TextField>
  );
}