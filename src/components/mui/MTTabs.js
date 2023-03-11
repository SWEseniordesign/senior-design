import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab, Typography, Box, IconButton, Skeleton, Tooltip } from "@mui/material";
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
import { deleteTab, getAllTabs } from "../../requests/tabs-req";
import { deleteCard, getAllCards, modifyCardPosition } from "../../requests/cards-req";
import { useQuery } from "react-query";
import { none, useHookstate } from "@hookstate/core";
import './MTTabs.css'
import MTDropdown from "./MTDropdown";
import { deleteItem } from "../../requests/items-req";
import { EditItemModal } from "../till/EditItemModal";


const useStyle = makeStyles({
    root: {
        width: '100%',
    },
    tabBar: {
        width: 'inherit',
        borderBottom: `1px solid ${COLOR_PALETTE.NAVY_BLUE}`
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
        gridTemplateColumns: '31% 31% 31%',
        margin: '0px 12px 12px 12px',

        height: '100%',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar':{
            width:0,
        }
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100px',
        maxHeight: '100px',
        border: `1px solid ${COLOR_PALETTE.NAVY_BLUE}`
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
    }
})

export const MTTabs = (props) => {

    const {till, openEditModal, setOpenEditModal, isEdit} = props;

    const [value, setValue] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [openAddCard, setOpenAddCard] = useState(false);
    const [openEditItem, setOpenEditItem] = useState(false);

    const [handleLayoutRefresh, setHandleLayoutRefresh] = useState(false);
    const [localCards, setLocalCards] = useState([]);
    const [cardItems, setCardItems] = useState([]);
    const [selectedTabId, setSelectedTabId] = useState('');
    const localTabState = useHookstate(tabState);

    const {isLoading: isLoadingTabs, data: tabs, refetch: fetchTabs} = useQuery("tabs", () => getAllTabs({tillId: till?.formattedTill.id}), 
    {
        enabled: false, 
        refetchOnWindowFocus: false,
    });
    const {isLoading: isLoadingCards, data: cards, refetch: fetchCards} = useQuery("cards", () => getAllCards({tabId: selectedTabId}), 
    {
        enabled: false, 
        refetchOnWindowFocus: false,
    });

    let itemObject;

    const ResponsiveLayout = WidthProvider(Responsive);

    //* Once we add a new tab or delete a tab, clear the local tab state and re-fetch the tabs
    useEffect(() => {
        if(!openAddModal || !openEditModal){
            if(localTabState.tabs.get().length-1 !== tabs?.tabs.length){
                localTabState.tabs.set([]);
                fetchTabs();
            } else {
                fetchTabs();
            }
        }
    }, [openAddModal, openEditModal])

    //* Once we have the till information and the tab information, we can store the tabs in the local state
    useEffect(() => {
        setHandleLayoutRefresh(false);
        if(till?.formattedTill?.tabs.length > 0){
            if(!(tabs?.err) && tabs?.tabs.length > 0){
                localTabState.tabs[localTabState.tabs.get().length-1].set(none);
                localTabState.tabs.merge(tabs.tabs)
                setSelectedTabId(tabs.tabs[0].id);
                localTabState.tabs.merge([{id: localTabState.tabs.get().length, name: '+', canAdd: true}])
            }
        }
    }, [till, tabs]);

    //* Whenever a tab is selected, refetch the cards
    useEffect(() => {
        setHandleLayoutRefresh(false);
        if(selectedTabId !== ''){
            if(!openAddCard){
                fetchCards();
            } else if(selectedTabId !== ''){
                fetchCards();
            }
        }
    }, [selectedTabId, openAddCard]);

    //* When the cards have been fetched by
    useEffect(() => {
        setLocalCards(!!(cards?.cards) && !(cards.err) ? cards?.cards : []);
        setHandleLayoutRefresh(true);
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

    const handleEditItem = (e, item, card) => {
        setCardItems([item, card]);
        setOpenEditItem(true);
    }

    //* Filters out the card that wants to be removed.
    const removeCard = async (e, i) => {

        let deleteCardResponse = await deleteCard({tabId: selectedTabId, cardId: i});
        if(deleteCardResponse.code === 200){
            let newCards = localCards?.filter((card) => card.id !== i);
            newCards = newCards.map((card) => {
                if(card.id > i){
                    card.id = card.id - 1;
                }
                return card;
            })
            setLocalCards(newCards);
        } else {
            console.log(deleteCardResponse.err);
        }
    }

    //* Filters out the item that wants to be removed.
    const removeItem = async (e, cardId, itemId) => {
        let deleteResponse = await deleteItem({itemId: itemId});
        if(deleteResponse.code === 200){
            let newCards = localCards?.map((card) => {
                if(card.id === cardId){
                    console.log(card.items)
    
                    card.items = card.items.filter((item) => item.id !== itemId);
                }
                return card;
            });
            setLocalCards(newCards);
        } else {
            console.log(deleteResponse.err);
        }
    }

    //* Remove a tab.
    const removeTab = async (e, rowIdToDelete) => {
        let deleteResponse = await deleteTab({tabId: rowIdToDelete, tillId: till.formattedTill.id});
        if(deleteResponse.code === 200){
            localTabState.tabs.get().filter((tab) => tab.id !== rowIdToDelete);
        } else {
            console.log(deleteResponse.err);
        }
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
            createLayout();
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
    const layout = createLayout();

    return (
        <div className={classes.root}>
            <TabContext value={value}>
                <div className={classes.tabBar}>
                    <TabList onChange={tabChange} variant={localTabState.tabs.get().length > 8 ? 'scrollable' : 'standard'}>
                        {localTabState.tabs.get().map((tab, i) => {
                            if(isEdit){
                                if(tab.name === '+'){
                                    return <Tooltip key={i} title={"Add Tab"} arrow>
                                        <Tab
                                            sx={addTabStyle}
                                            key={tab.id} 
                                            value={tab.id}
                                            onClick={handleOpenAddModal}
                                            label={tab.name} /></Tooltip>
                                } else {
                                    return <Tab 
                                            sx={{fontSize: '16px', bgcolor: !!(tab.color) ? tab.color : ''}}
                                            key={i} 
                                            value={i}
                                            label={tab.name}
                                            onClick={() => handleTabId(tab.id)} />
                                }  
                            } else if(!isEdit && tab.name !== '+'){
                                return <Tab 
                                        sx={{fontSize: '16px', bgcolor: !!(tab.color) ? tab.color : ''}}
                                        key={i} 
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
                                layouts={{lg: handleLayoutRefresh ? layout : []}}
                                draggableHandle=".draggableHandle"
                                cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }}
                                rowHeight={175}
                                onLayoutChange={(e) => handleLayoutChange(e, false)}
                                >
                                {localCards?.map((card, index) => {
                                    return  <div key={index.toString()}>
                                                <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                    <div className={classes.cardTitleBar}>
                                                            <Typography variant={'h5'} sx={{
                                                                paddingLeft: '12px',
                                                                overflow: 'hidden',
                                                                width: '40%',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                                borderRadius: '0 0 10px 0'}}>{card.name}</Typography>
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
                                                            <MTDropdown isIconButton tooltip={'Card Options'} menuItems={[
                                                                {id: 1, title: 'Edit', action: () => {}}, //! Still need to do!
                                                                {id: 2, title: 'Delete', action: (e) => removeCard(e, card.id)}
                                                            ]} />
                                                        </div>
                                                    </div>
                                                    <div className={classes.grid} style={{overflowY: card.items.length >= 3 ? 'scroll' : ''}}>
                                                        {card.items.map((item, index) => {
                                                            return (<div key={index} style={{gridColumn: 1 / 2}}>
                                                                        <Box className={classes.item} sx={{
                                                                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                                                                            borderRadius: '10px',
                                                                        }}>
                                                                            <MTDropdown hasDropdownIcon={false} tooltip={'Item Options'} label={item.name} menuItems={[
                                                                                {id: 1, title: 'Edit', action: (e) => handleEditItem(e, item, card)},
                                                                                {id: 2, title: 'Delete', action: (e) => removeItem(e, card.id, item.id)}
                                                                            ]} />
                                                                        </Box>
                                                                    </div>)
                                                        })}
                                                        <div id={index} style={{gridColumn: 1 / 2, cursor: "pointer"}} onClick={(e) => handleAddItem(e, card.id)}>
                                                            <Tooltip key={index} title={"Add Item"} arrow>
                                                                <Box className={classes.item} sx={{
                                                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                                    borderRadius: '10px',
                                                                }}>
                                                                    <Typography>+</Typography>
                                                                </Box>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </Box>
                                                {openEditItem && <EditItemModal open={openEditItem} setOpen={setOpenEditItem} item={cardItems[0]} card={cardItems[1]} />}
                                                {openAddItem && <AddItemModal open={openAddItem} setOpen={setOpenAddItem} items={cardItems[1][0]} card={cardItems[0]} />}
                                            </div>

                                })}
                                <div key={!!(localCards) ? (localCards.length).toString() : 0}>
                                    <Tooltip title={"Add Card"} arrow>
                                        <Box className={classes.addCard} sx={{backgroundColor: 'lightgrey'}} onClick={() => handleAddCard()}>
                                            <Typography variant="h6">+</Typography>
                                        </Box>
                                    </Tooltip>
                                    {openAddCard && <AddCardModal open={openAddCard} setOpen={setOpenAddCard} cards={localCards} tabId={selectedTabId} />}
                                </div>
                            </ResponsiveLayout>
                            : <Skeleton className={classes.loader} variant={'rectangle'} />
                        :
                        !isLoadingTabs && !isLoadingCards ? 
                            localCards.length > 0 ? 
                                <ResponsiveLayout
                                    className={classes.layout}
                                    layouts={{lg: handleLayoutRefresh ? layout : []}}
                                    draggableHandle=".draggableHandle"
                                    cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 2 }}
                                    rowHeight={175}
                                    onLayoutChange={(e) => handleLayoutChange(e, false)}
                                    >
                                    {localCards?.map((card, index) => {
                                        return  <div key={index.toString()}>
                                                    <Box className={classes.card} sx={{backgroundColor: card.color}}>
                                                        <div className={classes.cardTitleBar}>
                                                            <Typography variant={'h5'} sx={{
                                                                paddingLeft: '12px',
                                                                overflow: 'hidden',
                                                                width: '40%',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                                borderRadius: '0 0 10px 0'}}>{card.name}</Typography>
                                                        </div>
                                                        {card.items.length > 0 ? 
                                                            <div className={classes.grid} style={{overflowY: card.items.length >= 3 ? 'scroll' : ''}}>
                                                                {card.items.map((item, index) => {
                                                                    return (<div key={index} style={{gridColumn: 1 / 2}}>
                                                                                <Box className={classes.item} sx={{
                                                                                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                                                    borderRadius: '10px',
                                                                                }}>
                                                                                    <Typography sx={{
                                                                                        textAlign: 'center',
                                                                                    }}>{item.name}</Typography>
                                                                                </Box>
                                                                            </div>)
                                                                })}
                                                            </div>
                                                        :
                                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                                                                <Typography variant={'subtitle'} sx={{ 
                                                                    textAlign: 'center',
                                                                    width: 'fit-content',
                                                                    marginLeft: '10px',
                                                                    padding: '8px 12px 8px 12px',
                                                                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                                    borderRadius: '10px 10px 10px 10px'
                                                                }}>Card does not contain any items.</Typography>                                                                
                                                            </div>
                                                        }
                                                    </Box>
                                                </div>

                                    })}
                                </ResponsiveLayout>
                             : <Typography variant="h6">Tab does not contain any cards.</Typography>
                         : <Skeleton className={classes.loader} variant={'rectangle'} />
                        }
                    </TabPanel>
            </TabContext>
            {openAddModal && <AddTabModal tillId={till.formattedTill.id} open={openAddModal} setOpen={setOpenAddModal} />}
            {openEditModal && <ListTabsModel open={openEditModal} setOpen={setOpenEditModal} deleteTabFunc={removeTab} />}
        </div>
    )
}