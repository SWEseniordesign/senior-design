import { AppBar, Typography, Toolbar, Button, MenuItem, Menu } from "@mui/material";
import { makeStyles } from "@mui/styles";
import logoSD from '../../resources/peanutbutterbaby.png';
import { useNavigate } from "react-router";
import { COLOR_PALETTE } from "../../Constants";
import React, { useState } from "react";
import { saveUser, login } from "../../requests/users-req";

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

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [anchorElBusiness, setAnchorElBusiness] = useState(null);

    // Might be worth making a new file in routes for redirecting the user to certain pages. Ex. handleAccessTill

    const handleOpenBusinessMenu = (e) => {
        setAnchorElBusiness(e.currentTarget)
    }

    const handleCloseBusinessMenu = () => {
        setAnchorElBusiness(null);
    }

    const handleIsLoggedIn = (e) => {
        setIsLoggedIn(!isLoggedIn);
    }

    const handleAccessTill = () => {
        navigate('/access-till');
    }
    
    const handleSignUp = () => {
        navigate('/create-account');
    }

    // TODO
    async function handleTemp () {
        let res = await saveUser({
            fname: 'test',
            lname: 'icle',
            email: 'testicle@domain.cum'+Math.floor(Math.random()*100),
            password: 'temp123'
        })
        console.log(res);
    }

    async function handleTemp2 () {
        let res = await login({
            email: 'testicle@domain.cum',
            password: 'temp123'
        })
        console.log(res);
    }

    const handleHome = () => {
        navigate('/');
    }

    const handleLogin = () => {
        navigate('/login');
    }

    const handleCreateBusiness = () => {
        navigate('/create-business');
        handleCloseBusinessMenu();
    }

    const handleAccessBusiness = () => {
        navigate('/access-business');
        handleCloseBusinessMenu();
    }

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
                    <div className={classes.signUpLoginContainer}>
                        {/* Uncomment this for changing the loggedIn state */}
                        {/* <Button variant="contained" onClick={(e) => handleIsLoggedIn()}>Bruh</Button> */}
                        <Button variant="contained" onClick={handleAccessTill}>Access Till</Button>
                        {!isLoggedIn ?
                            <Button variant="contained" onClick={handleLogin}>Login</Button>
                        :   
                            <div>
                                <Button variant="contained" onClick={handleOpenBusinessMenu}>
                                    Business
                                </Button>
                                <Menu 
                                    anchorEl={anchorElBusiness}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    open={Boolean(anchorElBusiness)}
                                    onClose={handleCloseBusinessMenu}>
                                    <MenuItem onClick={handleCreateBusiness}>
                                        <Typography>Create Business</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleAccessBusiness}>
                                        <Typography>Access Business</Typography>
                                    </MenuItem>
                                </Menu>
                            </div>}
                        <Button variant="contained" onClick={handleSignUp}>Create Account</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;