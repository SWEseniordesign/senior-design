import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
            <Typography sx={{fontSize: '60px'}}>Welcome to my-till!</Typography>
        </div>
    );
}