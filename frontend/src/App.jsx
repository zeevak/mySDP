import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import LandingPage from './Pages/Visitor/LandingPage';
import HomePage from './Pages/Visitor/HomePage';
import ProjectsPage from './Pages/Visitor/ProjectsPage';
import AboutPage from './Pages/Visitor/AboutPage';
import ContactPage from './Pages/Visitor/ContactPage';
import CustomerLogin from './Pages/Customer/CustomerLogin';
import CustomerDashBoard from './Pages/Customer/CustomerDashBoard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/customer/CustomerDashBoard" element={<CustomerDashBoard />} />
    </Routes>
  );
}

export default App;
