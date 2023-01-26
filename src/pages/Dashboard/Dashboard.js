import { Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { getBusiness } from "../../requests/businesses-req";
import { userState } from "../../states/userState";


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

    /*async function getBus() {

        const bus = await getBusiness()
        console.log(bus)
        console.log(bus.formattedBus.name)
        setBusName(bus.formattedBus.name)
    }*/

    useEffect(() => {
        async function getBus() {

            const bus = await getBusiness()
            console.log(bus)
            console.log(bus.formattedBus.name)
            setBusName(bus.formattedBus.name)
        }
        console.log("in use effect")
        getBus();
      }, []);

    /*const handleGetBus = async() => {
        const bus = await getBusiness()
        console.log(bus)
        console.log(bus.formattedBus.name)
    }*/

    /*const bus = getBusiness()
        console.log(bus)
        console.log(bus.formattedBus.name)*/

    /*render() {
        console.log("inside render")
        return (
            <Typography>hello</Typography>
        )
    }*/

    
    
    /*useEffect(() => {
        async function getBus() {
            const bus = await getBusiness()
            return bus
        }
        const bus2 = getBus()
        console.log(bus2)
        //console.log(getUserBusiness(userState.token.get()))
        /*getUserBusiness(userState.token.get()).then(data => {
          setBusName(data)
          console.log(data)
        })*/
      //}, []);*/
    
    return (
        <div>
            <Typography>Dashboard</Typography>
            <Typography>{busName}</Typography>
            
            
            
            
        </div>
            
        
    );
}

export default Dashboard;