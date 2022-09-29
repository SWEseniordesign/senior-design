import React from 'react';
import Router from './frontend/router/Router.js';
import { BrowserRouter } from 'react-router-dom'; 

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
