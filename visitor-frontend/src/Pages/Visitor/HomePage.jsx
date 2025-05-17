import React from 'react'
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Sustainable Farming for a Greener Tomorrow</h1>
              <p className="text-xl mb-8">Experience the natural goodness of Susaru Agro Plantation's organic produce grown with care for the environment.</p>
              <a href="/products" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">Explore Our Produce</a>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img src="src/assets/plantation-landscape.jpg" alt="Susaru Agro Plantation" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Agricultural Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border border-green-200 rounded-lg hover:shadow-lg transition duration-300 bg-white">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Organic Farming</h3>
                <p className="text-gray-600">Pesticide-free cultivation methods that preserve soil health and biodiversity.</p>
              </div>
              
              <div className="p-6 border border-green-200 rounded-lg hover:shadow-lg transition duration-300 bg-white">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Tea Cultivation</h3>
                <p className="text-gray-600">Premium white, green, black, and specialty teas grown in optimal conditions.</p>
              </div>
              
              <div className="p-6 border border-green-200 rounded-lg hover:shadow-lg transition duration-300 bg-white">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Rubber Production</h3>
                <p className="text-gray-600">FSC-certified rubber plantations producing high-quality crepe and latex products.</p>
              </div>
              
              <div className="p-6 border border-green-200 rounded-lg hover:shadow-lg transition duration-300 bg-white">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Spice Cultivation</h3>
                <p className="text-gray-600">Premium vanilla and other spices grown using sustainable farming practices.</p>
              </div>
              
              <div className="p-6 border border-green-200 rounded-lg hover:shadow-lg transition duration-300 bg-white">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Agricultural Investment</h3>
                <p className="text-gray-600">Secure investment opportunities in our plantations with attractive returns.</p>
              </div>
              
              <div className="p-6 border border-green-200 rounded-lg hover:shadow-lg transition duration-300 bg-white">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Agro-Tourism</h3>
                <p className="text-gray-600">Experience plantation life with guided tours and interactive activities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Sustainable Approach</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src="src\assets\sustainable-farming.jpg" alt="Sustainable Farming" className="rounded-lg shadow-lg h-full object-cover w-full" style={{ maxHeight: '450px' }} />
              </div>
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Eco-Friendly Practices</h3>
                  <p className="text-gray-600">We implement water conservation, renewable energy, and natural pest control methods to minimize our environmental impact.</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Soil Health Management</h3>
                  <p className="text-gray-600">Our crop rotation and composting techniques maintain soil fertility without synthetic fertilizers.</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Biodiversity Preservation</h3>
                  <p className="text-gray-600">We dedicate portions of our land to natural habitats, supporting local wildlife and beneficial insects.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Community Involvement</h3>
                  <p className="text-gray-600">We engage with local communities through farmers' markets, educational programs, and employment opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Premium Products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img src="/src/assets/tea.jpg" alt="Premium Tea" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-800">Organic Tea Collection</h3>
                  <p className="text-gray-600 mb-3">White, green, black, and specialty teas from our highland plantations.</p>
                  <a href="/products/tea" className="text-green-600 hover:text-green-800 font-medium">Learn more →</a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img src="/src/assets/rubber.jpg" alt="Natural Rubber" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-800">FSC-Certified Rubber</h3>
                  <p className="text-gray-600 mb-3">Sustainable rubber products from our environmentally managed plantations.</p>
                  <a href="/products/rubber" className="text-green-600 hover:text-green-800 font-medium">Learn more →</a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img src="/src/assets/vanilla.jpg" alt="Vanilla Beans" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-800">Premium Vanilla</h3>
                  <p className="text-gray-600 mb-3">High-quality vanilla beans grown in optimal conditions.</p>
                  <a href="/products/vanilla" className="text-green-600 hover:text-green-800 font-medium">Learn more →</a>
                </div>
              </div>
            </div>
            <div className="text-center mt-10">
              <a href="/products" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">View All Products</a>
            </div>
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Investment Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-lg border border-green-200">
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Vanilla Plantation Investment</h3>
                <p className="text-gray-700 mb-4">Join our successful vanilla cultivation program with guaranteed returns. Each acre is planted with 2,000 vanilla vines yielding approximately 4kg per vine after 2.5 years.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Legal ownership secured through Land Registry</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guaranteed buy-back options after 5 years</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete cultivation management by our expert team</span>
                  </li>
                </ul>
                <a href="/investment/vanilla" className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">Learn More</a>
              </div>
              
              <div className="bg-green-50 p-8 rounded-lg border border-green-200">
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Tea Estate Partnership</h3>
                <p className="text-gray-700 mb-4">Become a partner in our tea estates located across the prime tea regions of Sri Lanka, including Nuwara Eliya, Dimbula, Sabaragamuwa, and Ruhuna.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Investment in established tea plantations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quarterly returns from tea production</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Transparent reporting and profit sharing</span>
                  </li>
                </ul>
                <a href="/investment/tea" className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">Learn More</a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">What Our Investors Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold text-xl">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Manjula Wimalasena</h4>
                    <p className="text-sm text-gray-500">South Korea</p>
                  </div>
                </div>
                <p className="text-gray-600">I was looking for a good place to invest my earnings and came across Susaru Plantations. They have great customer service and provide the returns on time. I am very happy with my investment.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold text-xl">Y</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Yasendra Withthamperuma</h4>
                    <p className="text-sm text-gray-500">Local Investor</p>
                  </div>
                </div>
                <p className="text-gray-600">I got my first profit payment right on time from Susaru Plantations. Looking forward to the future to come. Thank you Susaru!</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold text-xl">U</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">G.N. Udaya Kumara</h4>
                    <p className="text-sm text-gray-500">Business Partner</p>
                  </div>
                </div>
                <p className="text-gray-600">I am very happy to say that I am an investor in Susaru Plantations. I have to praise them for the high value they give for our investments as well as their great and timely service.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Experience the Goodness of Nature</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">Visit Susaru Agro Plantation to see our sustainable farming practices in action and taste the difference in our organic produce.</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">Plan Your Visit</a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default HomePage;
