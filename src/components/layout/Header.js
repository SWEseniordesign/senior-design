import { AppBar, Typography, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router";
import { COLOR_PALETTE } from "../../Constants";
import React, { useState } from "react";
import MTDropdown from "../mui/MTDropdown";
import MTButton from '../mui/MTButton';
import { userState } from "../../states/userState";
import { pageState } from "../../states/pageState";
import { useHookstate } from "@hookstate/core";
import { getUserBusiness } from "../../requests/users-req";
// import { login } from "../../requests/users-req";

const useStyles = makeStyles({
    toolBar: {
        backgroundColor: COLOR_PALETTE.NAVY_BLUE,
        display: 'flex',
        flexDirection: 'row',
        gap: '30px'
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
        gap: '16px',
        marginLeft: 'auto'
    },
    logo: {
        height: '40px',
        width: '40px'
    },
    dropdownContainer: {
        display: 'flex',
        gap: '12px'
    },
    separator: {
        width: '1px',
        height: '35px',
        opacity: '0.7',
        backgroundColor: COLOR_PALETTE.BABY_BLUE,
    }
});

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const uState = useHookstate(userState);
    const [hasBusiness, setHasBusiness] = useState(false);

    //* Handles an access till button press. It routes the user to the access till page.
    const handleAccessTill = () => {
        navigate('/access-till');
    }
    
    //* Handles a sign up button press. It routes the user to the create account page.
    const handleSignUp = () => {
        pageState.previousPage.set(location.pathname);
        navigate('/create-account');
    }

    //* Handles a home button press. It routes the user to the home page.
    const handleHome = () => {
        navigate('/');
    }

    //* Handles a login button press. It routes the user to the login page.
    const handleLogin = async() => {
        navigate('/login');
    }

    /*   
        * Checks if the user has a business. 
        * Activated when the user opens the avatar dropdown. 
    */
    const userHasBusiness = async() => {
        let response;
        if(userState.token.get() !== ''){
            response = await getUserBusiness();
        }

        if(!!(response)) setHasBusiness(response.business);
    }

    //* MenuItems that are apart of the for employees dropdown.
    const dropdownMenuItems_ForEmployees = [
        {id: 1, title: 'Open Till', action: () => handleAccessTill()}
    ];

    //* MenuItems that are apart of the pages dropdown.
    const dropdownMenuItems_Pages = [
        {id: 1, title: 'About', action: () => {}},
        {id: 2, title: 'Contact Us', action: () => {}}
    ];

    //* MenuItems that are apart of the avatar dropdown.
    const dropdownMenuItems_Account = [
        {id: 1, title: hasBusiness ? 'View Business Dashboard' : 'Create Business', action: () => {
            hasBusiness ? navigate('/dashboard') : navigate('/create-business')
            pageState.previousPage.set(location.pathname)}},
        {id: 2, title: 'Edit Profile', action: () => {}},
        {id: 3, title: 'Logout', action: () => {
            uState.token.set("");
            navigate('/');
            // uState.isLoggedIn.set(false);
            // navigate('/');
        }}
    ];

    const classes = useStyles();

    return (
        <div>
            <AppBar position="static">
                <Toolbar className={classes.toolBar}>
                    <div className={classes.logoTitleContainer} onClick={handleHome}>
                        <Typography sx={{
                            fontSize: '35px',
                            fontFamily: 'Arial',
                            color: COLOR_PALETTE.BABY_BLUE
                        }}>my</Typography>
                        <Typography sx={{
                            fontSize: '35px',
                            fontFamily: 'Arial',
                            color: COLOR_PALETTE.BLUE_GROTTO
                        }}>Till</Typography>
                    </div>
                    <div className={classes.separator}></div>
                    <div className={classes.dropdownContainer}>
                        <MTDropdown hasDropdownIcon label={'Pages'} menuItems={dropdownMenuItems_Pages}/>
                        <MTDropdown hasDropdownIcon label={'For Employees'} menuItems={dropdownMenuItems_ForEmployees}/>
                    </div>
                    {uState.token.get() === "" ?
                        <div className={classes.signUpLoginContainer}>
                            <MTButton variant="contained" onClick={handleLogin} label={'SIGN IN'}/>
                            <MTButton variant="contained" onClick={handleSignUp} label={'CREATE ACCOUNT'} />
                        </div>
                        :
                        <div className={classes.signUpLoginContainer}>
                            <MTDropdown isAccount menuOpenAction={userHasBusiness} menuItems={dropdownMenuItems_Account} />
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;