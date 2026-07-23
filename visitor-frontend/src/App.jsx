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
import NewInvestmentPage from './Pages/Customer/NewInvestmentPage';
import LandCheckPage from './Pages/Visitor/LandCheckPage';
import ResultsCalculation from './Pages/Visitor/ResultsCalculation';

// Product pages
import Agarwood from './Pages/Visitor/Products/Agarwood';
import Rubber from './Pages/Visitor/Products/Rubber';
import Sandalwood from './Pages/Visitor/Products/Sandalwood';
import Tea from './Pages/Visitor/Products/Tea';
import Vanilla from './Pages/Visitor/Products/Vanilla';

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
      <Route path="/customer/new-investment" element={<NewInvestmentPage />} />
      <Route path="/try-agarwood" element={<LandCheckPage />} />
      <Route path="/try-agarwood/results/:landSize" element={<ResultsCalculation />} />

      {/* Product Routes */}
      <Route path="/products/agarwood" element={<Agarwood />} />
      <Route path="/products/rubber" element={<Rubber />} />
      <Route path="/products/sandalwood" element={<Sandalwood />} />
      <Route path="/products/tea" element={<Tea />} />
      <Route path="/products/vanilla" element={<Vanilla />} />

      {/* Investment Routes */}
      <Route path="/investment" element={<HomePage />} />
    </Routes>
  );
}

export default App;
