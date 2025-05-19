import React from 'react';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';

const Vanilla = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Vanilla</h1>
              <p className="text-xl mb-8">
                Discover "Green Gold" - one of the world's most valuable spices and a sustainable investment opportunity with exceptional returns.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img 
                src="/src/assets/vanilla-hero.jpg" 
                alt="Vanilla Plantation" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x400?text=Vanilla+Plantation";
                }}
              />
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="/src/assets/vanilla-beans.jpg" 
                  alt="Vanilla Beans" 
                  className="rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Vanilla+Beans";
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-amber-800">What is Vanilla?</h2>
                <p className="text-gray-700 mb-4">
                  Vanilla is a high-value cash crop derived from orchids of the genus Vanilla. The most widely used variety, Bourbon vanilla, comes from the species Vanilla planifolia.
                </p>
                <p className="text-gray-700">
                  After years of success in Sri Lanka's agricultural sector, Susaru Agro is proud to pioneer sustainable vanilla cultivation. With our expertise in tropical agriculture, we're committed to producing premium vanilla beans through environmentally friendly practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Uses Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Uses of Vanilla</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Food & Beverages</h3>
                <p className="text-gray-600">
                  Vanilla is the world's most popular flavor, used in ice cream, baked goods, chocolates, and premium beverages for its rich, sweet aroma.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Perfumes & Cosmetics</h3>
                <p className="text-gray-600">
                  The warm, sweet fragrance of vanilla is a staple in luxury perfumes, body lotions, and cosmetic products worldwide.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Aromatherapy & Wellness</h3>
                <p className="text-gray-600">
                  Vanilla is used in aromatherapy for its calming properties and ability to reduce stress and anxiety. It's also used in traditional medicine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Valuable Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Why Is Vanilla So Valuable?</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="/src/assets/vanilla-cultivation.jpg" 
                  alt="Vanilla Cultivation" 
                  className="rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Vanilla+Cultivation";
                  }}
                />
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Labor Intensive:</span> Vanilla requires hand pollination and a meticulous 9-month curing process, making it one of the most labor-intensive agricultural products.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Long Growth Cycle:</span> Vanilla vines take 3-4 years to mature before producing beans, limiting quick market responses to demand.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Limited Growing Regions:</span> Vanilla only thrives in specific tropical climates, restricting global production to a few regions.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Growing Demand:</span> Global demand for natural vanilla continues to rise as consumers shift away from artificial flavors.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Premium Pricing:</span> High-quality vanilla beans can sell for up to $600 per kilogram, making it pound-for-pound more valuable than silver.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cultivation Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Sustainable Cultivation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-amber-800">Ideal Growing Conditions</h3>
                <p className="text-gray-700 mb-6">
                  Vanilla thrives in Sri Lanka's wet and intermediate zones, particularly in Kandy, Nuwara Eliya, Matale, and Kegalle districts. The crop requires 80-85% humidity, temperatures between 20-30°C, and moderate rainfall.
                </p>
                <p className="text-gray-700">
                  At Susaru Agro, we utilize sustainable agroforestry practices, growing vanilla as an intercrop with support trees. This method enhances biodiversity, improves soil health, and maximizes land utilization.
                </p>
              </div>
              <div>
                <img 
                  src="/src/assets/vanilla-agroforestry.jpg" 
                  alt="Vanilla Agroforestry" 
                  className="rounded-lg shadow-lg h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Vanilla+Agroforestry";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunity */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Investment Opportunity</h2>
            <div className="bg-amber-50 p-8 rounded-lg border border-amber-200 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-amber-800">Why Invest in Vanilla?</h3>
              <p className="text-gray-700 mb-6">
                Vanilla cultivation offers exceptional returns with relatively low maintenance costs. With proper management, a vanilla plantation can remain productive for 12-15 years, providing a sustainable long-term investment with annual returns starting from the 3rd year.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>High-value crop with returns of up to Rs. 320,000 annually per investment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Organic cultivation with low maintenance costs</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Growing global demand with established export markets</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Environmentally sustainable with positive ecological impact</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="/investment" className="inline-block px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition duration-300">
                  Learn About Investment Options
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-amber-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Vanilla Cultivation?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Contact us today to learn more about our vanilla cultivation programs or investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-8 py-3 bg-white text-amber-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
                Contact Us
              </a>
              <a href="/investment" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-700 transition duration-300">
                Investment Options
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Vanilla;
