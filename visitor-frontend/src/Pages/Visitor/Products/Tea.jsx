import React from 'react';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';

const Tea = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-700 to-emerald-800 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <p className="uppercase tracking-widest text-green-300 text-sm font-semibold mb-3">Ceylon's Finest</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Ceylon Tea</h1>
              <p className="text-xl mb-8 leading-relaxed">
                Discover the pride of Sri Lanka — world-renowned Ceylon Tea, grown on misty highland estates and cherished across the globe for its unmatched quality, bold flavour, and rich cultural heritage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/investment" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300 text-center">
                  Investment Options
                </a>
                <a href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition duration-300 text-center">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              {/* IMAGE PLACEHOLDER — replace src with your image path */}
              <img
                src="/src/assets/tea-hero.jpg"
                alt="Ceylon Tea Plantation"
                className="rounded-lg shadow-xl w-full object-cover"
                style={{ minHeight: '320px', background: '#d1fae5' }}
              />
            </div>
          </div>
        </section>

        {/* Key Stats Banner */}
        <section className="bg-green-800 text-white py-10">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-300">2nd</p>
                <p className="text-sm mt-1 text-green-100">Largest Tea Exporter in the World</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-300">300+</p>
                <p className="text-sm mt-1 text-green-100">Years of Tea Heritage in Sri Lanka</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-300">~300k</p>
                <p className="text-sm mt-1 text-green-100">Metric Tons Produced Annually</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-300">150+</p>
                <p className="text-sm mt-1 text-green-100">Countries Receive Ceylon Tea</p>
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
                  src="/src/assets/tea-leaves.jpg"
                  alt="Tea Leaves"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ minHeight: '360px', background: '#d1fae5' }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">What is Ceylon Tea?</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Ceylon Tea refers to tea produced in Sri Lanka (formerly known as Ceylon), grown primarily in the central highlands of the island. Made from the leaves of the Camellia sinensis plant, it is internationally recognised for its exceptional quality, robust flavour, and brilliant golden colour when brewed.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Sri Lanka's unique combination of altitude, climate, and soil creates distinct flavour profiles across different growing regions — from the light, delicate teas of Nuwara Eliya to the full-bodied, rich brews of Ruhuna. Each region contributes a signature character that makes Ceylon Tea one of the most diverse and sought-after teas in the world.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  At Susaru Agro Plantation, we cultivate and manage tea estates across Sri Lanka's prime growing regions, ensuring the highest standards of organic farming and sustainable land management. Our teas carry the iconic Ceylon Tea Lion Logo — a global guarantee of authenticity and quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tea Varieties Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-green-800">Types of Ceylon Tea</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Ceylon Tea is produced in several varieties, each with distinct characteristics shaped by processing methods and growing altitudes.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-green-300">
                <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">White Tea</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The most delicate and least processed variety. Made from young silver buds, it has a subtle, sweet flavour and contains the highest concentration of antioxidants.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-green-500">
                <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Green Tea</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Minimally oxidised, preserving the natural green colour and grassy flavour. Sri Lankan green tea is light, refreshing, and widely valued for its health-promoting properties.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-amber-700">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Black Tea</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The most popular variety, fully oxidised to produce a bold, rich brew with a deep amber hue. The backbone of global tea trade and the signature style of Ceylon Tea.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-purple-400">
                <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Specialty Teas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Includes oolong, silver tips, and flavoured blends. These premium teas command the highest market prices and are crafted for connoisseurs and export to luxury markets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Uses Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Uses of Ceylon Tea</h2>
            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Daily Beverage</h3>
                <p className="text-gray-600 leading-relaxed">
                  Consumed daily by millions across Asia, the Middle East, and Europe, Ceylon Tea is enjoyed as a classic hot brew, iced tea, milk tea, or blended with herbs and spices for premium wellness drinks.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Health & Wellness</h3>
                <p className="text-gray-600 leading-relaxed">
                  Rich in polyphenols, catechins, and flavonoids, Ceylon Tea is linked to reduced risk of heart disease, improved gut health, enhanced immunity, and anti-inflammatory benefits widely studied in modern medical research.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">Beauty & Cosmetics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tea extracts are increasingly used in premium skincare, hair care, and cosmetic formulations for their potent antioxidant and anti-ageing properties, driving new market demand in the beauty industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Valuable Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Why Is Ceylon Tea So Valuable?</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {/* IMAGE PLACEHOLDER */}
                <img
                  src="/src/assets/tea-value.jpg"
                  alt="Ceylon Tea Value"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ minHeight: '360px', background: '#d1fae5' }}
                />
              </div>
              <div>
                <ul className="space-y-5">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Globally Recognised Brand:</span> The Ceylon Tea Lion Logo is one of the world's most recognised origin labels, commanding premium prices in export markets across Europe, the Middle East, Russia, and Asia.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Unique Terroir:</span> Sri Lanka's highland geography, ranging from 600m to 2,100m above sea level, creates distinct flavour profiles that cannot be replicated elsewhere in the world.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Orthodox Manufacturing:</span> Sri Lanka predominantly uses the traditional orthodox method of hand-rolling and slow withering, producing whole-leaf teas of exceptional quality and higher commercial value.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Organic Premium:</span> Organically certified Ceylon Tea fetches significantly higher prices globally, as health-conscious consumers increasingly prioritise clean, pesticide-free produce.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 leading-relaxed"><span className="font-semibold">Year-Round Production:</span> Unlike seasonal crops, tea can be harvested throughout the year in Sri Lanka, providing consistent and reliable revenue streams for estate owners and investors.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Growing Regions Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-green-800">Ceylon Tea Growing Regions</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Sri Lanka is divided into six major tea growing regions, each producing teas with unique characteristics influenced by altitude, rainfall, and microclimate.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-semibold mb-1 text-green-800">Nuwara Eliya</h3>
                <p className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">High Grown · 1,800–2,100m</p>
                <p className="text-gray-600 text-sm leading-relaxed">Known as the "Champagne of Ceylon Teas." Produces the lightest, most delicate and fragrant teas with a distinctive floral aroma, ideal for connoisseurs and luxury export markets.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-semibold mb-1 text-green-800">Dimbula</h3>
                <p className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">High Grown · 1,100–1,700m</p>
                <p className="text-gray-600 text-sm leading-relaxed">Produces well-balanced teas with a brisk, full flavour and light golden colour. Peak quality is reached during January and February when the cold winds known as "Kachan" blow across the estates.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-semibold mb-1 text-green-800">Uva</h3>
                <p className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">High Grown · 900–1,600m</p>
                <p className="text-gray-600 text-sm leading-relaxed">One of the world's three finest tea districts. Uva teas are prized for their unique minty, biscuity flavour with a bright, sparkling liquor that is highly sought after in the global blending market.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-semibold mb-1 text-green-800">Kandy</h3>
                <p className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">Mid Grown · 600–1,200m</p>
                <p className="text-gray-600 text-sm leading-relaxed">Produces medium-strength teas with full body and rich colour. The most historically significant growing region, where Sri Lanka's first commercial tea plantation — Loolecondera — was established in 1867.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-semibold mb-1 text-green-800">Sabaragamuwa</h3>
                <p className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">Low Grown · Below 600m</p>
                <p className="text-gray-600 text-sm leading-relaxed">Produces teas with a deep, rich colour and strong flavour profile. Ideal for tea bag blends, condensed milk teas, and RTD (ready-to-drink) products popular in the mass market.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition duration-300">
                <h3 className="text-lg font-semibold mb-1 text-green-800">Ruhuna</h3>
                <p className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">Low Grown · Below 600m</p>
                <p className="text-gray-600 text-sm leading-relaxed">Grown in the deep south of Sri Lanka, Ruhuna teas are bold, full-bodied, and intensely coloured. Their unique earthy character makes them popular in the Middle Eastern and Russian markets.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Cultivation Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Sustainable Tea Cultivation</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Ideal Growing Conditions</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Tea thrives in Sri Lanka's highland regions, which receive abundant rainfall, moderate temperatures, and well-drained, acidic soils. The ideal altitude ranges from 600m to over 2,000m, with temperatures between 14°C and 27°C and annual rainfall of 1,250mm to 2,500mm.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  At Susaru Agro, our estates are managed using certified organic practices. We avoid synthetic pesticides and fertilisers, instead relying on compost, cover crops, and integrated pest management to maintain soil health and biodiversity.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <p className="font-semibold text-green-800 text-sm mb-1">Temperature</p>
                    <p className="text-gray-600 text-sm">14°C – 27°C optimal</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <p className="font-semibold text-green-800 text-sm mb-1">Rainfall</p>
                    <p className="text-gray-600 text-sm">1,250 – 2,500mm annually</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <p className="font-semibold text-green-800 text-sm mb-1">Soil pH</p>
                    <p className="text-gray-600 text-sm">4.5 – 6.0 (acidic)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <p className="font-semibold text-green-800 text-sm mb-1">Altitude</p>
                    <p className="text-gray-600 text-sm">600m – 2,100m ASL</p>
                  </div>
                </div>
              </div>
              <div>
                {/* IMAGE PLACEHOLDER */}
                <img
                  src="/src/assets/tea-cultivation.jpg"
                  alt="Tea Cultivation"
                  className="rounded-lg shadow-lg w-full object-cover"
                  style={{ minHeight: '400px', background: '#d1fae5' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tea Characteristics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Tea Plant Characteristics</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-10">

              <div className="bg-green-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-green-800">Physical Characteristics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Species:</span> Camellia sinensis var. sinensis (small leaf) and var. assamica (large leaf)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Height:</span> Pruned to 90–120cm for easy harvesting; can grow to 9m if left unmanaged</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Lifespan:</span> A well-maintained tea bush can remain productive for over 100 years</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Harvest:</span> Only the two young leaves and a bud ("two leaves and a bud") are plucked for high-quality tea</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Plucking Rounds:</span> Tea is plucked every 7–14 days throughout the year, providing continuous yield</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-green-800">Processing Methods</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Orthodox:</span> Traditional method of withering, rolling, fermentation, and drying. Produces premium whole-leaf teas with complex flavour profiles.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">CTC (Cut, Tear, Curl):</span> Machine-processed into small granules for strong brews. Widely used for tea bag production and mass-market blends.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Green Tea Processing:</span> Leaves are steamed or pan-fired immediately after plucking to prevent oxidation, preserving the natural green colour and delicate flavour.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">White Tea Processing:</span> Minimal handling — leaves are simply sun-dried or air-dried after plucking, making it the least processed and most natural form of tea.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunity */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Investment Opportunity</h2>
            <div className="bg-white p-8 rounded-lg border border-green-200 shadow-md max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-green-800">Why Invest in Ceylon Tea?</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Tea estate investment offers one of the most stable and proven long-term returns in Sri Lanka's agricultural sector. With consistent global demand, year-round production, and the premium commanded by the Ceylon Tea brand, our tea estate partnership programme presents a compelling opportunity for investors seeking both income and capital appreciation.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-800">Investment Highlights</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Investment in established, producing tea plantations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Quarterly profit distributions from tea production and sale</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Full estate management by Susaru Agro's expert team</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Transparent reporting and profit-sharing arrangements</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-800">Why Ceylon Tea Stands Apart</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Year-round harvesting with no seasonal production gaps</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Strong global export demand across 150+ countries</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Organic certification commands higher international prices</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Long-lived assets — tea bushes productive for 100+ years</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <a href="/investment" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">
                  Learn About Investment Options
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-800 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Ceylon Tea Cultivation?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Contact us today to learn more about our tea estate partnership programmes, investment opportunities, or to arrange a visit to our plantations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-8 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
                Contact Us
              </a>
              <a href="/investment" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-800 transition duration-300">
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

export default Tea;