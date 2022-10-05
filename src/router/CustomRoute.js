import React from "react";
import { Header, Content } from '../components/layout/layout.js';
import { Box } from '@mui/material';

const CustomRoute = ({ content }) => {
    return (
        <Box>
            <Header />
            <Content>
                {content}
            </Content>
        </Box>
    )
}

export default CustomRoute;