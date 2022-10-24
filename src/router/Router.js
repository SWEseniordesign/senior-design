import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomRoute from './CustomRoute';
import SiteRoutes from './SiteRoutes';

const Router = () => {
    return (
        <Routes>
            {SiteRoutes.map((route) => {
                return <Route path={route.path} element={<CustomRoute content={route.component} />} />
            })}
        </Routes>
    );
}

export default Router;