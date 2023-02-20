import { useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function MTTextField(props) {    
  const [showPassword, setShowPassword] = useState(false);
  const [determinedType, setDeterminedType] = useState('');

  //* Available props that can be passed into the custom textfield. 
  //? eg. <MTTextField (any_of_these_props)={what_you_want_to_pass_in}/>
  const {
    onChangeFunc, 
    isFullWidth, 
    isRequired, 
    hasError,
    variant,
    placeholder,
    label,
    type,
    value,
    width,
    helperText,
    icon,
    hasPasswordHideShow
  } = props;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    let result;
    if(!!(type)){
      if(!!(hasPasswordHideShow)){
        if(showPassword){
          result = 'text';
        } else {
          result = 'password';
        }
      } else {
        result = type;
      }
    } else {
      result = undefined
    }
    setDeterminedType(result);
  }, [showPassword, type, hasPasswordHideShow])

  return (
    <TextField 
      variant={variant} 
      placeholder={placeholder} 
      label={label} 
      required={isRequired ? true : false}
      onChange={(e) => onChangeFunc(e.target.value)} 
      type={determinedType}
      value={value}
      helperText={helperText}
      fullWidth={isFullWidth ? true: false}
      error={hasError}
      autoComplete={'new-password'}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ margin: '0 12px 0 0' }}>
            {!!(icon) ? icon : undefined}
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            { !!(hasPasswordHideShow) ? 
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            : undefined
          }
          </InputAdornment>
        )
      }}
      sx={{ width: width, background: '#e8f4f8'}}>
    </TextField>
  );
}