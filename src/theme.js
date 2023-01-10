import { createTheme } from '@mui/material';
import { COLOR_PALETTE } from './Constants';

const theme = createTheme({
    palette: {
        primary:{
            main: COLOR_PALETTE.BLUE_GROTTO
        },
        secondary:{
            main: COLOR_PALETTE.BABY_BLUE
        },
        info:{
            main: COLOR_PALETTE.NAVY_BLUE
        }
    }
})

export default theme;