import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

/*
    The items props must be in the following format. [{id: '', title: '', onClick: () => {}}]
*/

const MTSelect = (props) => {

    //* Available props that can be passed into the custom select. 
    //? eg. <MTTextField (any_of_these_props)={what_you_want_to_pass_in}/>
    const { 
        label, 
        items, 
        value, 
        setValue, 
        isFullWidth, 
        isRequired } = props;

    //* Handles changing the value
    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <div>
            <FormControl fullWidth={isFullWidth ? true : false} required={isRequired ? true : false}>
                <InputLabel id={"label_select"}>{label}</InputLabel>
                <Select 
                    labelId={"label_select"} 
                    label={label} 
                    value={value} 
                    onChange={(e) => handleChange(e)}>
                    {items.map((item) =>
                        <MenuItem key={item.id} value={item.title}>{item.title}</MenuItem>
                    )}    
                </Select> 
            </FormControl>
        </div>
    )
}

export default MTSelect;