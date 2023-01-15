import * as React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  MTButton: {
    height: '2.5rem',
  }
})

/*
  Parameters than be passed in:
   - Label
   - Variant
   - OnClick function
   - Width
   - Type
   - isFullWidth
*/
export default function MtButton(props) {    
  const classes = useStyles(props);
  
  return (
    <Button 
      className={classes.MTButton} 
      variant={props.variant} 
      onClick={props.onClick} 
      sx={{
        width: !props.isFullWidth ? !!(props.width) ? props.width : 'auto' : '100%'
      }}
      type={!!(props.type) ? props.type : 'button'}>
        {props.label}
      </Button>
  );
}