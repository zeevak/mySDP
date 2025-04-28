import React from 'react'
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Sustainable Plantation Investments</h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-10">Join Susaru Agro Plantation in cultivating premium tea, rubber, and vanilla with eco-friendly practices that benefit both investors and the environment.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/products" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">Our Products</a>
              <a href="/investment" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition duration-300">Investment Opportunities</a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Premium Cultivations</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Premium Tea</h3>
                <p className="text-gray-600">White, green, black, and specialty teas grown in the prime tea regions of Sri Lanka with complete traceability and highest quality certification standards.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">FSC-Certified Rubber</h3>
                <p className="text-gray-600">Sustainable rubber products from our environmentally managed plantations, producing sole crepe, latex crepe, and centrifuged latex with organic certifications.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Premium Vanilla</h3>
                <p className="text-gray-600">High-quality vanilla beans grown in optimal conditions, often considered as "green gold" and valued more than silver itself.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Investment Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-lg shadow-md border border-green-200">
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Vanilla Plantation Investment</h3>
                <p className="text-gray-700 mb-4">Each acre of land is planted with 2,000 vanilla vines, yielding approximately 4kg per vine after 2.5 years of cultivation.</p>
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
                    <span>Complete cultivation management by our expert team</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guaranteed buy-back options after 5 years</span>
                  </li>
                </ul>
                <a href="/investment/vanilla" className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">Learn More</a>
              </div>
              
              <div className="bg-green-50 p-8 rounded-lg shadow-md border border-green-200">
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
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold">MW</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Manjula Wimalasena</h4>
                    <p className="text-gray-600 text-sm">South Korea</p>
                  </div>
                </div>
                <p className="text-gray-700">"I was looking for a good place to invest my earnings and came across Susaru Plantations. They have great customer service and provide the returns on time. I am very happy with my investment."</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold">YW</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Yasendra Withthamperuma</h4>
                    <p className="text-gray-600 text-sm">Local Investor</p>
                  </div>
                </div>
                <p className="text-gray-700">"I got my first profit payment right on time from Susaru Plantations. Looking forward to the future to come. Thank you Susaru!"</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainable Practices */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Sustainable Approach</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src="/images/sustainable-farming.jpg" alt="Sustainable Farming" className="rounded-lg shadow-lg" />
              </div>
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Organic Farming Methods</h3>
                  <p className="text-gray-600">We prioritize organic farming techniques that eliminate the use of harmful chemicals, ensuring soil fertility and protecting local wildlife.</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Water Conservation</h3>
                  <p className="text-gray-600">We implement efficient irrigation systems to minimize wastage, using techniques like drip irrigation and rainwater harvesting.</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-green-800">Biodiversity Preservation</h3>
                  <p className="text-gray-600">We dedicate portions of our land to natural habitats, supporting local wildlife and beneficial insects.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Invest in a Sustainable Future?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">Join Susaru Agro Plantation today and be part of our mission to combine profitable agriculture with environmental stewardship.</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">Contact Us</a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default LandingPage
