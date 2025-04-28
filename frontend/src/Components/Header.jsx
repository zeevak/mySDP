import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-white border-b border-green-100 ${scrolled ? 'shadow-md' : ''} transition-all duration-300 sticky top-0 z-50`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3">
          <img src="/images/logo.png" className="h-10" alt="Susaru Agro Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-800">Susaru Agro</span>
        </a>
        
        <div className="flex items-center md:order-2">
          <a href="/customer-login" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">Customer Login</a>
          <a href="/investment" className="text-green-700 border border-green-700 hover:bg-green-50 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hidden md:inline-block">Invest Now</a>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ml-2"
            aria-controls="navbar-default" 
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-green-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            <li>
              <a href="/" className="block py-2 px-3 text-white bg-green-700 rounded md:bg-transparent md:text-green-700 md:p-0" aria-current="page">Home</a>
            </li>
            <li className="relative group">
              <a href="/products" className="block py-2 px-3 text-gray-900 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 flex items-center">
                Products
                <svg className="w-2.5 h-2.5 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </a>
              <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 md:group-hover:block">
                <a href="/products/tea" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">Tea</a>
                <a href="/products/rubber" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">Rubber</a>
                <a href="/products/vanilla" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">Vanilla</a>
              </div>
            </li>
            <li className="relative group">
              <a href="/investment" className="block py-2 px-3 text-gray-900 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0 flex items-center">
                Investment
                <svg className="w-2.5 h-2.5 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </a>
              <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="/investment/tea" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">Tea Estates</a>
                <a href="/investment/vanilla" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">Vanilla Cultivation</a>
                <a href="/investment/calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">ROI Calculator</a>
              </div>
            </li>
            <li>
              <a href="/projects" className="block py-2 px-3 text-gray-900 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0">Projects</a>
            </li>
            <li>
              <a href="/about" className="block py-2 px-3 text-gray-900 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0">About</a>
            </li>
            <li>
              <a href="/contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-green-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
