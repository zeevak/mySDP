import React from 'react';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';

const Rubber = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-slate-700 to-gray-800 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <p className="uppercase tracking-widest text-slate-300 text-sm font-semibold mb-3">Sri Lanka's Liquid Gold</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Natural Rubber</h1>
              <p className="text-xl mb-8 leading-relaxed">
                Grown across Sri Lanka's lush wet-zone lowlands, FSC-certified natural rubber from Susaru Agro supports global industries while upholding the highest standards of environmental stewardship and sustainable forest management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/investment" className="px-8 py-3 bg-white text-slate-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300 text-center">
                  Investment Options
                </a>
                <a href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-700 transition duration-300 text-center">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              {/* IMAGE PLACEHOLDER — replace src with your image path */}
              <img
                src="/src/assets/rubber-hero.jpg"
                alt="Rubber Plantation Sri Lanka"
                className="rounded-lg shadow-xl w-full object-cover"
                style={{ minHeight: '320px', background: '#e2e8f0' }}
              />
            </div>
          </div>
        </section>

        {/* Key Stats Banner */}
        <section className="bg-slate-800 text-white py-10">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-slate-300">~80k</p>
                <p className="text-sm mt-1 text-slate-400">Hectares Under Rubber in Sri Lanka</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-300">$1.5B+</p>
                <p className="text-sm mt-1 text-slate-400">Annual Export Revenue</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-300">FSC</p>
                <p className="text-sm mt-1 text-slate-400">Certified Sustainable Forestry</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-300">25+</p>
                <p className="text-sm mt-1 text-slate-400">Years Productive Life Per Tree</p>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {/* IMAGE PLACEHOLDER */}
                <img
                  src="/src/assets/rubber-tree.jpg"
                  alt="Rubber Tree Tapping"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ minHeight: '360px', background: '#e2e8f0' }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">What is Natural Rubber?</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Natural rubber is derived from the latex of the rubber tree, <em>Hevea brasiliensis</em>, native to the Amazon basin and widely cultivated across tropical Asia. When the bark of the tree is carefully incised — a process known as tapping — a milky white latex seeps out and is collected in cups attached to the tree.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Sri Lanka has a long and distinguished history in rubber cultivation, dating back to the late 19th century. Today, the country produces high-quality natural rubber including Ribbed Smoked Sheets (RSS), Technically Specified Rubber (TSR), and crepe rubber, all of which are in strong demand across global industrial markets.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  At Susaru Agro Plantation, our rubber estates are FSC-certified, meaning our forests are managed according to internationally recognised environmental, social, and economic standards. We are committed to responsible land use, worker welfare, and long-term sustainability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rubber Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Rubber Products We Produce</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">From raw latex to processed sheets and crepe, Susaru Agro produces multiple grades of rubber to serve diverse industrial and commercial markets.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-slate-500">
                <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Ribbed Smoked Sheets (RSS)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The most widely traded form of natural rubber. Latex is coagulated with formic acid, rolled into ribbed sheets, then smoked and dried. Graded from RSS 1 (premium) to RSS 5, these sheets are used in tyres, footwear, and industrial goods.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-slate-500">
                <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Technically Specified Rubber (TSR)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Machine-processed rubber bales standardised by technical specifications such as dirt content, ash content, and nitrogen levels. TSR grades (TSR 10, TSR 20) are preferred by large-scale manufacturers in the automotive and industrial sectors.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-slate-500">
                <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Concentrated Latex</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Field latex is centrifuged to produce 60% DRC (dry rubber content) concentrated latex, used in the manufacture of surgical gloves, condoms, foam products, and dipped goods. Sri Lanka is a leading global supplier of quality latex concentrate.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-slate-500">
                <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Crepe Rubber</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Produced by washing and creeping coagulated latex or scrap rubber. White crepe and pale crepe grades are prized for pharmaceutical and food-grade applications, while brown crepe is used in footwear soles and engineering rubber products.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-slate-500">
                <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Timber (End-of-Life Trees)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  After 25–30 years of latex production, rubber trees are felled and the timber is sold as rubberwood — a sustainable hardwood used in furniture manufacturing. This provides an additional revenue stream at the end of each plantation cycle.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-slate-500">
                <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Value-Added Products</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sri Lanka's rubber industry has moved beyond raw materials into finished goods including medical gloves, rubber bands, elastic thread, and precision-engineered rubber components, all commanding significantly higher export values.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Uses Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Uses of Natural Rubber</h2>
            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-slate-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Automotive & Transport</h3>
                <p className="text-gray-600 leading-relaxed">
                  The single largest consumer of natural rubber. Tyres for cars, trucks, motorcycles, aircraft, and heavy machinery require natural rubber for its superior elasticity, heat resistance, and durability under high load conditions.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Medical & Healthcare</h3>
                <p className="text-gray-600 leading-relaxed">
                  Natural rubber latex is critical to the production of surgical gloves, catheters, condoms, dental dams, and other medical devices where biocompatibility, barrier properties, and elasticity are essential.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Industrial & Engineering</h3>
                <p className="text-gray-600 leading-relaxed">
                  Used in conveyor belts, hoses, seals, gaskets, vibration dampers, and industrial rollers. Natural rubber's tensile strength, abrasion resistance, and flexibility make it irreplaceable in heavy engineering applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Valuable Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Is Natural Rubber So Valuable?</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {/* IMAGE PLACEHOLDER */}
                <img
                  src="/src/assets/rubber-tapping.jpg"
                  alt="Rubber Tree Tapping"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ minHeight: '360px', background: '#e2e8f0' }}
                />
              </div>
              <div>
                <ul className="space-y-5">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-slate-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Irreplaceable Properties:</span> Natural rubber possesses superior tensile strength, elasticity, and heat-resistance properties that synthetic alternatives cannot fully replicate, ensuring permanent demand across critical industries.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-slate-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Growing Global Demand:</span> Driven by the automotive industry, healthcare expansion, and infrastructure growth in Asia and Africa, global consumption of natural rubber continues to rise steadily year on year.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-slate-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">FSC Certification Premium:</span> Sustainably sourced, FSC-certified rubber commands a measurable price premium in European and North American markets, where buyers increasingly require verified responsible sourcing.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-slate-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Carbon Sequestration:</span> Rubber plantations absorb significant amounts of CO₂, making them an increasingly attractive asset for carbon credit markets and ESG-conscious investors.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-slate-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Dual Revenue Streams:</span> Rubber plantations generate income from both latex throughout the productive life of the tree and from rubberwood timber when the trees are eventually replaced, maximising overall returns.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cultivation Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Sustainable Rubber Cultivation</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Ideal Growing Conditions</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Rubber (Hevea brasiliensis) thrives in Sri Lanka's wet-zone lowlands, particularly in the Sabaragamuwa, Western, and Southern provinces. The crop requires a warm, humid climate with temperatures between 25°C and 35°C and annual rainfall exceeding 2,000mm.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  At Susaru Agro, our rubber estates are managed under strict FSC guidelines. We employ stimulation-only tapping methods that preserve tree health and longevity, and we replant with high-yielding, disease-resistant clones developed by the Rubber Research Institute of Sri Lanka.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Temperature</p>
                    <p className="text-gray-600 text-sm">25°C – 35°C optimal</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Rainfall</p>
                    <p className="text-gray-600 text-sm">2,000mm+ annually</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Soil</p>
                    <p className="text-gray-600 text-sm">Deep, well-drained loam</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="font-semibold text-gray-800 text-sm mb-1">Altitude</p>
                    <p className="text-gray-600 text-sm">Below 500m ASL</p>
                  </div>
                </div>
              </div>
              <div>
                {/* IMAGE PLACEHOLDER */}
                <img
                  src="/src/assets/rubber-plantation.jpg"
                  alt="Rubber Plantation"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ minHeight: '400px', background: '#e2e8f0' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tree Characteristics Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Rubber Tree Characteristics</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-10">

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Physical Characteristics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Species:</span> Hevea brasiliensis — the principal commercial rubber tree species</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Height:</span> Can grow to 25–30 meters in natural conditions; typically 15–20m in managed plantations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Tapping Age:</span> Trees are first tapped at 5–7 years of age, when girth reaches 50cm at 1 metre above ground</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Productive Life:</span> 25–35 years of latex production per tree before replanting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Yield:</span> High-yielding clones produce 2,500–3,500 kg of dry rubber per hectare per year</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Tapping & Harvesting</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Tapping Method:</span> A thin layer of bark is shaved from the tapping panel using a specialised tapping knife, allowing latex to flow freely into a collecting cup.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Tapping Frequency:</span> Every 2–3 days (alternate-day tapping), allowing bark panels to regenerate. Bark is renewed every 6–8 years.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Tapping Season:</span> Latex flow is highest in wet weather. Wintering (leaf fall) occurs from February to April, with reduced tapping during this period.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Stimulation:</span> Approved ethephon-based yield stimulants are applied to increase latex flow on low-frequency tapping systems, reducing labour requirements.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommended Clones for Sri Lanka</h3>
              <p className="text-gray-700 mb-4">
                Susaru Agro uses high-yielding, disease-resistant clones developed and recommended by the Rubber Research Institute of Sri Lanka (RRISL) for our plantation replanting and new planting programmes.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-gray-800 uppercase tracking-wide">High-Yielding Clones</h4>
                  <ul className="space-y-1">
                    {['RRIC 100', 'RRIC 102', 'RRIC 121', 'PB 86', 'GT 1'].map(c => (
                      <li key={c} className="flex items-center text-sm text-gray-700">
                        <svg className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-gray-800 uppercase tracking-wide">Wind-Tolerant Clones</h4>
                  <ul className="space-y-1">
                    {['RRIC 103', 'RRIC 110', 'PB 260', 'BPM 24', 'RRIM 600'].map(c => (
                      <li key={c} className="flex items-center text-sm text-gray-700">
                        <svg className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-gray-800 uppercase tracking-wide">Disease-Resistant Clones</h4>
                  <ul className="space-y-1">
                    {['RRIC 130', 'RRIC 133', 'RRISL 211', 'RRISL 203', 'PB 235'].map(c => (
                      <li key={c} className="flex items-center text-sm text-gray-700">
                        <svg className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunity */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Investment Opportunity</h2>
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 shadow-md max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Why Invest in Natural Rubber?</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                A rubber plantation investment with Susaru Agro offers steady, long-term returns backed by consistent global demand, sustainable FSC-certified production, and a dual-revenue model combining latex income and end-of-rotation timber sales. With our expert management and high-yielding clone selection, investors can expect predictable annual returns from year 6 onwards.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-gray-800">Investment Highlights</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">FSC-certified plantations — premium pricing in global markets</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">25–35 year productive plantation life per cycle</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Dual income from latex and end-of-life rubberwood timber</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Full plantation management by our experienced agronomists</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-gray-800">Market Advantages</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Established export channels to Europe, USA, Japan and Korea</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Growing demand from automotive and healthcare sectors</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Carbon credit potential supporting ESG investor requirements</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Transparent reporting and quarterly investor updates</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <a href="/investment" className="inline-block px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition duration-300">
                  Learn About Investment Options
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-800 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Rubber Cultivation?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Contact us today to learn more about our FSC-certified rubber plantations, product range, or investment opportunities with Susaru Agro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-8 py-3 bg-white text-slate-800 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
                Contact Us
              </a>
              <a href="/investment" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-800 transition duration-300">
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

export default Rubber;