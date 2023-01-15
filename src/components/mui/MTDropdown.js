import React, { useState } from "react";
import { Typography, Menu, MenuItem, Button, Tooltip, Avatar, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { COLOR_PALETTE } from "../../Constants";
import { userState } from "../../states/userState";

const MTDropdown = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const {label, menuItems=[], variant, isAccount} = props;

    const handleOpenMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    return (
        <div>
            {!isAccount ? 
                <div>
                    <Button color={'secondary'} variant={variant} endIcon={<ArrowDropDownIcon/>} onClick={handleOpenMenu}>{label}</Button>
                    <Menu 
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}>
                        {menuItems.map((item) => {
                            return (
                                <MenuItem key={item.id} onClick={() => {
                                    item.action();
                                    handleCloseMenu();
                                }}>
                                    <Typography>{item.title}</Typography>
                                </MenuItem>        
                            );
                        })}
                    </Menu>
                </div>
                :
                <div>
                    <Tooltip title={'Account Settings'}>
                        <IconButton onClick={handleOpenMenu}>
                            <Avatar sx={{width: 32, height: 32, bgcolor: COLOR_PALETTE.BLUE_GROTTO}}>{userState.user.get().fname.charAt(0).toUpperCase()}</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu 
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}>
                        {menuItems.map((item) => {
                            return (
                                <MenuItem key={item.id} onClick={() => {
                                    item.action();
                                    handleCloseMenu();
                                }}>
                                    <Typography color={item.title === "Logout" ? 'error' : ''}>{item.title}</Typography>
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </div>
            }
        </div>
    );
}

export default MTDropdown;