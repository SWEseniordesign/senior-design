import React, { useEffect, useState } from "react";
import { Typography, Menu, MenuItem, Button, Tooltip, Avatar, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { COLOR_PALETTE } from "../../Constants";
import { getUserName } from "../../requests/users-req";
import { useQuery } from "react-query";
import { userState } from "../../states/userState";
import { useHookstate } from "@hookstate/core";

const MTDropdown = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const uState = useHookstate(userState);
    const {label, menuItems=[], variant, isAccount, menuOpenAction} = props; // Parameters that can be passed into the custom dropdown
    const { isLoading: userLoading, data: user, refetch: userRefetch } = useQuery("users", getUserName, { enabled: false });

    //* Handles when the menu (dropdown) opens
    const handleOpenMenu = (e) => {
        if(!!(menuOpenAction)) {
            menuOpenAction()
        }
        setAnchorEl(e.currentTarget)
    }

    //* Handles when the menu (dropdown) closes
    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    useEffect(() => {
        if(uState.token.get() !== ''){
            userRefetch();
        }
    }, [uState.token.get()])

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
                            {/* Update the avatar once we have a update backend fn to get user info */}
                            <Avatar sx={{width: 32, height: 32, bgcolor: COLOR_PALETTE.BLUE_GROTTO}}>{!userLoading ? user?.formattedUser?.fname.charAt(0) : ':)'}</Avatar>
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