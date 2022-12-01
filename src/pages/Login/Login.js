import { Button, Grid, Paper, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { login } from "../../requests/users-req";

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

export const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [dbEmail, setDbEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dBPassword, setdBPassword] = useState('');
    //const [passwordError, setPasswordError] = useState(false);
    //const [emailError, setEmailError] = useState(false);
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
            if(email.includes("@")){
                let userCreds = {
                    email: email,
                    password: password
                }
                let error = await login(userCreds);

                if(error.code === 403){
                    setAlertMessage({message: error.err, status: 'warning'});
                } else {
                    setAlertMessage({message: 'Logged in!', status: 'success'})
                }

                setOpen(true);
                formSubmitted_ResetValues();
            }
        } catch(e){
            console.log('dn');
        }

    }

    const formSubmitted_ResetValues = () => {
        setEmail('');
        setPassword('');
    }

    //TODO: instead of this check if email/pass exists? Or already done in auth
    /*useEffect(() => {
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
    }, [email, password]);*/


    //CHECK: autocompletes and Snackbar
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
                        }}>Login</Typography>
                        <Typography sx={{
                            fontFamily: FONT_FAMILY,
                            fontSize: '20px',
                            lineHeight: '28px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>Enter your credentials</Typography>
                    </div>
                    <form id="login-form" onSubmit={handleSubmit}>
                        <Grid container rowSpacing={3}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label='Email'
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    //error={emailError}
                                    //helperText={emailError ? "Emails does not match" : (!email.includes("@") && email.length !== 0) ? "Not a valid email" : " " }
                                    //autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label='Password'
                                    type='password'
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    //error={passwordError}
                                    //helperText={passwordError ? "Passwords does not match" : " "}
                                    //autoComplete="new-password"
                                    sx={{ width: '80%'}}/>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <div className={classes.buttons_container}>
                                    <Button variant='contained' type="submit" className={classes.create_button}>LOGIN</Button>
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