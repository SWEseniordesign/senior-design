import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Paper, Card, Typography, Box, Fab, IconButton, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid2 from "@mui/material/Unstable_Grid2";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MTTextField from '../../components/mui/MTTextField' 
import MTButton from "../../components/mui/MTButton";
import MTSelect from "../../components/mui/MTSelect";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import React, { useEffect, useState } from "react";
import { getBusiness, editBusiness } from "../../requests/businesses-req";
import { getUserName } from "../../requests/users-req";


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

    const PIE_COLORS = [COLOR_PALETTE.BLUE_GREEN, COLOR_PALETTE.BLUE_GROTTO, COLOR_PALETTE.NAVY_BLUE, "#042E40"];

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
    const [busName, setBusName] = useState("");
    const [busType, setBusType] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});
    const [submitTriggered, setSubmitTriggered] = useState(false);

    const getBus = async() => {
        const bus = await getBusiness()
        setBusName(bus.formattedBus.name)
        setBusType(bus.formattedBus.type)
        console.log(bus); //remove
    }
    const getOwner = async() => {
        const owner = await getUserName()
        setOwnerName(owner.formattedUser.fname + " " + owner.formattedUser.lname)
    }

    useEffect(() => {
        if(submitTriggered) {
            getBus();
            getOwner();
            setSubmitTriggered(false);
        }
        getBus();
        getOwner();
        
    }, [submitTriggered]);

    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [open, setOpen] = useState(false);
    //* The types of business myTill supports.
    const businessTypes = [
        {id: 1, title: 'Whole Sale', onClick: (e) => setBusinessType(e.target.value)},
        {id: 2, title: 'Quick Service', onClick: (e) => setBusinessType(e.target.value)}
    ]

    const handleEditBusinessClick = () => {
        setOpen(true);
        //console.log("ayooo");
    };
    const handleClose = () => {
        setSubmitTriggered(true);
        setOpen(false);
    };
    
    const handleEditBusinessSubmit = async(e) => {
        //setSubmitTriggered(true);
        console.log("yuh");
        console.log(businessName);
        console.log(businessType);
        //save new bus info and refresh

        e.preventDefault();
        try{
            let updatedBusiness = {
                name: businessName,
                type: businessType
                //admins: [],
                //tills: []
            }
            let response = await editBusiness(updatedBusiness);

            if(!(response) || response.code !== 201){
                setAlertMessage({message: !(response) ? 'Failed to update business.' : response.err, status: 'warning'});
            } else {
                setAlertMessage({message: 'Business Updated!', status: 'success'});
                setBusinessName('');
                setBusinessType('');
            }

            setOpen(true);
        } catch(e){
            console.log(e);
        }

        setSubmitTriggered(true);
        setOpen(false);
    };
    
    return (
            <div className={classes.root}>
                {/* <Paper className={classes.board} elevation={5} sx={{
                backgroundColor: COLOR_PALETTE.BABY_BLUE,
            }}> */}
                <div className={classes.container}>
                    <Grid2 container sx={{height: '100%', width: '100%'}} spacing={2}>
                        <Grid2 id='grid-panel-left' xs={12} md={5} sx={{height: '100%'}}>
                            <Grid2 container sx={{height: '100%', width: '100%', position: 'relative'}}>
                                <Grid2 id='grid-left-top' xs={12} md={12} sx={{position: 'absolute', top:0, left: 0, height: '40%'}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BABY_BLUE}} elevation={3}>
                                        <Box ml={4} mt={8}>
                                            <Box mb={2}>
                                                <Typography sx={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: '400',
                                                                fontSize: '36px',
                                                                lineHeight: '40px',
                                                                display: 'flex'}}>
                                                    Welcome, {ownerName}!
                                                </Typography>
                                            </Box>
                                            <Typography sx={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: '600',
                                                            fontSize: '48px',
                                                            lineHeight: '60px',
                                                            display: 'flex'}}>
                                                {busName}
                                            </Typography>
                                            <Typography sx={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: '200',
                                                            fontSize: '28px',
                                                            lineHeight: '36px',
                                                            display: 'flex'}}>
                                                {busType}
                                            </Typography>
                                            <IconButton aria-label="more" onClick={handleEditBusinessClick} sx={{position: 'absolute', top: 20, right: 20}}>
                                                <MoreVertIcon />
                                            </IconButton>

                                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                                <DialogTitle id="form-dialog-title">Edit Business</DialogTitle>
                                                
                                                <Grid container spacing={3}>
                                                    <DialogContent>
                                                        <Grid item xs={12}>
                                                            <MTTextField label={'Name'} value={businessName} onChangeFunc={setBusinessName} isFullWidth isRequired />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <MTSelect label={'Type'} items={businessTypes} value={businessType} setValue={setBusinessType} isRequired isFullWidth></MTSelect>
                                                        </Grid>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Grid item xs={6}>
                                                            <MTButton label={'CANCEL'} variant={'outlined'} type={'submit'} onClick={handleClose} isFullWidth></MTButton>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <MTButton label={'CREATE'} variant={'contained'} type={'submit'} onClick={handleEditBusinessSubmit} isFullWidth></MTButton>
                                                        </Grid>
                                                    </DialogActions>
                                                </Grid>
                                            </Dialog>
                                        </Box>
                                    </Card>
                                </Grid2>
                                <Grid2 id='grid-left-bottom' xs={12} md={12} sx={{position: 'absolute', bottom: 0, left: 0, height: '60%'}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BABY_BLUE}} elevation={3}>
                                        <Box ml={4} mt={4} mr={4}>
                                            <Typography sx={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: '600',
                                                            fontSize: '36px',
                                                            lineHeight: '44px',
                                                            display: 'flex'}}>
                                                Monthly Report
                                            </Typography>
                                            <ResponsiveContainer height={400} width={"100%"}>
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
                                        </Box>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </Grid2>  
                        <Grid2 id='grid-panel-right' xs={12} md={7} sx={{height: '100%'}}>
                            <Grid2 container sx={{height: '100%', width: '100%', position: 'relative', display: 'flex', alignItems: 'center'}}>
                                <Grid2 id='grid-right' xs={12} md={12} sx={{position: 'absolute', right: 0, height: '100%',}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BABY_BLUE, position: 'relative'}} elevation={3}>
                                        <Box ml={4} mt={8}>
                                            <Typography variant='h4'> Title3</Typography>
                                            <Typography variant='subtitle1'> Subtitle3 </Typography>
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
            </div>
        </div>
            
        
    );
}

export default Dashboard;