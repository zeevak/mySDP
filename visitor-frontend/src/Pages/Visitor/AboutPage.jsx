import React from 'react'
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Deshabandhu Idippulige",
      role: "Founder & CEO",
      image: "/images/team/chandana.jpg",
      bio: "Deshabandhu has over 20 years of experience in plantation management and sustainable agriculture."
    },
    {
      id: 2,
      name: "Kumari Jayawardena",
      role: "Head of Agarwood Operations",
      image: "/images/team/kumari.jpg",
      bio: "Kumari brings extensive knowledge of agarwood cultivation and processing from her 15 years in the industry."
    },
    {
      id: 3,
      name: "Rohan Perera",
      role: "Financial Manager",
      image: "/images/team/rohan.jpg",
      bio: "Rohan brings over 15 years of experience in agricultural finance and investment management."
    },
    {
      id: 4,
      name: "Dilini Fernando",
      role: "Agricultural Director",
      image: "/images/team/dilini.jpg",
      bio: "Dilini oversees our spice cultivation programs and ensures adherence to organic farming practices."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* About Header */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About Susaru Agro Plantation</h1>
            <p className="text-xl max-w-2xl mx-auto">Learn about our sustainable plantation, our mission, and the team behind our premium agricultural products.</p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Established in 2010, Susaru Agro Plantation began with a vision to create sustainable agricultural practices while producing premium quality tea, rubber, and spices in the lush highlands of Sri Lanka.
                </p>
                <p className="text-gray-700 mb-4">
                  What started as a modest tea plantation has expanded into a diversified agricultural enterprise spanning over 500 hectares across multiple regions of Sri Lanka, including Nuwara Eliya, Dimbula, and Sabaragamuwa.
                </p>
                <p className="text-gray-700">
                  Throughout our journey, we've remained committed to our core values of sustainability, quality, and community development. We believe in preserving the environment while creating valuable investment opportunities and supporting local communities.
                </p>
              </div>
              <div>
                <img src="/images/about/plantation-aerial.jpg" alt="Susaru Plantation" className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Values */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Mission & Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-800">Sustainability</h3>
                <p className="text-gray-600">We implement eco-friendly farming practices that preserve biodiversity, conserve water, and minimize our carbon footprint.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-800">Quality</h3>
                <p className="text-gray-600">We're committed to excellence in every aspect of our operations, from cultivation techniques to processing methods to product certification.</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-green-800">Community Development</h3>
                <p className="text-gray-600">We invest in the wellbeing of our workers and local communities through education, healthcare, and infrastructure development programs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Certifications */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Certifications</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow text-center border border-green-100">
                <img src="/images/certifications/organic.png" alt="Organic Certification" className="h-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-green-800">USDA Organic</h3>
                <p className="text-gray-600">Certified organic cultivation practices free from synthetic pesticides and fertilizers</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow text-center border border-green-100">
                <img src="/images/certifications/fsc.png" alt="FSC Certification" className="h-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-green-800">FSC Certified</h3>
                <p className="text-gray-600">Forest Stewardship Council certification for responsible forest management</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow text-center border border-green-100">
                <img src="/images/certifications/rainforest-alliance.png" alt="Rainforest Alliance" className="h-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-green-800">Rainforest Alliance</h3>
                <p className="text-gray-600">Meeting comprehensive sustainability standards for environmental protection</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow text-center border border-green-100">
                <img src="/images/certifications/fair-trade.png" alt="Fair Trade" className="h-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-green-800">Fair Trade</h3>
                <p className="text-gray-600">Ensuring fair prices, decent working conditions, and community development</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow text-center border border-green-100">
                  <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800">{member.name}</h3>
                    <p className="text-green-600 mb-4">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Want to Join Our Journey?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">We're always looking for passionate individuals to join our team or investors interested in sustainable agriculture.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/careers" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">View Opportunities</a>
              <a href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition duration-300">Contact Us</a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default AboutPage
