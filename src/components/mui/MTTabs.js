import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab, Typography, Box, Skeleton, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { tabState } from "../../states/tabState";
import { ListTabsModel } from "../till/ListTabsModel";
import { AddTabModal } from "../till/AddTabModal";
import { AddCardModal } from "../../components/till/AddCardModal";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AddItemModal } from "../../components/till/AddItemModal";
import { Responsive, WidthProvider } from "react-grid-layout";
import { COLOR_PALETTE } from "../../Constants";
import { getTab } from "../../requests/tabs-req";
import { getCard } from "../../requests/cards-req";
import { useQuery } from "react-query";
import { none, useHookstate } from "@hookstate/core";


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
    }
})

// Can be removed once the backend call is created/called
const c = [
    {id: 0, label: 'Test1', dimensions: {x: 0, y: 0, w: 1, h: 2} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false},
    {id: 1, label: "Test2", dimensions: {x: 1, y: 0, w: 1, h: 2} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false},
    {id: 2, label: "Test3", dimensions: {x: 2, y: 0, w: 1, h: 1} , color: 'beige', items: [{id: 0, label: 'ITEM'}, {id: 1, label: 'ITEM'}, {id: 2, label: 'ITEM'}, {id: 3, label: 'ITEM'}], static: false}
]

export const MTTabs = (props) => {

    const {till, openEditModal, setOpenEditModal, children, isEdit, tillDataIsLoading} = props;

    const [value, setValue] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [openAddCard, setOpenAddCard] = useState(false);
    const [testCards, setTestCards] = useState();
    const [cardItems, setCardItems] = useState([]);
    const [selectedTabId, setSelectedTabId] = useState('');
    const localTabState = useHookstate(tabState);

    const {isLoading: tabsDataIsLoading, data: tabs, refetch: fetchTabs} = useQuery("tabs", () => getTab({id: till?.formattedTill.tabs[0]}), { enabled: false });
    const {isLoading: cardsDataIsLoading, data: cards, refetch: fetchCards} = useQuery("cards", () => getCard({id: tabs?.formattedTab.cards[0]}), { enabled: false }); //! This should be a call where we give it a tab id and it grabs all the cards for the tab.

    const ResponsiveLayout = WidthProvider(Responsive);

    useEffect(() => {
        if(till?.formattedTill.tabs.length > 0){
            fetchTabs();
            if(tabs?.formattedTab.cards.length > 0){
                if(cards?.formattedCard.items.length > 0){
                    setTestCards([cards?.formattedCard]);
                } else {
                    fetchCards();
                    localTabState.tabs[localTabState.tabs.get().length-1].set(none);
                    localTabState.tabs.merge([tabs.formattedTab])
                    localTabState.tabs.merge([{id: -1, name: '+', canAdd: true}])
                }
            }
        }
    }, [till, tabs, cards])

    const tabChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    }

    //* Sets the openAddCard state to true to open the addCard modal.
    const handleAddCard = () => {
        setOpenAddCard(true);
    }

    //* Finds the specific card that you want to add an item to, then set the cardItems state to the items of the specific card + sets the openAddItem state to true to open the addItem modal.
    const handleAddItem = (e, i) => {
        let card = testCards.find((card) => card.id === i);
        setCardItems(card.items);
        setOpenAddItem(true);
    }

    //* Filters out the card that wants to be removed.
    const removeCard = (e, i) => {
        let newCards = testCards?.filter((card) => card.id !== i);
        newCards = newCards.map((card) => {
            if(card.id > i){
                card.id = card.id - 1;
            }
            return card;
        })
        setTestCards(newCards);
    }

    //* Changes the static property of the card to unlock/lock it.
    const changeLockStatus = (e, cardId) => {
        let newCards = testCards?.map((card) => {
            if(card.id === cardId){
                card.static = !card.static
            }
            return card;
        })
        setTestCards(newCards);
    }

    //* Sets new dimensions to the card that has been moved.
    const handleLayoutChange = (e) => {
        testCards?.map((card, i) => {
            if(card.id.toString() === e[i].i){
                card.dimensions.x = e[i].x;
                card.dimensions.y = e[i].y;
                card.dimensions.w = e[i].w;
                card.dimensions.h = e[i].h;
            }
            return card;
        })
    }

    //* Initializes the layout of the cards.
    const createLayout = () => {
        let layout = [];
        if(!!(testCards) && testCards?.length !== 0){
            layout = testCards?.map((card, index) => {
                return {
                    i: index.toString(), 
                    x: card.dimensions.x === null ? 0 : card.dimensions.x, 
                    y: card.dimensions.y === null ? 0 : card.dimensions.y, 
                    w: card.dimensions.w === null ? 1 : card.dimensions.w, 
                    h: card.dimensions.h === null ? 1 : card.dimensions.h,
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

    const addTabStyle = {
        fontSize: '16px',
        bgcolor: 'lightgrey',
        opacity: '0.5'
    }


    const classes = useStyle();

    return (
        <div className={classes.root}>
            <TabContext value={value}>
                <div className={classes.tabBar}>
                    <TabList onChange={tabChange}>
                        {tabState.tabs.get().map((tab, i) => {
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
                                        onClick={(e) => setSelectedTabId(tab.id)} />
                            }   
                        })}
                    </TabList>
                </div>
                {localTabState.tabs.get()?.map((tab) => {
                    <TabPanel value={value} index={value}>
                        {isEdit ? !tillDataIsLoading ? 
                            <ResponsiveLayout 
                                className={classes.layout} 
                                layouts={{lg: createLayout()}} 
                                draggableHandle=".draggableHandle"
                                cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }} 
                                onLayoutChange={(e) => handleLayoutChange(e)}
                                >
                                {testCards?.map((card, index) => {
                                    return  <div key={index.toString()}>
                                                <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                    <div className={classes.cardTitleBar}>
                                                        <Typography variant={'h5'} sx={{marginLeft: '12px'}}>{card.name}</Typography>
                                                        <div className='draggableHandle'>
                                                            {Array.from(Array(6), (e, i) => {
                                                                return <div key={i} className={classes.dragDots} />
                                                            })}
                                                        </div>
                                                        <div>
                                                            {card.static ? 
                                                                <IconButton size="small" onClick={(e) => changeLockStatus(e, index)}>
                                                                    <LockIcon fontSize="small" />
                                                                </IconButton> 
                                                                :
                                                                <IconButton size="small" onClick={(e) => changeLockStatus(e, index)}>
                                                                    <LockOpenIcon fontSize="small" />
                                                                </IconButton>
                                                            }
                                                            <IconButton size="small" onClick={(e) => removeCard(e, index)}>
                                                                    <HighlightOffIcon fontSize="small" />
                                                            </IconButton>
                                                        </div>
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
                                                        <div id={index} style={{gridColumn: 1 / 2, cursor: "pointer"}} onClick={(e) => handleAddItem(e, index)}>
                                                            <Box className={classes.item}>
                                                                <Typography>+</Typography>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                </Box>
                                                <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={cardItems} />
                                            </div>
                                            
                                })}
                                <div key={!!(testCards) ? (testCards.length).toString() : 0}>
                                    <Box className={classes.addCard} sx={{backgroundColor: 'lightgrey'}} onClick={() => handleAddCard()}>
                                        <Typography variant="h6">+</Typography>
                                    </Box>
                                    <AddCardModal open={openAddCard} setOpen={setOpenAddCard} cards={testCards} />
                                </div>
                            </ResponsiveLayout>
                            : <Skeleton className={classes.loader} variant={'rectangle'} />
                        : 
                            <ResponsiveLayout 
                                className={classes.layout} 
                                layouts={{lg: createLayout()}} 
                                cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }} 
                                >
                                {testCards?.map((card, index) => {
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
                                                <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={card.items} />
                                            </div>
                                })}
                            </ResponsiveLayout>
                        }
                    </TabPanel>
                })}
            </TabContext>
            {openAddModal && <AddTabModal open={openAddModal} setOpen={setOpenAddModal} />}
            {openEditModal && <ListTabsModel open={openEditModal} setOpen={setOpenEditModal} />}
        </div>
    )
}