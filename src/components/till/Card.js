import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";

const useStyle = makeStyles({
    card: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid grey',
        borderRadius: '5px',
        padding: '12px',
        gap: '12px',
    },
    grid: {
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'auto auto auto',

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
        width: '99%',
        height: '99%',
        minHeight: '7vh',
        border: '1px solid lightgrey',
        borderRadius: '5px'
    }
})

export const Card = (props) => {

    const { key, label, color, items } = props;

    const [open, setOpen] = useState(false);

    const classes = useStyle(props);

    return (
        <div key={key} >
            <Box className={classes.card} sx={{backgroundColor: color}}>
                <Typography>{label}</Typography>
            </Box>
        </div>
        // <div key={key}>
        //     <Box className={classes.card} sx={{backgroundColor: color}}>
        //         <Typography variant={'h5'}>{label}</Typography>
        //         <div className={classes.grid} style={{overflowY: items.length > 3 ? 'scroll' : ''}}>
        //             {items.map((item, index) => {
        //                 return (<div key={index} style={{gridColumn: 1 / 2}}>
        //                             <Box className={classes.item}>
        //                                 <Typography>{item.label}</Typography>
        //                                 {!!(item.price) ? <Typography>${item.price}</Typography> : ''}
        //                             </Box>
        //                         </div>)
        //             })}
        //             <div style={{gridColumn: 1 / 2}} onClick={() => setOpen(true)}>
        //                 <Box className={classes.item}>
        //                     <Typography>+</Typography>
        //                 </Box>
        //             </div>
        //         </div>
        //         <AddItemModal open={open} setOpen={setOpen} items={items} />
        //     </Box>
        // </div>

    )
}