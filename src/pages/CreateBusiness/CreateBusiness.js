import { Alert, Grid, Paper, Snackbar, Typography, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import MTTextField from '../../components/mui/MTTextField' 
import MTButton from "../../components/mui/MTButton";
import { createBusiness } from "../../requests/businesses-req";
import MTSelect from "../../components/mui/MTSelect";
import { userState } from "../../states/userState";

const useStyles = makeStyles({
    root: {
        height: 'calc(100vh - 101px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        height: 'fit-content',
        width: '25%',
    },
    container: {
        padding: '30px'
    },
    title: {
        marginBottom: '24px'
    }
})

export const CreateBusiness = () => {

    const navigate = useNavigate();
    const classes = useStyles();

    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});

    //* Closes the alert that shows whenever the user create a business or an error occurs.
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    //* Using the name and type inputted from the user, we attempt to create business.
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            let newBusiness = {
                name: businessName,
                type: businessType,
                admins: [],
                tills: []
            }
            let response = await createBusiness(newBusiness);

            if(!(response) || response.code !== 201){
                setAlertMessage({message: !(response) ? 'Failed to create business.' : response.err, status: 'warning'});
            } else {
                setAlertMessage({message: 'Business Created!', status: 'success'});
                setBusinessName('');
                setBusinessType('');
            }

            setOpen(true);
        } catch(e){
            console.log(e);
        }
    }

    //* The types of business myTill supports.
    const businessTypes = [
        {id: 1, title: 'Whole Sale', onClick: (e) => setBusinessType(e.target.value)},
        {id: 2, title: 'Quick Service', onClick: (e) => setBusinessType(e.target.value)}
    ]

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} square elevation={5} sx={{
                backgroundColor: COLOR_PALETTE.BABY_BLUE
            }}>
                <div className={classes.container}>
                    <div className={classes.title}>
                        <Typography sx={{
                            fontFamily: FONT_FAMILY,
                            fontWeight: '600',
                            fontSize: '48px',
                            lineHeight: '56px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>Create Business</Typography>
                    </div>
                    <form id="create-account-form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <MTTextField label={'Name'} value={businessName} onChangeFunc={setBusinessName} isFullWidth isRequired />
                            </Grid>
                            <Grid item xs={12}>
                                <MTSelect label={'Type'} items={businessTypes} value={businessType} setValue={setBusinessType} isRequired isFullWidth></MTSelect>
                            </Grid>
                            <Grid item xs={12}>
                                <MTButton label={'CREATE'} variant={'contained'} type={'submit'} isFullWidth></MTButton>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <div>
                                    <Link component={'button'} variant={'body2'} underline="always" onClick={() => navigate('/')} sx={{
                                        fontSize: '16px'
                                    }}>I don't want to create my business right now.</Link>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alertMessage.status} variant="filled" sx={{ width: '100%' }}>
                            {alertMessage.message}
                        </Alert>
                    </Snackbar>
                </div>
            </Paper>
        </div>
    );
}