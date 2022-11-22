import { Typography, Button, Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import css from"./Home.module.css";
import "../../styles/mediaQueries.css";
import { COLOR_PALETTE } from "../../Constants";
import Image from 'mui-image';

import exPic from "./HomePictures/example-pic.jpg";
import workersPic from "./HomePictures/fast-food-workers.jpeg";
import cashierPic from "./HomePictures/cashier.jpeg";
import tillPic from "./HomePictures/till-sc.png";
//import Grid from '@mui/material';
//import { makeStyles } from "@mui/styles";
//grid for layout

const useStyle = makeStyles({
    root: {
        //display: 'flex',
        margin: '80px'
    },
    heroTitle: {
        //display: 'flex',
        marginTop: '40px',
        alignItems: 'center',
        justifyContent: 'center,'
    },
    heroSection: {
        marginTop: '200px',
        width: '800px',
        //display: 'flex',
        //justifyContent: 'center',
    },
    singleSectionBox: {
        width: '100%', //Change to percent?
        marginTop: '120px',
        marginBottom: '200px'
    },
    buttonBox: {
        display: 'flex',
        justifyContent: 'center',
        //justify-content: 'space-evenly',
        align: 'center',
        items: 'center',
        flexDirection: 'box',
        gap: '16px'
    },
    sectionTitle: {
        marginTop: '40px'
    },
    steps: {
        display: 'flex',
        //flexDirection: 'column',
      
        //@media (--viewportMedium) {
            //direction: ''
          flexDirection: 'row',
        //}
      },
      
      step: {
        //@media (--viewportMedium) {
          display: 'flex',
          color: 'white',
          backgroundColor: COLOR_PALETTE.NAVY_BLUE,
          width: '280px',
          //border-radius: '30px',
          padding: '20px',
          margin: '0 auto 0',
          marginRight: '30px'
          /*fix centering after adding margin-right?*/
        //}
      },
      
      stepLast: {
        //@media (--viewportMedium) {
          marginRight: '0',
          color: 'white',
          backgroundColor: COLOR_PALETTE.NAVY_BLUE,
          width: '280px',
          //border-radius: '30px',
          padding: '20px'
        //}
      },
      
      stepTitle: {
        marginTop: '18px',
        marginBottom: '18px'
        //@media (--viewportMedium) {
          //marginTop: '21px',
          //marginBottom: '18px',
        //}
      },
        
    twoColBox: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '0px'
        
        /*@media (--viewportMedium): {
            flex-direction: row;
            margin-top: 33px;
        }*/
    },
        
    colBox: {
        width: '100%',
        marginTop: '25px'
        
        /* Remove link's hover effect */
        /*&:hover {
            text-decoration: none;
        }
        
        @media (--viewportMedium) {
            margin-top: 0;
        }
        @media (--viewportMedium) {
            margin-right: 40px;
            margin-bottom: 0;
        */
    },
    
    imageWrapper: {
        position: 'relative',
        width: '100%',
        borderRadius: '6px',
        marginTop: '25px'
        //transition: var(--transitionStyleButton);
        
        /*&:hover {
            transform: scale(1.02);
            box-shadow: var(--boxShadowSectionLocationHover);
        }*/
    }
        
});

export const Home = () => {

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <div className={classes.heroSection}>
                <div className={classes.heroTitle}>
                    <Typography sx={{fontSize: '60px', alignContent: 'center', justifyContent: 'center'}}>Welcome to my-till!</Typography>
                </div>
                <div className={classes.buttonBox}>
                    <Button variant="contained" sx={{background: COLOR_PALETTE.NAVY_BLUE}}>SIGN UP</Button>
                    <Button variant="outlined" sx={{color: COLOR_PALETTE.NAVY_BLUE, outlineColor: COLOR_PALETTE.NAVY_BLUE}}>LOG IN</Button>
                </div>
            </div>
            <div className={classes.singleSectionBox}>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Image sx={{borderRadius: '6px'}} src={cashierPic} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        Secure and seamless access to your till.  Employees can login at the start of their shift, and their access will timeout once their shift is over.
                    </Grid>
                    <Grid item xs={12} md={6} sx={{marginTop: '40px'}}>
                        <Box sx={{width: 300, height: 300, paddingRight: '20px'}}>
                            <Typography sx={{fontSize: '20px'}}>
                                Add employees and managers to your business's till.  myTill allows for all of an employees needs to be accessed in one place.
                            </Typography>
                        </Box>                    
                    </Grid>
                    <Grid item xs={12} md={6} sx={{marginTop: '40px'}}>
                        <Image sx={{borderRadius: '6px'}} src={workersPic} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Image sx={{borderRadius: '6px', height: 300, width: 300}} src={tillPic} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        Easily customize your till by dragging nand dropping
                    </Grid>
                </Grid>

            </div>
            <Typography sx={{fontSize: '40px', marginTop: 8}}>How it works</Typography>
            <div className={classes.steps}>
                <div className={classes.step}>
                    Sign up
                    Create a busines owner account on our website
                </div>
                <div className={classes.step}>
                    Create till
                    Create and customuze your til using our nflwejf wejnvwl envwekv
                </div>
                <div className={classes.step}>
                    Add employees and managers: krfner knfer lkfjnek rlgnrr gnerlkne rlkv glkge
                </div>
                <div className={classes.stepLast}>
                    Start selling: Your employees can now use your till!
                </div>

            </div>
        </div>
    );
}