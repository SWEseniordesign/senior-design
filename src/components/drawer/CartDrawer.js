import React, { useState } from "react";
import { IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MtButton from "../mui/MTButton";
import { COLOR_PALETTE, FONT_FAMILY } from "../../Constants"

import { ChevronRight } from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import HamburgerPic from './testItemPics/hamburger.jpg';
import HotdogPic from './testItemPics/hotdog.jpg';
import CocaColaPic from './testItemPics/coca-cola.jpg';
import { none, useHookstate } from "@hookstate/core";
import { orderState } from "../../states/orderState";

const useStyles = makeStyles({
  drawer: {
    width: 0,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 340,
    borderRight: "none",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    //padding
    justifyContent: "flex-end",
  },
  drawerTitle: {
    marginLeft: "16px",
  },
})

const CartDrawer = () => {

  const testCartItems = [
    {id: 0, name: "Hamburger", price: 3.50, quantity: 1, image: HamburgerPic},
    {id: 1, name: "Hotdog", price: 2.00, quantity: 1, image: HotdogPic},
    {id: 2, name: "Coca Cola", price: 1.75, quantity: 1, image: CocaColaPic}
  ]

  const localOrderState = useHookstate(orderState);

  //const [openDrawer, setOpenDrawer] = useState(false);
  //const [cartItems, setCartItems] = useState([]);
  const [cartItems, setCartItems] = useState(testCartItems);

  const addItemToCart = (item) => {
    let itemIndex = localOrderState.order.get().findIndex((i) => i.id === item.id);
    if(itemIndex > -1){
        localOrderState.order[itemIndex]['quantity'].set(i => i + 1);
    }
  };

  const removeItemFromCart = (item) => {

      let itemIndex = localOrderState.order.get().findIndex((i) => i.id === item.id);
      if(itemIndex > -1){
        if(localOrderState.order[itemIndex].get().quantity === 1){
          localOrderState.order[itemIndex].set(none);
        } else {
          localOrderState.order[itemIndex]['quantity'].set(i => i - 1);
        }
      }
  };

  const getSubtotal = () => {
      return localOrderState.order.get().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
    
console.log(localOrderState)
  const handleCheckout = () => {
    let newTransaction = {
      employeeId: '',
      tillId: '',
      items: localOrderState.order.get(),
      price: ''
    }
      console.log("need to add checkout fucntionality");
  };

  const classes = useStyles();
  return (
      <Drawer
        className={classes.drawer}
        classes={{
            paper: classes.drawerPaper,
        }}
        variant="persistent"
        anchor="right"
        open={localOrderState.isOpen.get()}
        >
        <div className={classes.drawerHeader}>
            <IconButton onClick={() => localOrderState.isOpen.set(false)}>
                <ChevronRight />
            </IconButton>
        </div>
        <div className={classes.drawerTitle}>
            <Typography variant='h5' sx={{
              fontFamily: FONT_FAMILY,
              fontWeight: '200',
              fontSize: '28px',
              lineHeight: '36px',
              display: 'flex'}}>
                Cart
            </Typography>
        </div>
        <List style={{overflowY: 'scroll', height: 'calc(100vh - 200px)'}}>
            {localOrderState.order.get().map((item) => (
                <ListItem key={item.id}>
                <ListItemIcon>
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px" }} />
                </ListItemIcon>
                <ListItemText primary={item.name} secondary={`$${item.price.toFixed(2)}`} />
                <IconButton onClick={() => removeItemFromCart(item)}>
                    <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => addItemToCart(item)}>
                    <AddIcon />
                </IconButton>
                <Typography>{`$${(item.price * item.quantity).toFixed(2)}`}</Typography>
                </ListItem>
            ))}
        </List>
        <List sx={{borderTop: '1px solid lightgrey'}}>
            <ListItem>
                <ListItemText primary="Subtotal" />
                <Typography>{`$${getSubtotal().toFixed(2)}`}</Typography>
            </ListItem>
            <ListItem>
                <ListItemText primary="Tax (15%)" />
                <Typography>{`$${(getSubtotal() * 0.15).toFixed(2)}`}</Typography>
            </ListItem>
            <ListItem>
                <ListItemText primary="Total" />
                <Typography>{`$${(getSubtotal() * 1.15).toFixed(2)}`}</Typography>
            </ListItem>
            <ListItem>
                <MtButton variant="contained" onClick={handleCheckout} label={'CHECKOUT'} />
            </ListItem>
        </List>

    </Drawer>

  );
};

export default CartDrawer;
