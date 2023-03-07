import React from 'react';
import Router from './router/Router';
import { BrowserRouter } from 'react-router-dom'; 
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>      
    </QueryClientProvider>
  );
}

export default App;
