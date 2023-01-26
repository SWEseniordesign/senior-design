import { Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
//import { getBusiness } from "../../requests/users-req";
import { userState } from "../../states/userState";

const useStyle = makeStyles({
    root: {
        height: 'calc(100vh - 101px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        height: 'fit-content',
        width: '60%',
        maxWidth: '500px'
    },
});


const Dashboard = () => {
    const classes = useStyle();
    
    return (
        <div>
            <Typography>Dashboard</Typography>
            <div className={classes.root}>
                <Paper className={classes.paper} elevation={5} sx={{
                    backgroundColor: COLOR_PALETTE.BABY_BLUE
                }}>
                </Paper>
            </div>
        </div>
            
        
    );
}

export default Dashboard;