import { Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { getBusiness } from "../../requests/businesses-req";
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
    const [busName, setBusName] = useState({})

    useEffect(() => {
        getBusiness("DQ")
        //console.log(getUserBusiness(userState.token.get()))
        /*getUserBusiness(userState.token.get()).then(data => {
          setBusName(data)
          console.log(data)
        })*/
      }, []);
    
    return (
        <div>
            <Typography>Dashboard</Typography>
        </div>
            
        
    );
}

export default Dashboard;