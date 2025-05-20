import React from 'react';

const Staff_Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div>
              <h3 className="font-semibold text-lg">Susaru Agro Plantation</h3>
              <p className="text-sm text-gray-400">Growing a sustainable future</p>
            </div>
          </div>
          
          <div className="text-center mb-4 md:mb-0">
            <p>&copy; {currentYear} Susaru Agro Plantation. All rights reserved.</p>
            <p className="text-sm text-gray-400">Staff Portal v1.0.0</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm">Need help? Contact support:</p>
            <a 
              href="mailto:support@susaruagro.com" 
              className="text-green-400 hover:text-green-300 transition duration-200"
            >
              support@susaruagro.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Staff_Footer;
