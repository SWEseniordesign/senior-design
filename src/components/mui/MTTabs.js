import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab, Typography, Box, IconButton, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { tabState } from "../../states/tabState";
import { ListTabsModel } from "../till/ListTabsModel";
import { AddTabModal } from "../till/AddTabModal";
import { AddCardModal } from "../../components/till/AddCardModal";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { AddItemModal } from "../../components/till/AddItemModal";
import { Responsive, WidthProvider } from "react-grid-layout";
import { COLOR_PALETTE } from "../../Constants";
import { getAllTabs } from "../../requests/tabs-req";
import { getAllCards, modifyCardPosition } from "../../requests/cards-req";
import { useQuery } from "react-query";
import { none, useHookstate } from "@hookstate/core";
import './MTTabs.css'
import MTDropdown from "./MTDropdown";


const useStyle = makeStyles({
    root: {
        width: '100%',
    },
    tabBar: {
        width: 'inherit',
        borderBottom: '1px solid black',
    },
    addTab: {

    },
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
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
        gap: '12px',
        height: '100%',
    },
    grid: {
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: '32% 32% 32%',
        margin: '12px',

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
        border: '2px solid black'
    },
    dragDots: {
        height: '2px',
        width: '2px',
        backgroundColor: COLOR_PALETTE.NAVY_BLUE,
        opacity: 0.7,
    },
    addCard: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    },
    loader: {
        width: '100%',
        height: '100%'
    },
    itemControls: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: '1px solid lightgrey',
        overflowWrap: 'break-word',
    }
})

export const MTTabs = (props) => {

    const {till, openEditModal, setOpenEditModal, isEdit, isLoadingTill} = props;

    const [value, setValue] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [openAddCard, setOpenAddCard] = useState(false);
    const [localCards, setLocalCards] = useState([]);
    const [cardItems, setCardItems] = useState([]);
    const [selectedTabId, setSelectedTabId] = useState('');
    const localTabState = useHookstate(tabState);

    const {isLoading: isLoadingTabs, data: tabs, refetch: fetchTabs} = useQuery("tabs", () => getAllTabs({tillId: till?.formattedTill.id}), { enabled: false });
    const {isLoading: isLoadingCards, data: cards, refetch: fetchCards} = useQuery("cards", () => getAllCards({tabId: selectedTabId}), { enabled: false });

    const ResponsiveLayout = WidthProvider(Responsive);

    useEffect(() => {
        if(!openAddModal){
            localTabState.tabs.set([]);
            fetchTabs();
        }
    }, [openAddModal])

    useEffect(() => {
        if(till?.formattedTill?.tabs.length > 0){
            if(!(tabs?.err) && tabs?.tabs.length > 0){
                localTabState.tabs[localTabState.tabs.get().length-1].set(none);
                localTabState.tabs.merge(tabs.tabs)
                setSelectedTabId(tabs.tabs[0].id);
                localTabState.tabs.merge([{id: -1, name: '+', canAdd: true}])
            }
        }
    }, [till, tabs]);

    useEffect(() => {
        if(selectedTabId !== ''){
            fetchCards();
        }
    }, [selectedTabId]);

    useEffect(() => {
        setLocalCards(!!(cards?.cards) ? cards?.cards : []);
    }, [cards]);

    //* Handles updating the selected tabId
    const handleTabId = (tabID) => {
        if(tabID !== selectedTabId){
            setLocalCards([]); 
            setSelectedTabId(tabID);
        }
    }

    //* Handles tab change
    const tabChange = (event, newValue) => {
        setValue(newValue)
    }

    //* Sets the openAddModal to true
    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    }

    //* Sets the openAddCard state to true to open the addCard modal.
    const handleAddCard = () => {
        setOpenAddCard(true);
    }

    //* Finds the specific card that you want to add an item to, then set the cardItems state to the items of the specific card + sets the openAddItem state to true to open the addItem modal.
    const handleAddItem = (e, i) => {
        let card = localCards?.find((card) => card.id === i);
        setCardItems([card, [card.items]]);
        setOpenAddItem(true);
    }

    //* Filters out the card that wants to be removed.
    const removeCard = (e, i) => {
        let newCards = localCards?.filter((card) => card.id !== i);
        newCards = newCards.map((card) => {
            if(card.id > i){
                card.id = card.id - 1;
            }
            return card;
        })
        setLocalCards(newCards);
    }

    //* Changes the static property of the card to unlock/lock it.
    const changeLockStatus = (e, cardId) => {
        let newCards = localCards?.map((card) => {
            if(card.id === cardId){
                card.static = !card.static
            }
            return card;
        })
        handleLayoutChange(e, true);
        setLocalCards(newCards);
    }

    //* Sets new dimensions to the card that has been moved.
    const handleLayoutChange = (e, updateLock) => {
        let newDimensions;

        localCards?.map(async (card, i) => {
            if(!!(updateLock)){
                newDimensions = {
                    cardId: card.id,
                    x: card.dimensions.x,
                    y: card.dimensions.y,
                    width:card.dimensions.w,
                    height: card.dimensions.h,
                    static: card.static
                }
                await modifyCardPosition(newDimensions);
            } else if(card.dimensions.x !== e[i].x || card.dimensions.y !== e[i].y || card.dimensions.width !== e[i].w || card.dimensions.height !== e[i].h || card.static !== e[i].static){
                card.dimensions.x = e[i].x;
                card.dimensions.y = e[i].y;
                card.dimensions.w = e[i].w;
                card.dimensions.h = e[i].h;
                newDimensions = {
                    cardId: card.id,
                    x: e[i].x,
                    y: e[i].y,
                    width: e[i].w,
                    height: e[i].h,
                    static: card.static
                }
                await modifyCardPosition(newDimensions);
            }
            return card;
        })
    }

    //* Initializes the layout of the cards.
    const createLayout = () => {
        let layout = [];

        if(localCards.length !== 0){
            layout = localCards.map((card, index) => {
                return {
                    i: index.toString(), 
                    x: card.dimensions.x === null ? index : card.dimensions.x, 
                    y: card.dimensions.y === null ? 0 : card.dimensions.y, 
                    w: card.dimensions.width === null || !(card.dimensions.width) ? 1 : card.dimensions.width, 
                    h: card.dimensions.height === null || !(card.dimensions.height) ? 1 : card.dimensions.height,
                    static: isEdit ? card.static : true,
                    resizeHandles: ["se"]
                }
            })
        }

        // Initialize the AddCard option if there is only that option. (No cards in till)
        if(layout.length === 0){
            layout.push({
                i: '0',
                x: 0,
                y: 0,
                w: 1,
                h: 1,
                static: false,
                resizeHandles: []
            });
        } else { // Initialize the AddCard option but if there is cards in the till. 
            layout.push({
                i: layout.length.toString(),
                x: layout[layout.length-1].x === 2 ? 0 : layout[layout.length-1].x + 1,
                y: layout[layout.length-1].x < 2 ? layout[layout.length-1].y : layout[layout.length-1].y + 1,
                w: 1,
                h: 1,
                static: false,
                resizeHandles: []
            });
        }

        return layout
    }

    //* CSS style for the add cards
    const addTabStyle = {
        fontSize: '16px',
        bgcolor: 'rgba(194, 194, 194, 0.5)',
    }

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <TabContext value={value}>
                <div className={classes.tabBar}>
                    <TabList onChange={tabChange}>
                        {localTabState.tabs.get().map((tab, i) => {
                            if(tab.name === '+'){
                                return <Tab 
                                        sx={addTabStyle}
                                        key={tab.id} 
                                        value={tab.id}
                                        onClick={handleOpenAddModal}
                                        label={tab.name} />
                            } else {
                                return <Tab 
                                        sx={{fontSize: '16px', bgcolor: !!(tab.color) ? tab.color : ''}}
                                        key={tab.id} 
                                        value={i}
                                        label={tab.name}
                                        onClick={() => handleTabId(tab.id)} />
                            }   
                        })}
                    </TabList>
                </div>
                    <TabPanel value={value} index={value}>
                        {isEdit ? !isLoadingTabs && !isLoadingCards ? 
                            <ResponsiveLayout 
                                className={classes.layout} 
                                layouts={{lg: createLayout()}} 
                                draggableHandle=".draggableHandle"
                                cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }} 
                                onLayoutChange={(e) => handleLayoutChange(e, false)}
                                >
                                {localCards?.map((card, index) => {
                                    return  <div key={index.toString()}>
                                                <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                    <div className={classes.cardTitleBar}>
                                                        <Typography variant={'h5'} sx={{marginLeft: '12px'}}>{card.name}</Typography>
                                                        <div className='draggableHandle'>
                                                            {Array.from(Array(6), (e, i) => {
                                                                return <div key={i} className={classes.dragDots} />
                                                            })}
                                                        </div>
                                                        <div style={{display: 'flex'}}>
                                                            {card.static ? 
                                                                <IconButton size="small" onClick={(e) => changeLockStatus(e, card.id)}>
                                                                    <LockIcon fontSize="small" />
                                                                </IconButton> 
                                                                :
                                                                <IconButton size="small" onClick={(e) => changeLockStatus(e, card.id)}>
                                                                    <LockOpenIcon fontSize="small" />
                                                                </IconButton>
                                                            }
                                                            <MTDropdown isIconButton menuItems={[
                                                                {id: 1, title: 'Edit', action: () => {}},
                                                                {id: 2, title: 'Delete', action: (e) => removeCard(e, card.id)}
                                                            ]} />
                                                        </div>
                                                    </div>
                                                    <div className={classes.grid} style={{overflowY: card.items.length >= 3 ? 'scroll' : ''}}>
                                                        {card.items.map((item, index) => {
                                                            return (<div key={index} style={{gridColumn: 1 / 2}}>
                                                                        <Box className={classes.item} sx={{
                                                                            bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                                            borderRadius: '10px',
                                                                        }}>
                                                                            {/* <div className={classes.itemControls}>
                                                                                <MTDropdown isIconButton menuItems={[
                                                                                    {id: 1, title: 'Edit', action: () => {}},
                                                                                    {id: 2, title: 'Delete', action: (e) => removeCard(e, card.id)}
                                                                                ]} />
                                                                            </div> */}
                                                                            <Typography>{item.name}</Typography>
                                                                            {!!(item.price) ? <Typography variant={'subtitle2'}>${item.price}</Typography> : ''}
                                                                        </Box>
                                                                    </div>)
                                                        })}
                                                        <div id={index} style={{gridColumn: 1 / 2, cursor: "pointer"}} onClick={(e) => handleAddItem(e, card.id)}>
                                                            <Box className={classes.item} sx={{
                                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                                borderRadius: '10px',
                                                            }}>
                                                                <Typography>+</Typography>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                </Box>
                                                {openAddItem && <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={cardItems[1][0]} card={cardItems[0]} />}
                                            </div>
                                            
                                })}
                                <div key={!!(localCards) ? (localCards.length).toString() : 0}>
                                    <Box className={classes.addCard} sx={{backgroundColor: 'lightgrey'}} onClick={() => handleAddCard()}>
                                        <Typography variant="h6">+</Typography>
                                    </Box>
                                    <AddCardModal open={openAddCard} setOpen={setOpenAddCard} cards={localCards} tabId={selectedTabId} />
                                </div>
                            </ResponsiveLayout>
                            : <Skeleton className={classes.loader} variant={'rectangle'} />
                        : 
                            <ResponsiveLayout 
                                className={classes.layout} 
                                layouts={{lg: createLayout()}} 
                                cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }} 
                                >
                                {localCards.map((card, index) => {
                                    return  <div key={index.toString()}>
                                                <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                    <div className={classes.cardTitleBar}>
                                                        <Typography variant={'h5'} sx={{marginLeft: '12px'}}>{card.name}</Typography>
                                                    </div>
                                                    <div className={classes.grid} style={{overflowY: card.items.length > 3 ? 'scroll' : ''}}>
                                                        {card.items.map((item, index) => {
                                                            return (<div key={index} style={{gridColumn: 1 / 2}}>
                                                                        <Box className={classes.item}>
                                                                            <Typography>{item.name}</Typography>
                                                                            {!!(item.price) ? <Typography>${item.price}</Typography> : ''}
                                                                        </Box>
                                                                    </div>)
                                                        })}
                                                    </div>
                                                </Box>
                                                {/* <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={card.items} /> */}
                                            </div>
                                })}
                            </ResponsiveLayout>
                        }
                    </TabPanel>
            </TabContext>
            {openAddModal && <AddTabModal tillId={till.formattedTill.id} open={openAddModal} setOpen={setOpenAddModal} />}
            {openEditModal && <ListTabsModel open={openEditModal} setOpen={setOpenEditModal} />}
        </div>
    )
}