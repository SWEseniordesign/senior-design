import React from "react";
import { IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MtButton from "../mui/MTButton";
import { FONT_FAMILY } from "../../Constants"
import { ChevronRight } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { none, useHookstate } from "@hookstate/core";
import { orderState } from "../../states/orderState";
import { createTransaction } from "../../requests/transactions-req";
import { userState } from "../../states/userState";
import missingImage from '../../resources/missing-img.png'

const useStyles = makeStyles({
  drawer: {
    width: 0,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 400,
    borderRight: "none",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  drawerTitle: {
    marginLeft: "16px",
  },
})

const CartDrawer = () => {

  const localOrderState = useHookstate(orderState);

  //* Handles adding item to the cart
  const addItemToCart = (item) => {
    let itemIndex = localOrderState.order.get().findIndex((i) => i.id === item.id);
    if(itemIndex > -1){
        localOrderState.order[itemIndex]['quantity'].set(i => i + 1);
    }
  };

  //* Handles removing items from the cart
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

  //* Get the subtotal of the items in the cart
  const getSubtotal = () => {
      return localOrderState.order.get().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
    
  //* Handles the checkout action for an order
  const handleCheckout = async () => {

    let itemIdArr = [];

    localOrderState.order.get().map((item) => {
      itemIdArr.push(item);
      return undefined;
    });

    let newTransaction = {
      employeeId: localOrderState.employeeId.get(),
      tillId: localOrderState.tillId.get(),
      items: itemIdArr,
      price: (getSubtotal() * 1.15).toFixed(2)
    }

    let transactionResponse = await createTransaction(newTransaction);

    if(!!(transactionResponse.err)){
      console.log(transactionResponse.err);
    } else {
      localOrderState.order.set([]);
    }

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
                    {item.image ?
                    <img src={item.image} alt={item.name} style={{ width: "80px", height: "45px" }} />
                    :
                    <img src={missingImage} alt={item.name} style={{ width: "80px", height: "45px" }} />
                    }
                </ListItemIcon>
                <ListItemText primary={item.name} secondary={`$${item.price.toFixed(2)}`} sx={{marginLeft: 2}}/>
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
                <MtButton variant="contained" disabled={!(userState.employee.get()._id)} onClick={handleCheckout} label={'CHECKOUT'} />
                {!(userState.employee.get()._id) && <Typography variant={"subtitle2"} sx={{marginLeft: '12px'}}>Cannot make transaction. User is a Business Owner</Typography>}
            </ListItem>
        </List>

    </Drawer>

  );
};

export default CartDrawer;
