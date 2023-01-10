import * as React from 'react';
import { makeStyles } from "@mui/styles";
import { TextField } from '@mui/material';

const useStyles = makeStyles({
  MTTextField: {
    height: '50px',
  }
})
export default function BasicTextField(props) {    
  const classes = useStyles(props);
  
  return (
    <TextField className= {classes.MTButton} variant = {props.variant} placeholder = {props.placeholder} label = {props.label}></TextField>
  );
}