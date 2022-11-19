import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MTButton from "../../components/mui/MTButton"
import React from "react";

const useStyle = makeStyles({
    root: {
        display: 'flex'
    },
    
});

export const Home = () => {

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <MTButton variant = {"outlined"} label = {"balls"}></MTButton>
            <Typography sx={{fontSize: '60px'}}>Welcome to my-till!</Typography>
        </div>
    );
}