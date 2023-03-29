import React from 'react';
import Router from './router/Router';
import { BrowserRouter, HashRouter } from 'react-router-dom'; 
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Router />
      </HashRouter>      
    </QueryClientProvider>
  );
}

export default App;
