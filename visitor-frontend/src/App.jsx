// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from './Pages/Visitor/HomePage';
import ProjectsPage from './Pages/Visitor/ProjectsPage';
import AboutPage from './Pages/Visitor/AboutPage';
import ContactPage from './Pages/Visitor/ContactPage';
import CustomerLogin from './Pages/Customer/CustomerLogin';
import CustomerDashBoard from './Pages/Customer/CustomerDashBoard';
import LandCheckPage from './Pages/Visitor/LandCheckPage';
import ResultsCalculation from './Pages/Visitor/ResultsCalculation';

// Product pages
import Agarwood from './Pages/Visitor/Products/Agarwood';
import Vanilla from './Pages/Visitor/Products/Vanilla';
import Sandalwood from './Pages/Visitor/Products/Sandalwood';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/CustomerDashBoard" element={<CustomerDashBoard />} />
      <Route path="/try-agarwood" element={<LandCheckPage />} />
      <Route path="/try-agarwood/results/:landSize" element={<ResultsCalculation />} />

      {/* Product Routes */}
      <Route path="/products/agarwood" element={<Agarwood />} />
      <Route path="/products/vanilla" element={<Vanilla />} />
      <Route path="/products/sandalwood" element={<Sandalwood />} />
    </Routes>
  );
}

export default App;
