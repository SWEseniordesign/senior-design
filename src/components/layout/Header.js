import { AppBar, Typography, Toolbar, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";
import React from "react";

const useStyles = makeStyles({
    toolBar: {
        height: '8%',
        backgroundColor: 'grey',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logoTitle: {
        height: '100%',
        width: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '42px'
    }
});

const Header = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    const classes = useStyles();

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar className={classes.toolBar}>
                    <div className={classes.logoTitle}>
                        <Typography className={classes.title}>myTill</Typography>
                    </div>
                    <Button variant="contained" onClick={handleLogin}>Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;