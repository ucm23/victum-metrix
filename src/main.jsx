import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme.js';

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
