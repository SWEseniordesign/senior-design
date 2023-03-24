import { Grid, Paper, Typography, Snackbar, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MTButton from "../../components/mui/MTButton";
import MTTextField from "../../components/mui/MTTextField";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { userState } from "../../states/userState";
import { authTill } from "../../requests/tills-req";

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

export const AccessTill = () => {

    const classes = useStyle();

    const navigate = useNavigate();

    const [tillid, setTillID] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState();


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            let empCreds = {
                tillid: tillid,
                email: email,
                password: password
            }
            let tillResponse = await authTill(empCreds);

            console.log(tillResponse);

            if(!!(tillResponse.err)){
                setAlertMessage({message: tillResponse.err, status: 'warning'});
            } else if(!!(tillResponse.token)) {
                userState.token.set(tillResponse.token);
                userState.employee.set(tillResponse.employeeObj);
                userState.tillId.set(tillResponse.tillId);
                navigate(`/view-till/${tillResponse.tillId}`);
            }

            setOpen(true);
        } catch(e){
            console.log('dn');
        }
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
                        }}>Open Till</Typography>
                        <Typography sx={{
                            fontFamily: FONT_FAMILY,
                            fontSize: '20px',
                            lineHeight: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>Enter credentials</Typography>
                    </div>
                    <form id="employee-form" onSubmit={handleSubmit}>
                            <Grid container rowSpacing={3}>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Till ID'
                                        value={tillid}
                                        isRequired
                                        onChangeFunc={setTillID}
                                        isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Employee Email'
                                        type='email'
                                        value={email}
                                        isRequired
                                        onChangeFunc={setEmail}
                                        isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTTextField
                                        label='Manager Password'
                                        type='password'
                                        value={password}
                                        isRequired
                                        hasPasswordHideShow
                                        onChangeFunc={setPassword}
                                        isFullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <MTButton variant='contained' label={"OPEN TILL"} type="submit" isFullWidth />
                                </Grid>
                            </Grid>
                    </form>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alertMessage?.status} variant="filled" sx={{ width: '100%' }}>
                            {alertMessage?.message}
                        </Alert>
                    </Snackbar>
                </div>
            </Paper>
        </div>
    );
}

