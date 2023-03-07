import * as React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";
import { LoadingButton } from '@mui/lab';

const useStyles = makeStyles({
  MTButton: {
    height: '2.5rem',
  }
})

export default function MtButton(props) {    
  const classes = useStyles(props);

  //* Available props that can be passed into the custom button. 
  //? eg. <MTTextField (any_of_these_props)={what_you_want_to_pass_in}/>
  const { 
    variant, 
    onClick, 
    isFullWidth, 
    type, 
    label,
    width,
    loading,
    isLoadingButton 
  } = props;
  
  return (
    <>
    {!isLoadingButton ? 
      <Button 
        className={classes.MTButton} 
        variant={variant} 
        onClick={onClick} 
        sx={{
          width: !isFullWidth ? !!(width) ? width : 'auto' : '100%'
        }}
        type={!!(type) ? type : 'button'}>
          {label}
      </Button>
    :
      <LoadingButton 
        className={classes.MTButton} 
        variant={variant} 
        onClick={onClick} 
        sx={{
          width: !isFullWidth ? !!(width) ? width : 'auto' : '100%'
        }}
        loading={loading}>
        {label}
      </LoadingButton>
    }
    </>
  );
}