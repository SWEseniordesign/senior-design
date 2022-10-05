import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomRoute from './CustomRoute'
import { Home } from '../pages/Home/Home.js';

const Router = () => {
    return (
        <Routes>
            <Route path={'/'} element={<CustomRoute content={<Home />} />} />
        </Routes>
    );
}

export default Router;