import React from "react";
import { Header, Content } from '../components/layout/layout.js';
import { Box } from '@mui/material';

const CustomRoute = (props) => {

    const { content, simplifiedHeader } = props;

    return (
        <Box>
            <Header simplifiedHeader={simplifiedHeader} />
            <Content>
                {content}
            </Content>
        </Box>
    )
}

export default CustomRoute;