import * as React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";
import { COLOR_PALETTE } from "../../Constants";

const useStyles = makeStyles({
  MTButton: {
    height: '50px',
    width: '60px',
    '&.MuiButtonBase-root':{
        borderColor:  COLOR_PALETTE.BLUE_GROTTO,
        color: props => props.variant !== 'outlined' ? 'white' : COLOR_PALETTE.BLUE_GROTTO,
        backgroundColor: props => props.variant !== 'outlined' ? COLOR_PALETTE.BLUE_GROTTO : 'white',
        '&:hover': {
          borderColor:  COLOR_PALETTE.NAVY_BLUE,
          color: props => props.variant !== 'outlined' ? 'white' : COLOR_PALETTE.NAVY_BLUE,
          backgroundColor: props => props.variant !== 'outlined' ? COLOR_PALETTE.NAVY_BLUE : 'lightgray',
      }
    }
},
})
export default function BasicButtons(props) {    
  const classes = useStyles(props);
  
  return (
    <Button className= {classes.MTButton} variant = {props.variant} onClick = {props.onClick}>{props.label}</Button>
  );
}