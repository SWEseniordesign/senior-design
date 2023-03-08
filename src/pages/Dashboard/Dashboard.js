import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Typography, Box, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Avatar, Divider, CircularProgress, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessIcon from '@mui/icons-material/Business';
import Grid2 from "@mui/material/Unstable_Grid2";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserName } from "../../requests/users-req";
import { getAllTills } from "../../requests/tills-req";
import { checkLoggedInStatus_Redirect } from "../helper/routesHelper";


const useStyle = makeStyles({
    root: {
        height: 'calc(100vh - 101px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    board: {
        height: '90%',
        minHeight: '90%',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        height: '95%',
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    widget: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        height: '100%',
        width: '100%',
    },
});

const Dashboard = () => {

    const classes = useStyle();
    const navigate = useNavigate();

    const PIE_COLORS = [COLOR_PALETTE.BLUE_GREEN, COLOR_PALETTE.BLUE_GROTTO, COLOR_PALETTE.NAVY_BLUE, "#042E40"];

    const pieData = [
        {name: 'Food', orders: 40},
        {name: 'Drinks', orders: 15},
        {name: 'Combos', orders: 35},
        {name: 'Snacks', orders: 10}
    ];
 
    const [business, setBusiness] = useState({})
    const [owner, setOwner] = useState({})
    const [tills, setTills] = useState([])
    const [loading, setLoading] = useState(true)

    const handleNavigateTill = (till) => {
        //? This is how we will navigate to the till pages. Either do whats below or do this: navigate(`/view-till/${till.id}`)
        //? Leaving this for now since it can be tested
        navigate(`/edit-till/${till.id}`)

    }

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

    useEffect (() => {
        async function getBusAndTills(){
            const result = await getAllTills();
            const user = await getUserName();
            setBusiness(result.business);
            setOwner(user.formattedUser);
            setTills(result.tills);
            setLoading(false);
        }
        getBusAndTills();
    }, [])

    return (
            <div className={classes.root}>
                {checkLoggedInStatus_Redirect(navigate) && <div className={classes.container}>
                    <Grid2 container sx={{height: '100%', width: '100%'}} spacing={2}>
                        <Grid2 id='grid-panel-left' xs={12} md={5} sx={{height: '100%'}}>
                            <Grid2 container sx={{height: '100%', width: '100%', position: 'relative'}}>
                                <Grid2 id='grid-left-top' xs={12} md={12} sx={{position: 'absolute', top:0, left: 0, height: '40%'}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BABY_BLUE}} elevation={3}>
                                        <Box ml={4} mr={4} mt={8}>
                                            <Box mb={2}>
                                                <Typography variant='h3' sx={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: '400',
                                                                fontSize: '36px',
                                                                lineHeight: '40px',
                                                                display: 'flex'}}>
                                                    {loading ? <Skeleton width={'80%'} /> : `Welcome, ${owner.fname}!`}
                                                </Typography>
                                            </Box>
                                            <Divider/>
                                                <Typography mt={2} variant='h2' sx={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: '600',
                                                                fontSize: '48px',
                                                                lineHeight: '60px',
                                                                display: 'flex'}}>
                                                    {loading ? <Skeleton width={'80%'} /> : business.name}
                                                </Typography>
                                                <Typography variant='h5' sx={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: '200',
                                                                fontSize: '28px',
                                                                lineHeight: '36px',
                                                                display: 'flex'}}>
                                                    {loading ? <Skeleton width={'80%'} /> : business.type}
                                                </Typography>
                                        </Box>
                                    </Card>
                                </Grid2>
                                <Grid2 id='grid-left-bottom' xs={12} md={12} sx={{position: 'absolute', bottom: 0, left: 0, height: '60%'}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BABY_BLUE}} elevation={3}>
                                        <Box m={4} sx={{height: "100%"}}>
                                            <Typography mb={2} variant='h3' sx={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: '400',
                                                            fontSize: '36px',
                                                            lineHeight: '40px',
                                                            display: 'flex'}}>
                                                Monthly Report
                                            </Typography>
                                            <Divider/>
                                            <Box m={2} sx={{height: "70%", alignItems: 'center'}}>
                                                { loading ? 
                                                    (<CircularProgress />) :
                                                    ( <ResponsiveContainer>
                                                            <PieChart>
                                                                <Pie data={pieData} dataKey="orders" nameKey="name" outerRadius={"80%"} >
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
                                                        </ResponsiveContainer>
                                                    )
                                                }
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                        <Grid2 id='grid-panel-right' xs={12} md={7} sx={{height: '100%'}}>
                            <Grid2 container sx={{height: '100%', width: '100%', position: 'relative', display: 'flex', alignItems: 'center'}}>
                                <Grid2 id='grid-right' xs={12} md={12} sx={{position: 'absolute', right: 0, height: '100%',}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BABY_BLUE, position: 'relative'}} elevation={3}>
                                        <Box ml={4} mt={8} mr={4}>
                                            <Typography variant='h3' sx={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: '400',
                                                            fontSize: '36px',
                                                            lineHeight: '40px',
                                                            display: 'flex'}}>
                                                Tills
                                            </Typography>
                                            <Typography variant='h6' sx={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: '200',
                                                            fontSize: '20px',
                                                            lineHeight: '48px',
                                                            display: 'flex'}}>
                                                 {loading ? <Skeleton width={'40%'} /> : business.name}
                                            </Typography>
                                            <Divider/>
                                            <Box id='list-container' mt={4} sx={{overflow: 'auto', height: '80%'}}>
                                                <List>
                                                    {loading ? 
                                                    // Skeleton List
                                                    [1,2,3].map((i) => {
                                                        return (
                                                            <ListItem key={i} disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemAvatar>
                                                                        <Skeleton variant="circular" width={40} height={40} />
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={<Skeleton />}
                                                                        secondary={<Skeleton />}
                                                                    />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        )
                                                    })
                                                    :
                                                    // List
                                                    tills.map((till) => {
                                                        return (
                                                            <ListItem
                                                                key={till.id}
                                                                secondaryAction={
                                                                    <IconButton edge="end" aria-label="delete">
                                                                        <MoreVertIcon />
                                                                        {/* TODO More menu */}
                                                                    </IconButton>
                                                                }
                                                                disablePadding
                                                            >
                                                                <ListItemButton
                                                                    onClick={() => handleNavigateTill(till)}>
                                                                    <ListItemAvatar>
                                                                        <Avatar>
                                                                            <BusinessIcon />
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={till.name}
                                                                        secondary={till.employees.length + " employees"}
                                                                    />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </Box>
                                            <Fab color="primary" aria-label="add" sx={{position: 'absolute', bottom: 20, right: 20}}>
                                                <AddIcon />
                                            </Fab>
                                            <IconButton aria-label="more" sx={{position: 'absolute', top: 20, right: 20}}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
            </div>}
        </div>


    );
}

export default Dashboard;