import { Modal } from "@mui/material";
import React from "react";

export const MTModal = (props) => {

    const {open, handleOnClose, children} = props;

    return (
        <Modal
            open={open}
            onClose={handleOnClose}
        >
            {children}
        </Modal>
    )
}