import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Grid, Card, Typography, Box, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Avatar, Divider, CircularProgress, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessIcon from '@mui/icons-material/Business';
import Grid2 from "@mui/material/Unstable_Grid2";
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent, DialogContentText, DialogTitle }  from '@material-ui/core';
import MTButton from "../../components/mui/MTButton";
import MTTextField from '../../components/mui/MTTextField'
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserName } from "../../requests/users-req";
import { getAllTills, createTill } from "../../requests/tills-req";
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
    dialogContainer: {
        margin: '20px'
    },
    dialogElement: {
        marginBottom: '20px'
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      dialog: {
        position: "relative",
        zIndex: 10000,
      }
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

    const [newTillName, setNewTillName] = useState('');
    const [newTillLoginId, setNewTillLoginId] = useState('');
    //LOGIN ID GETS GENERATED, TELL THEM WHAT IT IS AFTER MAKE TILL
    //onCHangeFunc textfield
    const [newTillManagerPassword, setNewTillManagerPassword] = useState('');
    const [addTillOpen, setAddTillOpen] = useState(false);
    const [submitAddTillTriggered, setSubmitAddTillTriggered] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});
    const [failedAddTillDialogOpen, setFailedAddTillDialogOpen] = useState(false);
    const closeFailedAddTillDialog = () => setFailedAddTillDialogOpen(false);

    

    const handleAddTillClick = () => {
        setAddTillOpen(true);
    };
    const handleAddTillClose = () => {
        setSubmitAddTillTriggered(true);
        setAddTillOpen(false);
    };
    
    const handleAddTillSubmit = async(e) => {
        e.preventDefault();
        try{
            let newTill = {
                //businessId: '63d2b33a2a75670dbd74fb3b',
                //NEED TO GET BUSID
                name: newTillName,
                managerPassword: newTillManagerPassword,
                employees: [],
                tabs: [],
                props: []
                //loginId: newTillLoginId
                //hide managerPassword
                //employees: [] NEED EMAIL AND IS MANAGER!!!
                //etc
            }
            let response = await createTill(newTill);
            if(!(response) || response.code !== 201){
                setAlertMessage({message: !(response) ? 'Failed to create till.' : response.err, status: 'warning'});
                setFailedAddTillDialogOpen(true);
            } else {
                setAlertMessage({message: 'Till Created!', status: 'success'});
                //setBusinessName('');
                //setBusinessType('');
            }

            setAddTillOpen(true);
        } catch(e){
            console.log(e);
        }

        setSubmitAddTillTriggered(true);
        setAddTillOpen(false);
    };

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
                                                                        secondary={till.employees?.length + " employees"}
                                                                    />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </Box>
                                            <Fab color="primary" aria-label="add" onClick={handleAddTillClick} sx={{position: 'absolute', bottom: 20, right: 20}}>
                                                <AddIcon />
                                            </Fab>
                                            <IconButton aria-label="more" sx={{position: 'absolute', top: 20, right: 20}}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            {addTillOpen && (
                                                <div className={classes.overlay}>
                                                    <Dialog open={addTillOpen} onClose={handleAddTillClose} className={classes.dialog} PaperProps={{ style: { zIndex: 10002 } }} aria-labelledby="form-dialog-title">
                                                        <div className={classes.dialogContainer}>
                                                            <DialogTitle id="form-dialog-title">
                                                                <Typography sx={{
                                                                                fontFamily: FONT_FAMILY,
                                                                                fontWeight: '600',
                                                                                fontSize: '32px',
                                                                                lineHeight: '40px',
                                                                                display: 'flex',
                                                                                justifyContent: 'center'}}>
                                                                    Add New Till
                                                                </Typography>
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <div className={classes.dialogElement}>
                                                                    <Grid container rowSpacing={3}>
                                                                        <Grid item xs={12} md={12}>
                                                                            <MTTextField label={'Name'} value={newTillName} onChangeFunc={setNewTillName} isFullWidth isRequired mb={4} />
                                                                        </Grid>
                                                                        <Grid item xs={12} md={12}>
                                                                            <MTTextField label={'Manager Password'} type='password' value={newTillManagerPassword} onChangeFunc={setNewTillManagerPassword} isFullWidth isRequired hasPasswordHideShow mb={4} />
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <MTButton label={'CANCEL'} variant={'outlined'} type={'submit'} onClick={handleAddTillClose} isFullWidth></MTButton>
                                                                <MTButton label={'CREATE'} variant={'contained'} type={'submit'} onClick={handleAddTillSubmit} isFullWidth></MTButton>
                                                            </DialogActions>
                                                        </div>
                                                    </Dialog>
                                                </div>
                                            )}
                                            <Dialog
                                                open={failedAddTillDialogOpen}
                                                onClose={closeFailedAddTillDialog}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">{"Failled to add till"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Could not add till.
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <MTButton label={'CLOSE'} variant={'contained'} onClick={closeFailedAddTillDialog}></MTButton>
                                                </DialogActions>
                                            </Dialog>
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