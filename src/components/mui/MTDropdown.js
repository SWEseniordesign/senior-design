import React, { useState } from "react";
import { Typography, Menu, MenuItem, Button, Tooltip, Avatar, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import { useNavigate } from "react-router-dom";

const MTDropdown = (props) => {

    const navigate = useNavigate();
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
                            <Avatar sx={{width: 32, height: 32, bgcolor: COLOR_PALETTE.BLUE_GROTTO}}>D</Avatar>
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
                            {/* Might want to change this to have the menuItems in an array in which ever file uses the dropdown. So its not specific to one file and can be used throughout the project.*/}
                            <MenuItem onClick={() => {
                                navigate('/create-business');
                                handleCloseMenu();
                            }}>
                                <Typography sx={{
                                    fontFamily: FONT_FAMILY,
                                    fontSize: '12',
                                    color: 'primary'
                                }}>View Business Dashboard</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography sx={{
                                    fontFamily: FONT_FAMILY,
                                    fontSize: '12',
                                    color: 'secondary'
                                }}>Edit Profile</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography color={'error'}>Logout</Typography>
                            </MenuItem>
                    </Menu>
                </div>

            }
        </div>
    );
}

export default MTDropdown;