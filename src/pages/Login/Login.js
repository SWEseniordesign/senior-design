import { Grid, Paper, Typography, Snackbar, Alert, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MTButton from "../../components/mui/MTButton";
import MTTextField from "../../components/mui/MTTextField";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { login } from "../../requests/users-req";
import { userState } from "../../states/userState";
import { isLoggedIn_Redirect } from "../helper/routesHelper";

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
        maxWidth: '500px'
    },
    container: {
        padding: '30px',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title_subtitle: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '24px'
    },
    login: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px'
    }
});

export const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();

    const classes = useStyle();

    useEffect(() => {
        setAlertMessage({message: '', status: 'success'});
    }, [])

    //* Closes the alert that pops up when the user logins or an error occurs.
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    //* Using the email and password inputted by the user, we attempt to login. We get redirected if successful and an alert if we are not.
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            let userCreds = {
                email: email,
                password: password
            }
            let error = await login(userCreds);

            if(!!(error.err)){
                setAlertMessage({message: error.err, status: 'warning'});
            } else if(!!(error.token)) {
                userState.token.set(error.token);
                userState.isLoggedIn.set(true);
                navigate('/');
            }

            setOpen(true);
        } catch(e){
            console.log('dn');
        }
    }

    return (
        <div className={classes.root}>
            {isLoggedIn_Redirect(navigate) && 
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
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>Sign In</Typography>
                        <Typography sx={{
                            fontFamily: FONT_FAMILY,
                            fontSize: '20px',
                            lineHeight: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>Enter your credentials</Typography>
                    </div>
                    <form id="login-form" onSubmit={handleSubmit}>
                            <Grid container rowSpacing={3}>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Email'
                                        type='email'
                                        value={email}
                                        isRequired
                                        onChangeFunc={setEmail}
                                        isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Password'
                                        type='password'
                                        value={password}
                                        isRequired
                                        hasPasswordHideShow
                                        onChangeFunc={setPassword}
                                        isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTButton variant='contained' label={"LOGIN"} type="submit" isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <div className={classes.login}>
                                        <Typography sx={{
                                            fontSize: '16px'
                                        }}>Don't have an account?</Typography>
                                        <Link component={'button'} variant={'body2'} underline="always" onClick={() => navigate('/create-account')} sx={{
                                            fontSize: '16px'
                                        }}>Create an Account</Link>
                                    </div>
                                </Grid>
                            </Grid>
                    </form>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alertMessage?.status} variant="filled" sx={{ width: '100%' }}>
                            {alertMessage?.message}
                        </Alert>
                    </Snackbar>
                </div>
            </Paper>}
        </div>
    );
}