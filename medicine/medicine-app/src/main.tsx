// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';    // Your medicine registration component
import Check from './Check.tsx';  // Your medicine schedule check component
import './index.css'; // Or your global CSS file

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route for the registration page (your App component) */}
        <Route path="/" element={<App />} />
        {/* Route for the check page (your Check component) */}
        <Route path="/check" element={<Check />} />
        {/* Add more routes here if you have other pages */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
