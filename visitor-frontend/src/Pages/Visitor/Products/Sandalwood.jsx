import React from 'react';
import Header from '../../../Components/Header';
import Footer from '../../../Components/Footer';

const Sandalwood = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-800 to-yellow-700 text-white">
          <div className="max-w-screen-xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Sandalwood</h1>
              <p className="text-xl mb-8">
                Discover the "Queen of Woods" - one of the world's most valuable aromatic trees and a lucrative long-term investment opportunity.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <img 
                src="/src/assets/sandalwood-hero.jpg" 
                alt="Sandalwood Tree" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/600x400?text=Sandalwood+Tree";
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
                  src="/src/assets/sandalwood-tree.jpg" 
                  alt="Sandalwood Tree" 
                  className="rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Sandalwood+Tree";
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-amber-800">What is Sandalwood?</h2>
                <p className="text-gray-700 mb-4">
                  Sandalwood (Santalum album), also known as Chandan or East Indian Sandalwood, is a slow-growing evergreen tree prized for its fragrant heartwood and essential oil. The tree can reach heights of 15-25 feet with a trunk diameter of 30-40 inches at maturity.
                </p>
                <p className="text-gray-700">
                  Unlike many other aromatic woods, sandalwood retains its fragrance for decades. The wood is heavy, yellow, and fine-grained, making it highly valuable for both its aromatic properties and ornamental uses. With proper cultivation, sandalwood can transform even a small piece of land into a highly profitable venture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tree Characteristics Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Sandalwood Tree Characteristics</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-amber-800">Physical Characteristics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Height:</span> 15-25 feet (5-10 meters) tall at maturity</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Trunk:</span> 30-40 inches in girth at maturity</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Bark:</span> Smooth in young trees, turns rough with deep vertical cracks in mature trees</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Wood:</span> Hard, very close-grained, oily with yellow heartwood and white sapwood</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Lifespan:</span> 15+ years with proper care</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-amber-800">Leaves and Flowers</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Leaves:</span> Leathery, elliptical, dark green leaves arranged in pairs on branches</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Flowers:</span> Small, inconspicuous, yellow-green with dark red bracts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Fruits:</span> Orange-red, 2-3cm across with yellow to red flesh and hard seed inside</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><span className="font-semibold">Flowering:</span> Twice a year, typically during March-April and September-October</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-amber-800">Root System</h3>
              <p className="text-gray-700 mb-4">
                Sandalwood is a hemiparasitic tree, meaning it requires host plants to obtain some nutrients. Its root system forms connections (haustoria) with the roots of nearby host plants, allowing it to extract water and nutrients. This unique characteristic makes companion planting essential for successful sandalwood cultivation.
              </p>
              <p className="text-gray-700">
                The root system contributes to soil stability, erosion control, and water retention in tropical ecosystems. Proper management of host plants is crucial for the healthy development of sandalwood trees and the production of high-quality heartwood.
              </p>
            </div>
          </div>
        </section>

        {/* Uses Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Uses of Sandalwood</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-amber-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Perfumery & Cosmetics</h3>
                <p className="text-gray-600">
                  Sandalwood oil is a key ingredient in high-end perfumes, soaps, and cosmetics. Its warm, woody, and sweet fragrance makes it one of the most valuable essential oils in the world.
                </p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Religious & Cultural</h3>
                <p className="text-gray-600">
                  Sandalwood has been used in religious ceremonies across various cultures for centuries. Its paste is used in Hindu rituals, while the wood is carved into religious artifacts and prayer beads.
                </p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Medicinal</h3>
                <p className="text-gray-600">
                  Traditional medicine systems use sandalwood for its anti-inflammatory, antiseptic, and cooling properties. It's used to treat skin conditions, fever, and various ailments in Ayurvedic medicine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cultivation Section */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Sandalwood Cultivation</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-amber-800">Growing Conditions</h3>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h4 className="font-semibold text-lg mb-2">Climate</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Tropical and subtropical climates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Temperature range: 12°C to 35°C (54°F to 95°F)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Annual rainfall: 600mm to 1600mm</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Altitude: 300m to 1100m above sea level</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-lg mb-2">Soil Requirements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Well-drained, sandy loam or red loamy soil</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>pH level: 6.0 to 7.5 (neutral to slightly acidic)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Can tolerate rocky and gravelly soils</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Good drainage is essential</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-amber-800">Propagation Methods</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold text-lg mb-2">Propagation Techniques</h4>
                  <p className="text-gray-700 mb-4">
                    Sandalwood can be propagated through several methods:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-semibold">Seeds:</span>
                        <p className="text-gray-600 mt-1">The most common method. Seeds should be collected from ripe fruits and sown in well-prepared nursery beds.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-semibold">Air-layering (Marcotting):</span>
                        <p className="text-gray-600 mt-1">A viable vegetative propagation method where roots are induced to develop on a branch while still attached to the parent tree.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="font-semibold">Tissue Culture:</span>
                        <p className="text-gray-600 mt-1">Advanced method used for mass production of genetically identical plants with desired traits.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-amber-800">Host Plants</h3>
              <p className="text-gray-700 mb-4">
                As a hemiparasitic tree, sandalwood requires host plants for optimal growth. The right host plants can significantly improve the growth rate and heartwood quality of sandalwood trees.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Primary Host Plants</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Casuarina equisetifolia</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Moringa oleifera (Drumstick)</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Annona squamosa (Custard apple)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Secondary Host Plants</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Acacia nilotica</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Pongamia pinnata</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Sesbania grandiflora</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Opportunity */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">Investment Opportunity</h2>
            <div className="bg-amber-50 p-8 rounded-lg border border-amber-200 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-amber-800">Why Invest in Sandalwood?</h3>
              <p className="text-gray-700 mb-6">
                Sandalwood is often called "green gold" due to its exceptional investment potential. With proper management, a sandalwood plantation can provide substantial returns after 12-15 years of growth.
              </p>
              
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3">Advantages</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Exceptional returns - one of the most profitable tree species to grow</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Relatively short rotation period of 12-15 years compared to other timber species</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Adaptable to various soil types, including stony and gravelly soils</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Global demand exceeds supply, ensuring strong market prices</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-amber-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Value increases approximately 25% year-on-year</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3">Sample Investment Returns</h4>
                <p className="text-gray-700 mb-4">
                  Based on a 1-acre sandalwood plantation with companion crops:
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-amber-100">
                      <th className="border border-amber-200 p-2 text-left">Item</th>
                      <th className="border border-amber-200 p-2 text-right">Value (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-amber-200 p-2">Initial investment (15 years)</td>
                      <td className="border border-amber-200 p-2 text-right">5,80,000</td>
                    </tr>
                    <tr>
                      <td className="border border-amber-200 p-2">Sandalwood heartwood (3,600 kg)</td>
                      <td className="border border-amber-200 p-2 text-right">2,52,00,000</td>
                    </tr>
                    <tr>
                      <td className="border border-amber-200 p-2">Companion crops income</td>
                      <td className="border border-amber-200 p-2 text-right">35,41,500</td>
                    </tr>
                    <tr className="bg-amber-50 font-semibold">
                      <td className="border border-amber-200 p-2">Total net income</td>
                      <td className="border border-amber-200 p-2 text-right">2,81,61,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="text-center">
                <a href="/investment" className="inline-block px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition duration-300">
                  Learn About Investment Options
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-amber-800 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Sandalwood Cultivation?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Contact us today to learn more about our sandalwood cultivation programs or investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-8 py-3 bg-white text-amber-800 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
                Contact Us
              </a>
              <a href="/investment" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-800 transition duration-300">
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

export default Sandalwood;
