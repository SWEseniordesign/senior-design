import React, { useState } from "react";
import { Typography, Menu, MenuItem, Button } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const MTDropdown = (props) => {

    const [anchorElBusiness, setAnchorElBusiness] = useState(null);
    const {label, menuItems=[], variant} = props;

    const handleOpenMenu = (e) => {
        setAnchorElBusiness(e.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorElBusiness(null);
    }

    return (
        <div>
            <Button variant={variant} endIcon={<ArrowDropDownIcon/>} onClick={handleOpenMenu}>{label}</Button>
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
                onClose={handleCloseMenu}>
                {menuItems.map((item) => {
                    return (
                        <MenuItem key={item.id} onClick={item.action}>
                            <Typography>{item.title}</Typography>
                        </MenuItem>        
                    );
                })}
            </Menu>
        </div>
    );
}

export default MTDropdown;