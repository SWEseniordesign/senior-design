import { Typography, Button, Grid, Box, Link } from "@mui/material";
import Image from 'mui-image';
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { useNavigate } from "react-router";
import { userState } from "../../states/userState";
import { useHookstate } from "@hookstate/core";

import workersPic from "../../resources/HomePictures/fast-food-workers.jpeg";
import cashierPic from "../../resources/HomePictures/cashier.jpeg";
import tillPic from "../../resources/HomePictures/till-sc.png";

import { createEmployee, getEmployee } from "../../requests/employees-req";
import { createBusiness, getBusiness, addAdmins } from "../../requests/businesses-req";
import { createTill, getTill } from "../../requests/tills-req";
import { createTab, getTab } from "../../requests/tabs-req";
import { createCard, getCard } from "../../requests/cards-req";
import { createItem, getItem } from "../../requests/items-req";
import { getUserBusiness, saveUser } from "../../requests/users-req";

const useStyle = makeStyles({
    root: {
        //display: 'flex',
        //margin: '80px',
        //marginLeft: '240px',
        //marginRight: '240px',
        marginLeft: '16%',
        marginRight: '16%'
    },
    heroSection: {
        marginTop: '160px',
        marginBottom: '140px',
        width: '70%',
        //display: 'flex',
        //justifyContent: 'center',
    },
    heroTitle: {
        display: 'flex',
        marginTop: '40px',
        alignItems: 'center',
        justifyContent: 'center,'
    },
    buttonBox: {
        display: 'flex',
        //justifyContent: 'center',
        //justify-content: 'space-evenly',
        align: 'center',
        items: 'center',
        flexDirection: 'box',
        gap: '16px',
        marginTop: '32px'
    },
    singleSectionBox: {
        width: '100%',
        marginTop: '120px',
        marginBottom: '200px'
    },
    smallTitle: {
        marginBottom: '22px'
    },
    steps: { //remove this?
        width: '100%'
        //display: 'flex',
        //flexDirection: 'row'
      },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        borderRadius: '6px',
        marginTop: '25px'
    },
    endPage: {
        marginBottom: '240px'
    }

});

export const Home = () => {

    const classes = useStyle();
    const uState = useHookstate(userState);

    const navigate = useNavigate();
    const handleSignUp = () => {
        navigate('/create-account');
    }

    const handleLogin = () => {
        navigate('/login');
    }

    //This is temporary to allow me to test creating data
    const handleCreateData = async () => {
        let employee = {
            email: 'bob@unb.ca',
            isManager: false
        };
        let business = {
            name: 'Larrys Fryss',
            ownerId: '63c866337fd04bd174567bc1',
            type: 'Wholesale',
            admins: [],
            tills: []
        };
        let businessAdmins = {
            name: 'McDonalds',
            admins: ['6377f3e996d92774ba4dcce8']
        }
        
        let tab = {
            tillId: '63be021d79729847f8035ba9',
            name: 'Drinks',
            color: 'blue',
            cards: []
        }
        let card = {
            tabId: '63c44024140e3d9f771083c8',
            name: 'Dog',
            color: 'yellow',
            dimensions: {x: 1, y: 2, width: 3, height: 4},
            items: []
        }
        let cardId = {id: '63c4454e4ffdaf5afa747913'};
        let item = {
            cardId: '63c44500cc60f58fb8b2b1f3',
            name: 'test dog',
            price: 20,
            image: null,
            props: [],
            stock: 55
        }
        let user = {
            fname: 'Colby',
            lname: 'Bruh',
            email: 'cBruh@bruh.bruh',
            password: 'balls',
            businessId: '63c03e39d4e646c1151dd54c'
        };
        let till = {
            businessId: '63c00db199361ea1767b451e',
            name: null,
            managerPassword: '99999',
            employees: [],
            tabs: [],
            props: []
        };
        let userId = {id: '63c450b6f3dcafbb59f7ece5'};


        let id = {email: 'test@unb.ca'};
        
        let error = await getEmployee(id);

        
        console.log(error);
    }

    return (
        <div className={classes.root}>
            <div className={classes.heroSection}>
                <div className={classes.heroTitle}>
                    <Typography sx={{fontSize: '64px', fontWeight: 'bold', lineHeight: '66px', alignContent: 'center', justifyContent: 'center'}}>A customized sales experience.</Typography>
                </div>
                {uState.token.get() === "" ?
                <div className={classes.buttonBox}>
                    <Button variant="contained" onClick={handleSignUp} sx={{background: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>SIGN UP</Button>
                    <Button variant="outlined" onClick={handleLogin} sx={{color: COLOR_PALETTE.NAVY_BLUE, borderColor: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>LOG IN</Button>
                    { <Button variant="contained" onClick={handleCreateData} sx={{background: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>CREATE DATA</Button> }
                </div>
                :
                <div className={classes.buttonBox}>
                    { <Button variant="contained" onClick={handleCreateData} sx={{background: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>CREATE DATA</Button> }
                </div>
                }
            </div>
            <div className={classes.singleSectionBox}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <Image sx={{borderRadius: '6px'}} src={cashierPic} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{width: '100%', height: 300, paddingRight: '20px'}}>
                            <div className={classes.smallTitle}>
                                <Typography sx={{fontSize: '32px', lineHeight: '38px', fontWeight: '600'}}>
                                    Secure and seamless access to your till.
                                </Typography>
                            </div>
                            <Typography sx={{fontSize: '18px'}}>
                                Employees can login at the start of their shift, and their access will timeout once their shift is over.  The till won't open until a manager enters their password.
                            </Typography>
                        </Box>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Box sx={{width: '100%', height: 300, paddingRight: '20px'}}>
                            <div className={classes.smallTitle}>
                                <Typography sx={{fontSize: '32px', lineHeight: '38px', fontWeight: '600'}}>
                                    A solution that grows with your business.
                                </Typography>
                            </div>
                            <Typography sx={{fontSize: '18px'}}>
                            New employees and managers can easily be added to your till at any time.  A flexible customization system allows you to make changes whenever, from wherever.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Image sx={{borderRadius: '6px'}} src={workersPic} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Image sx={{borderRadius: '6px'}} src={tillPic} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{width: '100%', height: 300, paddingRight: '20px'}}>
                            <div className={classes.smallTitle}>
                                <Typography sx={{fontSize: '32px', lineHeight: '38px', fontWeight: '600'}}>
                                    Bring your vision to life.
                                </Typography>
                            </div>
                            <Typography sx={{fontSize: '18px'}}>
                                Every business is unique, so we allow you to craft a till that is personalized to your needs.  MyTill allows you to edit the complete look and feel of your menu, right down to the colors.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{width: '100%', height: 300, paddingRight: '20px'}}>
                            <div className={classes.smallTitle}>
                                <Typography sx={{fontSize: '32px', lineHeight: '38px', fontWeight: '600'}}>
                                    Helping you keep up on your busiest days.
                                </Typography>
                            </div>
                            <Typography sx={{fontSize: '18px'}}>
                                Organize your till items to make them effortlessly findable when things get hectic.  Our tills also include a search bar, for when you just can't find that one item.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Image sx={{borderRadius: '6px'}} src={tillPic} />
                    </Grid>
                </Grid>
            </div>

            <div className={classes.smallTitle}>
                <Typography sx={{fontSize: '48px', fontWeight: 'bold'}}>
                    How it works
                </Typography>
            </div>
            <div className={classes.steps}>
                <Grid container spacing={8}>

                    <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{width: '100%', height: '100%', padding: '18px', color: 'white', backgroundColor: COLOR_PALETTE.NAVY_BLUE, borderRadius: '6px'}}>
                                <div className={classes.smallTitle}>
                                    <Typography sx={{fontSize: '28px', lineHeight: '34px', fontWeight: '600'}}>
                                        1. Sign up
                                    </Typography>
                                </div>
                                <Typography sx={{fontSize: '18px', lineHeight: '22px'}}>
                                    Create a busines owner account by signing up on our website.  Our till templates will be catered to your business type.
                                </Typography>
                                <Typography sx={{fontSize: '21px', marginTop: 2, color: COLOR_PALETTE.BABY_BLUE}}>
                                <Link href="create-account" underline="hover" color={COLOR_PALETTE.BLUE_GROTTO}>
                                    {'Get started'}
                                </Link>
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{width: '100%', height: '100%', padding: '18px', color: 'white', backgroundColor: COLOR_PALETTE.NAVY_BLUE, borderRadius: '6px'}}>
                                <div className={classes.smallTitle}>
                                    <Typography sx={{fontSize: '28px', lineHeight: '34px', fontWeight: '600'}}>
                                        2. Create till
                                    </Typography>
                                </div>
                                <Typography sx={{fontSize: '18px', lineHeight: '22px'}}>
                                    Till creation is quicker than ever with MyTill. Conveniently drag and drop your items, categories, and tabs.  Edit the colors and images to make it your own.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{width: '100%', height: '100%', padding: '18px', color: 'white', backgroundColor: COLOR_PALETTE.NAVY_BLUE, borderRadius: '6px'}}>
                                <div className={classes.smallTitle}>
                                    <Typography sx={{fontSize: '28px', lineHeight: '34px', fontWeight: '600'}}>
                                        3. Add employees & managers
                                    </Typography>
                                </div>
                                <Typography sx={{fontSize: '18px', lineHeight: '22px'}}>
                                    Add your employees and managers to your till.  Don't worry - they can always be added or removed later.  A special till access password will be generated for each manager.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{width: '100%', height: '100%', padding: '18px', color: 'white', backgroundColor: COLOR_PALETTE.NAVY_BLUE, borderRadius: '6px'}}>
                                <div className={classes.smallTitle}>
                                    <Typography sx={{fontSize: '28px', lineHeight: '34px', fontWeight: '600'}}>
                                        4. Start selling
                                    </Typography>
                                </div>
                                <Typography sx={{fontSize: '18px', lineHeight: '22px'}}>
                                    Your till can now be accessed by your employees and managers from any device.  Changes to the employees, managers, items, and arrangement of your tills can be changed at any time.
                                </Typography>
                            </Box>
                        </Grid>
                </Grid>

            </div>
            <div className={classes.endPage}>
            </div>
        </div>
    );
}