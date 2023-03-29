import { Grid, Paper, Typography, Snackbar, Alert, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MTTextField from "../../components/mui/MTTextField";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { saveUser } from "../../requests/users-req";
import MTButton from "../../components/mui/MTButton";
import { createAccount_Redirect } from "../helper/routesHelper";

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
        width: '25%',
    },
    container: {
        padding: '30px'
    },
    title_subtitle: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '50px'
    },
    buttons_container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: '24px'
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    login: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
    }

});

export const CreateAccount = () => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState();
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});

    const classes = useStyle();

    //* Closes the alert
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    //* Using the name, email, and password inputted by the user, we attempt to create a user.
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if(!passwordError){
                let newUser = {
                    fname: firstName,
                    lname: lastName,
                    email: email,
                    password: password,
                    businessId: null
                }
                let error = await saveUser(newUser);

                if(error.code !== 201){
                    setAlertMessage({message: error.err, status: 'warning'});
                    setOpen(true);
                } else {
                    navigate('/login');
                }
            }
        } catch(e){
            console.log(e);
        }

    }

    //* Checks the password and the confirm password to make sure they match
    useEffect(() => {
        if(password === confirmPassword){
            setPasswordError(false);
        }
        let interval = setInterval(() => {
            if(password !== confirmPassword){
                setPasswordError(true);                
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [password, confirmPassword]);

    return (
        <div className={classes.root}>
            {!!(createAccount_Redirect(navigate)) && 
                <Paper className={classes.paper} square elevation={5} sx={{
                    backgroundColor: COLOR_PALETTE.BABY_BLUE
                }}>
                    <div className={classes.container}>
                        <div className={classes.title_subtitle}>
                            <Typography sx={{
                                fontFamily: FONT_FAMILY,
                                fontWeight: '600',
                                fontSize: '48px',
                                lineHeight: '56px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>Create Account</Typography>
                            <Typography sx={{
                                fontFamily: FONT_FAMILY,
                                fontSize: '20px',
                                lineHeight: '28px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>Business Owners Only</Typography>
                        </div>
                        <form id="create-account-form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <MTTextField
                                        label='First Name'
                                        value={firstName}
                                        isRequired
                                        onChangeFunc={setFirstName}
                                        width={'100%'}/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <MTTextField
                                        label='Last Name'
                                        value={lastName}
                                        isRequired
                                        onChangeFunc={setLastName}
                                        width={'100%'}/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Email'
                                        value={email}
                                        variant={'outlined'}
                                        isRequired
                                        type={'email'}
                                        onChangeFunc={setEmail}
                                        width={'100%'}/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Password'
                                        type='password'
                                        value={password}
                                        isRequired
                                        onChangeFunc={setPassword}
                                        hasError={passwordError}
                                        hasPasswordHideShow={true}
                                        width={'100%'}/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Confirm Password'
                                        type='password'
                                        value={confirmPassword}
                                        isRequired
                                        onChangeFunc={setConfirmPassword}
                                        hasError={passwordError}
                                        hasPasswordHideShow={true}
                                        width={'100%'}/>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <div className={classes.buttons_container}>
                                        <MTButton variant='contained' type="submit" label={'Create'} width={'100%'} />
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <div className={classes.login}>
                                        <Typography sx={{
                                                fontSize: '16px'
                                            }}>Already have an account?</Typography>
                                        <Link component={'button'} variant={'body2'} underline="always" onClick={() => navigate('/login')} sx={{
                                            fontSize: '16px'
                                        }}>Sign In</Link>
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
            }
        </div>
    );
}