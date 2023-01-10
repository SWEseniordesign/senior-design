import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const MTSelect = (props) => {

    const {label, items, value, setValue, isFullWidth} = props;

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <div>
            <FormControl fullWidth={isFullWidth ? true : false}>
                <InputLabel id={"label_select"}>{label}</InputLabel>
                <Select 
                    labelId={"label_select"} 
                    label={label} 
                    value={value} 
                    onChange={(e) => handleChange(e)}>
                    {items.map((item) =>
                        <MenuItem id={item.id} value={item.title}>{item.title}</MenuItem>
                    )}    
                </Select> 
            </FormControl>
        </div>
    )
}

export default MTSelect;