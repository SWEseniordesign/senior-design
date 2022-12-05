import { Button, Grid, Paper, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { saveUser } from "../../requests/users-req";

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
    },
    container: {
        padding: '30px'
    },
    title_subtitle: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '24px'
    },
    buttons_container: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    create_button: {
        height: '50px',
        width: '40%',

        '&.MuiButtonBase-root':{
            backgroundColor: COLOR_PALETTE.BLUE_GROTTO,
            '&:hover': {
                color: COLOR_PALETTE.BABY_BLUE,
                backgroundColor: COLOR_PALETTE.NAVY_BLUE
            }
        }
    },
    cancel_button: {
        height: '50px',
        width: '40%',

        '&.MuiButtonBase-root':{
            borderColor: COLOR_PALETTE.NAVY_BLUE,
            '&:hover': {
                color: COLOR_PALETTE.BABY_BLUE,
                backgroundColor: COLOR_PALETTE.NAVY_BLUE
            }
        },
    }

});

export const CreateAccount = () => {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});
    // const {isLoading: isUserCreated, refetch: refetchUser} = useQuery([{
    //     fname: firstName,
    //     lname: lastName,
    //     email: email,
    //     password: password
    // }], saveUser, {enabled: false});

    const classes = useStyle();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if(!emailError && email.includes("@") && !passwordError){
                let newUser = {
                    fname: firstName,
                    lname: lastName,
                    email: email,
                    password: password
                }
                let error = await saveUser(newUser);

                if(error.code === 403){
                    setAlertMessage({message: error.err, status: 'warning'});
                } else {
                    setAlertMessage({message: 'Account Created!', status: 'success'})
                }

                setOpen(true);
                formSubmitted_ResetValues();
            }
        } catch(e){
            console.log('bruh');
        }

    }

    const formSubmitted_ResetValues = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setConfirmEmail('');
        setPassword('');
        setConfirmPassword('');
    }


    useEffect(() => {
        if(password !== confirmPassword){
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
        if(email !== confirmEmail){
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    }, [firstName, lastName, email, password, confirmEmail, confirmPassword]);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={5} sx={{
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
                        <Grid container rowSpacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='First Name'
                                    value={firstName}
                                    required
                                    onChange={(e) => setFirstName(e.target.value)}
                                    helperText=" "
                                    autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Last Name'
                                    value={lastName}
                                    required
                                    onChange={(e) => setLastName(e.target.value)}
                                    helperText=" "
                                    autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Email'
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={emailError}
                                    helperText={emailError ? "Emails does not match" : (!email.includes("@") && email.length !== 0) ? "Not a valid email" : " " }
                                    autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Confirm Email'
                                    value={confirmEmail}
                                    required
                                    onChange={(e) => setConfirmEmail(e.target.value)}
                                    error={emailError}
                                    helperText=" "
                                    autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Password'
                                    type='password'
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={passwordError}
                                    helperText={passwordError ? "Passwords does not match" : " "}
                                    autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Confirm Password'
                                    type='password'
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    error={passwordError}
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className={classes.buttons_container}>
                                    <Button variant='contained' type="submit" className={classes.create_button}>Create</Button>
                                    <Button variant='outlined' onClick={() => navigate('/')} className={classes.cancel_button}>Cancel</Button>
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