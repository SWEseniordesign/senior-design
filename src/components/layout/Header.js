import { AppBar, Typography, Toolbar, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import logoSD from '../../resources/logoSD.png';
import { useNavigate } from "react-router";
import { COLOR_PALETTE } from "../../Constants";
import React from "react";

const useStyles = makeStyles({
    toolBar: {
        backgroundColor: COLOR_PALETTE.NAVY_BLUE,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logoTitleContainer: {
        height: '100%',
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
    },
    myTill: {
        fontFamily: 'Arial',
        fontSize: '35px'
    },
    signUpLoginContainer: {
        display: 'flex',
        gap: '16px'
    },
    logo: {
        height: '80px',
        width: '100px'
    }
});

const Header = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }
    
    const handleSignUp = () => {
        navigate('/sign-up');
    }

    const handleHome = () => {
        navigate('/');
    }

    const isLoggedIn = false;

    const classes = useStyles();

    return (
        <div>
            <AppBar position="static">
                <Toolbar className={classes.toolBar}>
                    <div className={classes.logoTitleContainer} onClick={handleHome}>
                        <img src={logoSD} alt="logo" className={classes.logo}/>
                        <Typography sx={{
                            fontSize: '35px',
                            fontFamily: 'Roboto',
                            color: COLOR_PALETTE.BABY_BLUE
                            }}>my-till</Typography>
                    </div>
                    {isLoggedIn ?
                        <Button variant="contained" onClick={handleLogin}>Login</Button>
                    :   
                        <div className={classes.signUpLoginContainer}>
                            <Button variant="contained" onClick={handleLogin}>Access Till</Button>
                            <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;