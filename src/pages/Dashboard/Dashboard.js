import { Paper, Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants";
import React from "react";

const useStyle = makeStyles({
    root: {
        height: 'calc(100vh - 101px)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        height: '100%',
        width: '100%',
    },
    board: {
        height: '90%',
        width: '90%',
        //padding: '20px',
    },
    container: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    widget: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_PALETTE.BLUE_GROTTO
    },
    tallwidget: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_PALETTE.BLUE_GROTTO
    }
});

export const Dashboard = () => {

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <Paper className={classes.board} elevation={5} sx={{
                backgroundColor: COLOR_PALETTE.BABY_BLUE,
            }}>
                <div className={classes.container}>
                    <Grid container sx={{height: '100%'}} spacing={3}>
                        <Grid container direction="column" item xs={12} md={5} sx={{height: '100%', gap: '24px'}}>
                            <Grid item xs={12} md={4}>
                                <div className={classes.widget}>
                                    <Typography variant='h4'> Title </Typography>
                                    <Typography variant='subtitle1'> Subtitle </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <div className={classes.widget}>
                                    <Typography variant='h4'> Title2</Typography>
                                    <Typography variant='subtitle1'> Subtitle2 </Typography>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item sx={{height: '100%'}} xs={12} md={7}>
                            <div className={classes.tallwidget}>
                                <Typography variant='h4'> Title3 </Typography>
                                <Typography variant='subtitle1'> Subtitle3 </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </div>
    );
}