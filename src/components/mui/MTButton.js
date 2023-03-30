import * as React from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";
import { LoadingButton } from '@mui/lab';

const useStyles = makeStyles((theme) => ({
  MTButton: {
    height: '2.5rem',
  }
}))

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
    backgroundColor,
    textColor,
    borderColor,
    loading,
    isLoadingButton,
    endIcon,
    startIcon,
    makeResponsive,
    disabled,
  } = props;

  //* Determines the width of the button given the props
  const getWidth = () => {
    if(!isFullWidth){
      if(!!(width)){
        return width;
      } else {
        return 'auto';
      }
    } else {
      return '100%';
    }
  }

  return (
  <>
    {!isLoadingButton ?
        <Button
          className={classes.MTButton}
          variant={variant}
          onClick={onClick}
          endIcon={endIcon}
          startIcon={startIcon}
          disabled={disabled}
          sx={{
            width: !(makeResponsive) ? getWidth() : {
              lg: '100%',
              xs: '100%'
            },
            background: backgroundColor,
            color: textColor,
            borderColor: borderColor
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