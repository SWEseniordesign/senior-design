import * as React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  MTButton: {
    height: '2.5rem',
  }
})
export default function BasicButtons(props) {    
  const classes = useStyles(props);
  
  return (
    <Button className={classes.MTButton} variant={props.variant} onClick={props.onClick} type={!!(props.type) ? props.type : 'button'} fullWidth={props.isFullWidth ? true : false}>{props.label}</Button>
  );
}