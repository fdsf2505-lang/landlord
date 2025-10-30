import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Research from './pages/Research';
import Validation from './pages/Validation';
import BusinessModel from './pages/BusinessModel';
import Sustainability from './pages/Sustainability';
import References from './pages/References';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/business-model" element={<BusinessModel />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/references" element={<References />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
