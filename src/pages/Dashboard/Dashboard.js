import { Paper, Card, Typography, Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
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
    board: {
        height: '90%',
        minHeight: '90%',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        height: '95%',
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    widget: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
});

export const Dashboard = () => {

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <Paper className={classes.board} elevation={5} sx={{
                backgroundColor: COLOR_PALETTE.BABY_BLUE,
            }}>
                <div className={classes.container}>
                    <Grid2 container sx={{height: '100%', width: '100%'}} spacing={2}>
                        <Grid2 id='grid-panel-left' xs={12} md={5} sx={{height: '100%'}}>
                            <Grid2 container sx={{height: '100%', width: '100%', position: 'relative'}}>
                                <Grid2 id='grid-left-top' xs={12} md={12} sx={{position: 'absolute', top:0, left: 0, height: '40%'}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BLUE_GROTTO}} elevation={3}>
                                        <Typography variant='h4'> Title </Typography>
                                        <Typography variant='subtitle1'> Subtitle </Typography>
                                    </Card>
                                </Grid2>
                                <Grid2 id='grid-left-bottom' xs={12} md={12} sx={{position: 'absolute', bottom: 0, left: 0, height: '60%'}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BLUE_GROTTO}} elevation={3}>
                                        <Typography variant='h4'> Title2</Typography>
                                        <Typography variant='subtitle1'> Subtitle2 </Typography>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </Grid2>  
                        <Grid2 id='grid-panel-right' xs={12} md={7} sx={{height: '100%'}}>
                            <Grid2 container sx={{height: '100%', width: '100%', position: 'relative', display: 'flex', alignItems: 'center'}}>
                                <Grid2 id='grid-right' xs={12} md={12} sx={{position: 'absolute', right: 0, height: '100%',}}>
                                    <Card className={classes.widget} sx={{backgroundColor: COLOR_PALETTE.BLUE_GROTTO}} elevation={3}>
                                        <Typography variant='h4'> Title3</Typography>
                                        <Typography variant='subtitle1'> Subtitle3 </Typography>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </div>
            </Paper>
        </div>
    );
}