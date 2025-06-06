import React from 'react';

/**
 * Footer Component
 * Displays the website footer with company information, navigation links,
 * certifications, social media links, and legal links
 */
const Footer = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-50 border-t border-green-200 shadow-sm">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">

        {/* Main Footer Content - Company Info and Navigation Links */}
        <div className="md:flex md:justify-between">
          {/* Company Information and Contact Details Section */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <a href="/" className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-800">Susaru Agro</span>
            </a>
            <p className="mt-2 text-gray-600 max-w-md">
              Sustainable plantation management and premium agricultural investments in tea, rubber, and vanilla cultivation across Sri Lanka.
            </p>
            {/* Contact Information Section */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-green-800 uppercase mb-3">Contact Us</h3>
              <p className="text-gray-600 mb-2">No. 66/A, Sri Somananda Mawatha, Horana, Sri Lanka</p>
              <p className="text-gray-600 mb-2">susaruagro@gmail.com</p>
              <p className="text-gray-600">+94 70 102 1955</p>
            </div>
          </div>

          {/* Footer Navigation Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {/* Plantations Navigation Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-green-800 uppercase">Plantations</h2>
              <ul className="text-gray-600">
                <li className="mb-4">
                  <a href="/products/tea" className="hover:text-green-700">Tea Estates</a>
                </li>
                <li className="mb-4">
                  <a href="/products/rubber" className="hover:text-green-700">Rubber Plantations</a>
                </li>
                <li>
                  <a href="/products/vanilla" className="hover:text-green-700">Vanilla Farms</a>
                </li>
              </ul>
            </div>

            {/* Investment Navigation Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-green-800 uppercase">Invest With Us</h2>
              <ul className="text-gray-600">
                <li className="mb-4">
                  <a href="/investment/tea" className="hover:text-green-700">Tea Investment</a>
                </li>
                <li className="mb-4">
                  <a href="/investment/vanilla" className="hover:text-green-700">Vanilla Investment</a>
                </li>
                <li>
                  <a href="/investment/calculator" className="hover:text-green-700">ROI Calculator</a>
                </li>
              </ul>
            </div>

            {/* Company Navigation Links */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-green-800 uppercase">Company</h2>
              <ul className="text-gray-600">
                <li className="mb-4">
                  <a href="/about" className="hover:text-green-700">About Us</a>
                </li>
                <li className="mb-4">
                  <a href="/sustainability" className="hover:text-green-700">Sustainability</a>
                </li>
                <li className="mb-4">
                  <a href="/careers" className="hover:text-green-700">Careers</a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-green-700">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mt-8 pt-8 border-t border-green-200">
          <h3 className="text-sm font-semibold text-green-800 uppercase mb-4 text-center">Our Certifications</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Certification Images */}
            <img src="../src/assets/USDA.png" alt="USDA Organic" className="h-12" />
            <img src="../src/assets/FSC.png" alt="FSC Certified" className="h-12" />
            <img src="../src/assets/RFA.png" alt="Rainforest Alliance" className="h-12" />
            <img src="../src/assets/FT.png" alt="Fair Trade" className="h-12" />
          </div>
        </div>
        <hr className="my-6 border-green-200 sm:mx-auto lg:my-8" />

        {/* Copyright and Social Media Links Section */}
        <div className="sm:flex sm:items-center sm:justify-between">
          {/* Copyright Notice */}
          <span className="text-sm text-gray-600 sm:text-center">
            © {currentYear} <a href="/" className="hover:text-green-700">Susaru Agro Plantation</a>. All Rights Reserved.
          </span>

          {/* Social Media Icons */}
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            {/* Facebook Icon */}
            <a href="https://web.facebook.com/profile.php?id=61554669269177#" className="text-gray-500 hover:text-green-700" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* Facebook SVG Path */}
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Instagram Icon */}
            <a href="#" className="text-gray-500 hover:text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* Instagram SVG Path */}
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>

            {/* Twitter/X Icon */}
            <a href="#" className="text-gray-500 hover:text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* Twitter/X SVG Path */}
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>

            {/* LinkedIn Icon */}
            <a href="#" className="text-gray-500 hover:text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* LinkedIn SVG Path */}
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>

            {/* WhatsApp Icon */}
            <a href="https://wa.me/94727177635" className="text-gray-500 hover:text-green-700" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {/* WhatsApp SVG Path */}
                <path fillRule="evenodd" d="M20.472 3.527C18.224 1.277 15.307 0 12.213 0 5.545 0 0.125 5.42 0.125 12.088c0 2.128 0.56 4.211 1.619 6.038l-1.719 6.278 6.433-1.686c1.758 0.957 3.738 1.464 5.755 1.464h0.005c6.668 0 12.088-5.42 12.088-12.088 0-3.095-1.277-6.012-3.527-8.26L20.472 3.527zM12.213 22.1h-0.004c-1.804 0-3.573-0.485-5.112-1.401l-0.367-0.218-3.802 0.997 1.015-3.706-0.239-0.38c-1.009-1.604-1.541-3.452-1.541-5.304 0-5.546 4.514-10.06 10.064-10.06 2.688 0 5.213 1.046 7.109 2.947 1.897 1.897 2.943 4.422 2.942 7.107-0.001 5.546-4.514 10.06-10.064 10.06L12.213 22.1zM17.688 14.586c-0.303-0.152-1.793-0.885-2.07-0.984-0.277-0.101-0.479-0.152-0.681 0.152-0.202 0.303-0.782 0.984-0.959 1.186-0.177 0.202-0.353 0.227-0.656 0.076-0.303-0.152-1.279-0.471-2.437-1.503-0.9-0.802-1.507-1.793-1.684-2.095-0.177-0.303-0.019-0.466 0.133-0.617 0.136-0.135 0.303-0.353 0.454-0.53 0.152-0.177 0.202-0.303 0.303-0.505 0.101-0.202 0.05-0.379-0.025-0.53-0.076-0.152-0.681-1.643-0.934-2.248-0.246-0.59-0.496-0.51-0.681-0.519-0.177-0.009-0.379-0.009-0.581-0.009-0.202 0-0.53 0.076-0.808 0.379-0.277 0.303-1.059 1.036-1.059 2.527 0 1.491 1.085 2.932 1.237 3.134 0.152 0.202 2.145 3.274 5.199 4.589 0.727 0.313 1.293 0.501 1.735 0.642 0.729 0.232 1.393 0.199 1.918 0.121 0.585-0.087 1.793-0.733 2.046-1.441 0.252-0.708 0.252-1.313 0.177-1.441-0.076-0.126-0.277-0.202-0.581-0.353L17.688 14.586z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Legal Links Section */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/privacy" className="hover:text-green-700 mr-4">Privacy Policy</a>
          <a href="/terms" className="hover:text-green-700 mr-4">Terms & Conditions</a>
          <a href="/sitemap" className="hover:text-green-700">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
