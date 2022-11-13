import { Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import "./Home.css";
import { COLOR_PALETTE } from "../../Constants";

const useStyle = makeStyles({
    root: {
        display: 'flex'
    },
    
});

export const Home = () => {

    const classes = useStyle();

    return (
        <div className={classes}>
            <div className={classes.singleSectionBox}>
                <Typography sx={{fontSize: '60px'}}>Welcome to my-till!</Typography>
                <div className={classes.buttonBox}>
                    <Button variant="contained" sx={{background: COLOR_PALETTE.NAVY_BLUE}}>SIGN UP</Button>
                    <Button variant="outlined" sx={{color: COLOR_PALETTE.NAVY_BLUE, outlineColor: COLOR_PALETTE.NAVY_BLUE}}>LOG IN</Button>
                </div>
            </div>
            <div className={classes.steps}>
                
            </div>
        </div>
    );
}