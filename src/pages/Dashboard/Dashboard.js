import { Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { getBusiness } from "../../requests/businesses-req";
import { getUserName } from "../../requests/users-req";


/*const useStyle = makeStyles({
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
});*/


const Dashboard = () => {
    //const classes = useStyle();
    const [busName, setBusName] = useState("")
    const [busType, setBusType] = useState("")
    const [ownerName, setOwnerName] = useState("")

    useEffect(() => {
        async function getBus() {
            const bus = await getBusiness()
            setBusName(bus.formattedBus.name)
            setBusType(bus.formattedBus.type)
        }
        async function getOwner() {
            const owner = await getUserName()
            setOwnerName(owner.formattedUser.fname + " " + owner.formattedUser.lname)
        }
        getBus();
        getOwner();
      }, []);
    
    return (
        <div>
            <Typography>Dashboard</Typography>
            <Typography>{busName}</Typography>
            <Typography>{ownerName}</Typography>
            <Typography>{busType}</Typography>
        </div>
            
        
    );
}

export default Dashboard;