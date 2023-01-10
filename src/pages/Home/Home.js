import { Typography, Button, Grid, Box, Link } from "@mui/material";
import Image from 'mui-image';
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { useNavigate } from "react-router";

import workersPic from "../../resources/HomePictures/fast-food-workers.jpeg";
import cashierPic from "../../resources/HomePictures/cashier.jpeg";
import tillPic from "../../resources/HomePictures/till-sc.png";

import { saveEmployee } from "../../requests/employees-req";
import { createBusiness, getBusiness } from "../../requests/businesses-req";

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
            email: 'test3@unb.ca',
            isManager: true
        };
        let business = {
            name: 'McDonalds',
            ownerId: '6377f3e996d92774ba4dcce8',
            admins: [],
            tills: []
        };
        let error = await getBusiness(business);
        console.log(error);
    }

    return (
        <div className={classes.root}>
            <div className={classes.heroSection}>
                <div className={classes.heroTitle}>
                    <Typography sx={{fontSize: '64px', fontWeight: 'bold', lineHeight: '66px', alignContent: 'center', justifyContent: 'center'}}>A customized sales experience.</Typography>
                </div>
                <div className={classes.buttonBox}>
                    <Button variant="contained" onClick={handleSignUp} sx={{background: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>SIGN UP</Button>
                    <Button variant="outlined" onClick={handleLogin} sx={{color: COLOR_PALETTE.NAVY_BLUE, borderColor: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>LOG IN</Button>
                    <Button variant="contained" onClick={handleCreateData} sx={{background: COLOR_PALETTE.NAVY_BLUE, width: '136px', height: '48px', fontSize: '16px'}}>CREATE DATA</Button>
                </div>
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