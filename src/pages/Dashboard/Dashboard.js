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
import MTDropdown from "../../components/mui/MTDropdown";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserName } from "../../requests/users-req";
import { getAllTills, getTill, createTill, editTill } from "../../requests/tills-req";
import { checkLoggedInStatus_Redirect } from "../helper/routesHelper";
import { tabState } from "../../states/tabState";
import { useHookstate } from "@hookstate/core";

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

    const localTabState = useHookstate(tabState);

    const PIE_COLORS = [COLOR_PALETTE.BLUE_GREEN, COLOR_PALETTE.BLUE_GROTTO, COLOR_PALETTE.NAVY_BLUE, "#042E40"];

    const pieData = [
        {name: 'Food', orders: 40},
        {name: 'Drinks', orders: 15},
        {name: 'Combos', orders: 35},
        {name: 'Snacks', orders: 10}
    ];
 
    const [businessId, setBusinessId] = useState('')
    const [business, setBusiness] = useState({})
    const [owner, setOwner] = useState({})
    const [tills, setTills] = useState([])
    const [loading, setLoading] = useState(true)

    
    //onCHangeFunc textfield
    //use alert message for fail instead???
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});

    /* Stuff for Add Till Dialog */
    const [newTillName, setNewTillName] = useState('');
    const [newTillManagerPassword, setNewTillManagerPassword] = useState('');
    const [newTillLoginId, setNewTillLoginId] = useState('');
    const [addTillOpen, setAddTillOpen] = useState(false);
    const [submitAddTillTriggered, setSubmitAddTillTriggered] = useState(false); //need this as well as addTillOpen or only need one?
    const [failedAddTillDialogOpen, setFailedAddTillDialogOpen] = useState(false);
    const [successAddTillDialogOpen, setSuccessAddTillDialogOpen] = useState(false);
    const closeFailedAddTillDialog = () => setFailedAddTillDialogOpen(false);
    const closeSuccessAddTillDialog = () => setSuccessAddTillDialogOpen(false);

    /* Stuff for Edit Till Dialog */
    const [tillToUpdate, setTillToUpdate] = useState({});
    const [updatedTillName, setUpdatedTillName] = useState('');
    const [updatedTillManagerPassword, setUpdatedTillManagerPassword] = useState('');
    const [editTillOpen, setEditTillOpen] = useState(false);
    const [submitEditTillTriggered, setSubmitEditTillTriggered] = useState(false); //need this as well as addTillOpen or only need one?
    //const [failedAddTillDialogOpen, setFailedAddTillDialogOpen] = useState(false);
    //const [successAddTillDialogOpen, setSuccessAddTillDialogOpen] = useState(false);
    //const closeFailedAddTillDialog = () => setFailedAddTillDialogOpen(false);
    //const closeSuccessAddTillDialog = () => setSuccessAddTillDialogOpen(false);
    //ALERT MESSAGE INSTEAD LIE LOGIN PAGE!
    //const handleEditTill = async(till) => {
        //setEditTillOpen
    //};
    const closeEditTill = () => setEditTillOpen(false);

    /* Stuff for View Till Credentials Dialog */
    const [thisTillName, setThisTillName] = useState('');
    const [thisTillLoginId, setThisTillLoginId] = useState('');
    const [thisTillManagerPassword, setThisTillManagerPassword] = useState('');
    const [tillCredsDialogOpen, setTillCredsDialogOpen] = useState(false);
    const closeTillCredsDialog = () => setTillCredsDialogOpen(false);

    const handleNavigateTill = (till) => {
        //? This is how we will navigate to the till pages. Either do whats below or do this: navigate(`/view-till/${till.id}`)
        //? Leaving this for now since it can be tested
        localTabState.tabs.set([]);
        localTabState.activeTab.set('');
        if(localTabState.tabs.get().length === 0 && localTabState.activeTab.get() === '') {
            navigate(`/edit-till/${till.id}`)
        }
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
            setBusinessId(result.business.id);
        }
        getBusAndTills();

        setSubmitAddTillTriggered(false);
        setSubmitEditTillTriggered(false);
    }, [submitAddTillTriggered, submitEditTillTriggered]) //check this was ok to do?

    const handleEditTill = (till) => {
        setEditTillOpen(true);
        setTillToUpdate(till);
    }
    
    const handleEditTillSubmit = async(e) => {
        //put in try catch???
        e.preventDefault();
        try{
            let updatedTill = {
                //businessId: businessId,
                id: tillToUpdate.id,
                name: updatedTillName,
                managerPassword: updatedTillManagerPassword,
                //employees: [],
                //tabs: [],
                //props: []
            }
            let response = await editTill(updatedTill);
            if(!(response) || response.code !== 201){
                setAlertMessage({message: !(response) ? 'Failed to edit till.' : response.err, status: 'warning'});
                //setFailedAddTillDialogOpen(true);
            } else {
                setAlertMessage({message: 'Till Created!', status: 'success'});
                //setSuccessAddTillDialogOpen(true);
            }
            //const createdTill = await getTill(response.formattedTill);
            //setNewTillLoginId(createdTill.formattedTill.loginId)

            setEditTillOpen(true); //remove?
        } catch(e){
            console.log(e);
        }

        setSubmitEditTillTriggered(true);
        setEditTillOpen(false);
        
        //const thisTill = await getTill(tillToUpdate); //dont need to get first, this was just test
        //console.log(thisTill);
    };
    const handleTillCreds = (till) => {
        setThisTillName(till.name);
        setThisTillLoginId(till.loginId);
        setThisTillManagerPassword(till.managerPassword)
        setTillCredsDialogOpen(true);
    };
    

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
                businessId: businessId,
                name: newTillName,
                managerPassword: newTillManagerPassword,
                employees: [],
                tabs: [],
                props: []
            }
            let response = await createTill(newTill);
            if(!(response) || response.code !== 201){
                setAlertMessage({message: !(response) ? 'Failed to create till.' : response.err, status: 'warning'});
                setFailedAddTillDialogOpen(true);
            } else {
                setAlertMessage({message: 'Till Created!', status: 'success'});
                setSuccessAddTillDialogOpen(true);
            }
            const createdTill = await getTill(response.formattedTill);
            setNewTillLoginId(createdTill.formattedTill.loginId)

            setAddTillOpen(true);
        } catch(e){
            console.log(e);
        }

        setSubmitAddTillTriggered(true);
        setAddTillOpen(false);
    };

    //* MenuItems that are apart of each individual till dropdown.
    const dropdownMenuItems_ForTills = (till) => [
        {id: 1, title: 'Edit Till', action: () => handleEditTill(till)},
        {id: 2, title: 'View Credentials', action: () => {handleTillCreds(till)}},
        {id: 3, title: 'Delete Till', action: () => {}}
    ];

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
                                                    {loading ? <Skeleton width={'80%'} /> : `Welcome, ${owner?.fname}!`}
                                                </Typography>
                                            </Box>
                                            <Divider/>
                                                <Typography mt={2} variant='h2' sx={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: '600',
                                                                fontSize: '48px',
                                                                lineHeight: '60px',
                                                                display: 'flex'}}>
                                                    {loading ? <Skeleton width={'80%'} /> : business?.name}
                                                </Typography>
                                                <Typography variant='h5' sx={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: '200',
                                                                fontSize: '28px',
                                                                lineHeight: '36px',
                                                                display: 'flex'}}>
                                                    {loading ? <Skeleton width={'80%'} /> : business?.type}
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
                                                 {loading ? <Skeleton width={'40%'} /> : business?.name}
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
                                                    tills?.map((till) => {
                                                        return (
                                                            <ListItem
                                                                key={till.id}
                                                                secondaryAction={
                                                                    <MTDropdown isIconButton menuItems={dropdownMenuItems_ForTills(till)}/>
                                                                }
                                                                disablePadding
                                                            >
                                                                <div onClick={() => console.log("ayo")}>
        {/* Render the contents of the ListItem */}
      </div>
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
                                            {editTillOpen && (
                                                <div className={classes.overlay}>
                                                    <Dialog open={editTillOpen} onClose={closeEditTill} className={classes.dialog} PaperProps={{ style: { zIndex: 10002 } }} aria-labelledby="form-dialog-title">
                                                        <div className={classes.dialogContainer}>
                                                            <DialogTitle id="form-dialog-title">
                                                                <Typography sx={{
                                                                                fontFamily: FONT_FAMILY,
                                                                                fontWeight: '600',
                                                                                fontSize: '32px',
                                                                                lineHeight: '40px',
                                                                                display: 'flex',
                                                                                justifyContent: 'center'}}>
                                                                    Edit Till
                                                                </Typography>
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <div className={classes.dialogElement}>
                                                                    <Grid container rowSpacing={3}>
                                                                        <Grid item xs={12} md={12}>
                                                                            <MTTextField label={'New Name'} value={updatedTillName} onChangeFunc={setUpdatedTillName} isFullWidth isRequired mb={4} />
                                                                        </Grid>
                                                                        <Grid item xs={12} md={12}>
                                                                            <MTTextField label={'New Manager Password'} type='password' value={updatedTillManagerPassword} onChangeFunc={setUpdatedTillManagerPassword} isFullWidth isRequired hasPasswordHideShow mb={4} />
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <MTButton label={'CANCEL'} variant={'outlined'} type={'submit'} onClick={closeEditTill} isFullWidth></MTButton>
                                                                <MTButton label={'UPDATE'} variant={'contained'} type={'submit'} onClick={handleEditTillSubmit} isFullWidth></MTButton>
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
                                                <DialogTitle id="alert-dialog-title">{"Failed to add till"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Could not add till.
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <MTButton label={'CLOSE'} variant={'contained'} onClick={closeFailedAddTillDialog}></MTButton>
                                                </DialogActions>
                                            </Dialog>
                                            <Dialog
                                                open={successAddTillDialogOpen}
                                                onClose={closeSuccessAddTillDialog}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">{"Successfully added till"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        The till loginId is {newTillLoginId}.
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <MTButton label={'CLOSE'} variant={'contained'} onClick={closeSuccessAddTillDialog}></MTButton>
                                                </DialogActions>
                                            </Dialog>
                                            <Dialog
                                                open={tillCredsDialogOpen}
                                                onClose={closeTillCredsDialog}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">{thisTillName} {"Credentials"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Till loginId: {thisTillLoginId}.
                                                    </DialogContentText>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Till manager password: {thisTillManagerPassword}.
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <MTButton label={'CLOSE'} variant={'contained'} onClick={closeTillCredsDialog}></MTButton>
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