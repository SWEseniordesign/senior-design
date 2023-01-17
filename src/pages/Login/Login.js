import { Grid, Paper, Typography, Snackbar, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MTButton from "../../components/mui/MTButton";
import MTTextField from "../../components/mui/MTTextField";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { login } from "../../requests/users-req";
import { userState } from "../../states/userState";

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
    }
});

export const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({message: '', status: 'success'});

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

                if(!!(error.code)){
                    setAlertMessage({message: error.err, status: 'warning'});
                } else if(!!(error.user)) {
                    userState.user.set(error.user);
                    userState.token.set(error.token);
                    userState.isLoggedIn.set(true);
                    navigate('/');
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
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>Login</Typography>
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
                                        onChangeFunc={setPassword}
                                        isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTButton variant='contained' label={"LOGIN"} type="submit" isFullWidth />
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