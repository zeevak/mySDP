import React from 'react'
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const ProjectsPage = () => {
  // Sample project data for Susaru Agro Plantation
  const projects = [
    {
      id: 1,
      title: "Tea Estate Expansion",
      category: "Tea Cultivation",
      image: "/images/projects/tea-estate.jpg",
      description: "Expansion of our premium tea cultivation across 200 hectares in the Nuwara Eliya region, implementing sustainable farming practices."
    },
    {
      id: 2,
      title: "Organic Certification Program",
      category: "Sustainability",
      image: "/images/projects/organic-certification.jpg",
      description: "Implementation of organic certification standards across all our plantations, resulting in USDA and EU organic certifications."
    },
    {
      id: 3,
      title: "Vanilla Cultivation Initiative",
      category: "Spice Farming",
      image: "/images/projects/vanilla-plantation.jpg",
      description: "Introduction of premium vanilla cultivation with 2,000 vines per acre, yielding approximately 4kg per vine after 2.5 years."
    },
    {
      id: 4,
      title: "Rubber Processing Facility",
      category: "Rubber Production",
      image: "/images/projects/rubber-facility.jpg",
      description: "State-of-the-art processing facility for producing FSC-certified rubber products including sole crepe, latex crepe, and centrifuged latex."
    },
    {
      id: 5,
      title: "Community Development Program",
      category: "Social Responsibility",
      image: "/images/projects/community-program.jpg",
      description: "Comprehensive initiative providing education, healthcare, and housing improvements for plantation worker communities."
    },
    {
      id: 6,
      title: "Water Conservation System",
      category: "Environmental Sustainability",
      image: "/images/projects/water-conservation.jpg",
      description: "Implementation of advanced irrigation and rainwater harvesting systems, reducing water consumption by 40% across our plantations."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Projects Header */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Plantation Projects</h1>
            <p className="text-xl max-w-2xl mx-auto">Explore our sustainable agricultural initiatives and plantation development projects.</p>
          </div>
        </section>

        {/* Project Filters */}
        <section className="py-8 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-4 py-2 bg-green-700 text-white rounded-md">All Projects</button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">Tea Cultivation</button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">Rubber Production</button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">Spice Farming</button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">Sustainability</button>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map(project => (
                <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-green-100">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="text-sm text-green-600 font-semibold">{project.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-3 text-green-800">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <a href={`/projects/${project.id}`} className="text-green-700 font-semibold hover:text-green-900">View Details →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability Impact */}
        <section className="bg-white py-16 border-t border-green-100">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Sustainability Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">40% Reduction</h3>
                <p className="text-gray-600">In water usage through advanced irrigation systems</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">100% Renewable</h3>
                <p className="text-gray-600">Energy usage across all processing facilities</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">5,000+ Families</h3>
                <p className="text-gray-600">Supported through our community development programs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-50 py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-green-800">Interested in Our Plantation Projects?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">Learn more about investment opportunities in our sustainable agricultural initiatives.</p>
            <a href="/investment" className="inline-block px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition duration-300">Explore Investment Options</a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default ProjectsPage;
