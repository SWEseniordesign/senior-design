import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import MtButton from "../../components/mui/MTButton";
import { MTTabs } from "../../components/mui/MTTabs";
import SettingsIcon from '@mui/icons-material/Settings';
import { Responsive, WidthProvider } from "react-grid-layout";
import { AddItemModal } from "../../components/till/AddItemModal";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import './ViewEditTill.css'
import { COLOR_PALETTE } from "../../Constants";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: 'calc(100vh - 75px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    actions: {
        width: '95%',
        height: '60px',
        borderBottom: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px',
        justifyContent: 'space-between'
    },
    action_buttons: {
        display: 'flex',
        gap: '24px'
    },
    tabbar: {
        width: '95%',
        display: 'flex',
        alignItems: 'flex-start',
        // border: '2px solid black'
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        border: '1px solid lightgrey',
        height: '100%'
    },
    cardTitleBar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid grey',
        borderRadius: '5px',
        gap: '12px',
        height: '100%',
        // minHeight: '17vh'
    },
    grid: {
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'auto auto auto',
        padding: '12px',

        height: '100%', 
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar':{
            width:0,
        }
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '7vh',
        height: '100%',
        border: '1px solid lightgrey',
        borderRadius: '5px'
    },
    dragDots: {
        height: '2px',
        width: '2px',
        backgroundColor: COLOR_PALETTE.NAVY_BLUE,
        opacity: 0.4,
    }
    
})

const c = [
    {id: 0, label: 'Test1', dimensions: {x: 0, y: 1, w: 1, h: 2} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false},
    {id: 1, label: "Test2", dimensions: {x: 2, y: 1, w: 2, h: 2} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false},
    {id: 2, label: "Test3", dimensions: {x: 3, y: 3, w: 1, h: 1} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: true}

]

export const ViewEditTill = () => {

    const [isEdit, setIsEdit] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditModel, setOpenEditModal] = useState(false);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [testCards, setTestCards] = useState(c);

    const ResponsiveLayout = WidthProvider(Responsive);

    const changeLockStatus = (e, cardId) => {
        let newCards = testCards.map((card) => {
            if(card.id == cardId){
                card.static = !card.static
            }
            return card;
        })
        setTestCards(newCards);
    }

    const handleLayoutChange = (e) => {
        testCards.map((card, i) => {
            if(card.id.toString() === e[i].i){
                card.dimensions.x = e[i].x;
                card.dimensions.y = e[i].y;
                card.dimensions.w = e[i].w;
                card.dimensions.h = e[i].h;
            }
            return card;
        })
    }

    const createLayout = () => {
        return testCards.map((card, index) => {
            return {
                i: index.toString(), 
                x: card.dimensions.x, 
                y: card.dimensions.y, 
                w: card.dimensions.w, 
                h: card.dimensions.h,
                static: isEdit ? card.static : true,
                resizeHandles: ["se"]
            }
        })
    }

    const classes = useStyles();

    return (
        <div>
            {isEdit ? 
                //? The following JSX is for when the till is being edited. (In edit mode)
                <div className={classes.root}>
                    <div className={classes.actions}>
                        <Typography sx={{
                            fontSize: '24px'
                        }}>Actions</Typography>
                        <div className={classes.action_buttons}>
                            <MtButton label={'Manage Employees'} variant={'outlined'} />
                            <MtButton label={'View Transactions History'} variant={'outlined'} />
                            <MtButton label={'Edit Till'} variant={'outlined'} />
                            <MtButton label={'SAVE'} variant={'contained'} />
                        </div>
                    </div>
                    <div className={classes.tabbar}>
                        <MTTabs openEditModal={openEditModel} setOpenEditModal={setOpenEditModal}>
                            <ResponsiveLayout 
                                className={classes.layout} 
                                layouts={{lg: createLayout()}} 
                                // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} 
                                draggableHandle=".draggableHandle"
                                cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }} 
                                onLayoutChange={(e) => handleLayoutChange(e)}
                                >
                                {testCards.map((card, index) => {
                                    return  <div key={index.toString()}>
                                                <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                    <div className={classes.cardTitleBar}>
                                                        <Typography variant={'h5'} sx={{marginLeft: '12px'}}>{card.label}</Typography>
                                                        <div className='draggableHandle'>
                                                            {Array.from(Array(6), (e, i) => {
                                                                return <div key={i} className={classes.dragDots} />
                                                            })}
                                                        </div>
                                                        {card.static ? 
                                                            <IconButton size="small" onClick={(e) => changeLockStatus(e, index)}>
                                                                <LockIcon fontSize="small" />
                                                            </IconButton> 
                                                            :
                                                            <IconButton size="small" onClick={(e) => changeLockStatus(e, index)}>
                                                                <LockOpenIcon fontSize="small" />
                                                            </IconButton>
                                                        }
                                                    </div>
                                                    <div className={classes.grid} style={{overflowY: card.items.length > 3 ? 'scroll' : ''}}>
                                                        {card.items.map((item, index) => {
                                                            return (<div key={index} style={{gridColumn: 1 / 2}}>
                                                                        <Box className={classes.item}>
                                                                            <Typography>{item.label}</Typography>
                                                                            {!!(item.price) ? <Typography>${item.price}</Typography> : ''}
                                                                        </Box>
                                                                    </div>)
                                                        })}
                                                        <div style={{gridColumn: 1 / 2}} onClick={() => setOpenAddItem(true)}>
                                                            <Box className={classes.item}>
                                                                <Typography>+</Typography>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                </Box>
                                                <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={card.items} />
                                            </div>
                                })}
                            </ResponsiveLayout>
                        </MTTabs>
                        <IconButton size="small" onClick={() => setOpenEditModal((editModal) => !editModal)}>
                            <SettingsIcon fontSize="medium" />
                        </IconButton>
                    </div>
                </div>
            :
            //? The following JSX is for when the till is being viewed as a employee. (Not in edit mode)
            <div className={classes.root}>
                <div className={classes.actions}>
                    <Typography sx={{
                        fontSize: '24px'
                    }}>Actions</Typography>
                    <div className={classes.action_buttons}>
                        <MtButton label={'Manage Employees'} variant={'outlined'} />
                        <MtButton label={'View Transactions History'} variant={'outlined'} />
                        <MtButton label={'Edit Till'} variant={'outlined'} />
                    </div>
                </div>
                <div className={classes.tabbar}>
                    <MTTabs openEditModal={openEditModel} setOpenEditModal={setOpenEditModal}>
                        <ResponsiveLayout 
                            className={classes.layout} 
                            layouts={{lg: createLayout()}} 
                            cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }} 
                            >
                            {testCards.map((card, index) => {
                                return  <div key={index.toString()}>
                                            <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                <div className={classes.cardTitleBar}>
                                                    <Typography variant={'h5'} sx={{marginLeft: '12px'}}>{card.label}</Typography>
                                                </div>
                                                <div className={classes.grid} style={{overflowY: card.items.length > 3 ? 'scroll' : ''}}>
                                                    {card.items.map((item, index) => {
                                                        return (<div key={index} style={{gridColumn: 1 / 2}}>
                                                                    <Box className={classes.item}>
                                                                        <Typography>{item.label}</Typography>
                                                                        {!!(item.price) ? <Typography>${item.price}</Typography> : ''}
                                                                    </Box>
                                                                </div>)
                                                    })}
                                                </div>
                                            </Box>
                                            <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={card.items} />
                                        </div>
                            })}
                        </ResponsiveLayout>
                    </MTTabs>
                </div>
            </div>
        }
        </div>
    )
}

/**
 * <div key={index.toString()} >
                                                <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                    <Typography>{card.label}</Typography>
                                                </Box>
                                        </div>

                                        <Card key={index.toString()} label={card.label} color={card.color} items={card.items} />
 * 
 */