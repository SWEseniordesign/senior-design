import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
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


export const Dashboard = () => {
    const PIE_COLORS = [COLOR_PALETTE.BLUE_GREEN, COLOR_PALETTE.BLUE_GROTTO, COLOR_PALETTE.NAVY_BLUE, "white"];

    const pieData = [
        {name: 'Food', orders: 40},
        {name: 'Drinks', orders: 15},
        {name: 'Combos', orders: 35},
        {name: 'Snacks', orders: 10}
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
           return (
           <div
              className="custom-tooltip"
              style={{
                 backgroundColor: "#ffff",
                 padding: "5px",
                 border: "1px solid #cccc"
              }}
           >
              <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
           </div>
        );
     }
     return null;
    };


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
            <div>
                <Typography>Dashboard</Typography>
                <Typography sx={{
                                fontFamily: FONT_FAMILY,
                                fontWeight: '600',
                                fontSize: '48px',
                                lineHeight: '56px',
                                display: 'flex'}}>
                    {busName}
                </Typography>
                <Typography sx={{
                                fontFamily: FONT_FAMILY,
                                fontWeight: '600',
                                fontSize: '36px',
                                lineHeight: '44px',
                                display: 'flex'}}>
                    {ownerName}
                </Typography>
                <Typography sx={{
                                fontFamily: FONT_FAMILY,
                                fontWeight: '200',
                                fontSize: '28px',
                                lineHeight: '36px',
                                display: 'flex'}}>
                    {busType}
                </Typography>
            </div>
            <div>
                <Typography sx={{
                                fontFamily: FONT_FAMILY,
                                fontWeight: '600',
                                fontSize: '36px',
                                lineHeight: '44px',
                                display: 'flex'}}>
                    Monthly Report
                </Typography>
                <PieChart width={400} height={400}>
                    <Pie data={pieData} dataKey="orders" nameKey="name" outerRadius={140} >
                        {pieData.map((entry, index) => (
                            <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </div>
        </div>


    );
}