import { AppBar, Typography, Toolbar, CssBaseline } from "@mui/material";
import React from "react";
import './Header.css';

const Header = () => {
    return (
        <div>
            <AppBar className={'appBar'}>
                <div className={'logoTitle'}>
                    <Typography className={'title'}>myTill</Typography>
                </div>
            </AppBar>
            <Toolbar />
        </div>
    );
}

export default Header;