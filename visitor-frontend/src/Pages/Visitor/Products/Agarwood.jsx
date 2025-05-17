import React from 'react';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';

const Agarwood = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Agarwood</h1>
              <p className="text-xl mb-8">
                Discover the "Wood of the Gods" - one of the world's most precious natural resources and a sustainable investment opportunity.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img 
                src="/src/assets/agarwood-hero.jpg" 
                alt="Agarwood Plantation" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x400?text=Agarwood+Plantation";
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
                  src="/src/assets/agarwood-resin.jpg" 
                  alt="Agarwood Resin" 
                  className="rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Agarwood+Resin";
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">What is Agarwood?</h2>
                <p className="text-gray-700 mb-4">
                  Agarwood is a dark-colored fragrant resin produced by certain plant members of the Thymelaeaceae family. 
                  It's also known as Aloes wood, Eaglewood, Gaharu, Agalocha, or Oudh (in Arabic).
                </p>
                <p className="text-gray-700">
                  After two decades of accomplishments in Sri Lanka's commercial forestry industry, Susaru Agro is proud to be a pioneer in the increasingly 
                  popular Agarwood forestry industry. With extensive Agarwood plantations across the island, we're committed to sustainable cultivation 
                  and production of this precious resource.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Uses Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Uses of Agarwood</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Luxury Perfumes</h3>
                <p className="text-gray-600">
                  Agarwood is used as a key ingredient in the world's most expensive perfumes, prized for its complex, woody, and sweet fragrance that can last for days.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Incense & Aromatherapy</h3>
                <p className="text-gray-600">
                  For centuries, agarwood has been used in religious ceremonies and meditation practices across Asia. Its smoke is believed to have calming properties.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Traditional Medicine</h3>
                <p className="text-gray-600">
                  Chinese medicine uses powdered Aquilaria as a treatment for cirrhosis of the liver. It has also been used as a treatment for lung and stomach ailments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Expensive Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Why Is Agarwood So Valuable?</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="/src/assets/agarwood-chips.jpg" 
                  alt="Agarwood Chips" 
                  className="rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Agarwood+Chips";
                  }}
                />
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Rarity:</span> The resin only forms when the Aquilaria tree is infected with a specific type of mold, making natural agarwood extremely rare.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Low Yield:</span> Only a small percentage of the tree produces the valuable resin, making extraction inefficient.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Labor Intensive:</span> The process of extraction and processing is time-consuming and requires skilled labor.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">High Demand:</span> There is a constantly growing demand in larger markets such as the Middle East, China, USA, and Europe.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Protected Status:</span> The most important resin-producing species of Aquilaria are protected worldwide under the CITES convention.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cultivation Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Sustainable Cultivation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Suitability</h3>
                <p className="text-gray-700 mb-6">
                  The Aquilaria plant can grow on a wide range of soils. Seedlings establish best in shady, moist conditions, though mature trees can fully withstand the sun. 
                  In Sri Lanka, the low country wet zone has proven suitable for Aquilaria plantations.
                </p>
                <p className="text-gray-700">
                  At Susaru Agro, we carefully select optimal locations for our agarwood plantations, ensuring sustainable growth and high-quality resin production.
                </p>
              </div>
              <div>
                <img 
                  src="/src/assets/agarwood-plantation.jpg" 
                  alt="Agarwood Plantation" 
                  className="rounded-lg shadow-lg h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Agarwood+Plantation";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunity */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Investment Opportunity</h2>
            <div className="bg-green-50 p-8 rounded-lg border border-green-200 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-green-800">Why Invest in Agarwood?</h3>
              <p className="text-gray-700 mb-6">
                Agarwood is a billion-dollar industry with constantly increasing prices due to growing demand and limited supply. 
                With our reliable customer base, strong economic foundation, and secure production supply chain, 
                Susaru Agro Agarwood presents an attractive and trusted investment opportunity.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>High-value crop with excellent ROI potential</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sustainable and environmentally friendly investment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Expert management and cultivation techniques</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Growing global market with established demand</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="/investment" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">
                  Learn About Investment Options
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Agarwood?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Contact us today to learn more about our agarwood products or investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
                Contact Us
              </a>
              <a href="/investment" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition duration-300">
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

export default Agarwood;
