import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";

const useStyle = makeStyles({
    root: {
        height: 'calc(100vh - 101px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        height: '60%',
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
        marginTop: '20px'
    }

});

export const CreateAccount = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [textFieldError, setTextFieldError] = useState(false);
    const [isCreateDisabled, setIsCreateDisabled] = useState(true);

    const classes = useStyle();

    const handleCreateAccount = () => {
        if(password.length === 0){
            setTextFieldError(!textFieldError);
        }
    }

    useEffect(() => {
        if(firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0){
            setIsCreateDisabled(false);
        } else {
            setIsCreateDisabled(true)
        }
    }, [firstName, lastName, email, password]);

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
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField label='First Name' onChange={(e) => setFirstName(e.target.value)} sx={{ width: '80%'}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label='Last Name' onChange={(e) => setLastName(e.target.value)} sx={{ width: '80%'}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label='Email' onChange={(e) => setEmail(e.target.value)} sx={{ width: '80%'}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label='Confirm Email' onChange={(e) => console.log(e.target.value)} sx={{ width: '80%'}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label='Password' type='password' onChange={(e) => setPassword(e.target.value)} error={textFieldError} sx={{ width: '80%'}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label='Confirm Password' type='password' onChange={(e) => console.log(e.target.value)} sx={{ width: '80%'}}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className={classes.buttons_container}>
                                <Button variant='contained' disabled={isCreateDisabled} onClick={() => handleCreateAccount()} sx={{
                                    backgroundColor: COLOR_PALETTE.BLUE_GROTTO,
                                    height: '50px',
                                    width: '40%'
                                }}>Create</Button>
                                <Button variant='outlined' sx={{
                                    height: '50px',
                                    width: '40%'
                                }}>Cancel</Button>
                            </div>
                        </Grid>
                    </Grid>

                </div>
            </Paper>
        </div>
    );
}