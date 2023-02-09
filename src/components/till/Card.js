import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyle = makeStyles({
    card: {
        borderBottom: '2px solid black',
        backgroundColor: props => props.color
    }
})

export const Card = (props) => {

    const { key, label, color, dimensions, items } = props;

    const classes = useStyle(props);

    return (
        <div key={key} data-grid={{ x: dimensions.x, y: dimensions.y, w: dimensions.w, h: dimensions.h }} className={classes.card}>
            <Typography>{label}</Typography>
        </div>
    )
}