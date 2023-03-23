import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomRoute from './CustomRoute';
import SiteRoutes from './SiteRoutes';

const Router = () => {
    
    return (
        <Routes>
            {SiteRoutes.map((route, index) => {
                return <Route key={index} path={route.path} element={<CustomRoute content={route.component} simplifiedHeader={route.simplifiedHeader} />} />
            })}
        </Routes>
    );
}

export default Router;