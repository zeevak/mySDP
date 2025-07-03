import React, { useState } from 'react'
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation functions
  const validateName = (name, fieldName) => {
    if (name && !/^[A-Za-z]+$/.test(name)) {
      return `${fieldName} should only contain letters`;
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        return 'Phone number must be 10 digits';
      }
      if (phone.charAt(0) !== '0') {
        return 'Phone number must start with 0';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Validate on change
    if (name === 'firstName') {
      setErrors(prev => ({ ...prev, firstName: validateName(value, 'First name') }));
    } else if (name === 'lastName') {
      setErrors(prev => ({ ...prev, lastName: validateName(value, 'Last name') }));
    } else if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const firstNameError = validateName(formData.firstName, 'First name');
    const lastNameError = validateName(formData.lastName, 'Last name');
    const phoneError = validatePhone(formData.phone);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      phone: phoneError
    });

    // Check if there are any validation errors
    if (firstNameError || lastNameError || phoneError) {
      return; // Prevent form submission if there are errors
    }

    setIsSubmitting(true);

    try {
      // Updated to use port 5001
      const response = await fetch('http://localhost:5001/api/message/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you for your message! We will contact you soon.'
        });
        // Clear the form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          interest: '',
          message: ''
        });
        // Clear errors
        setErrors({
          firstName: '',
          lastName: '',
          phone: ''
        });
      } else {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Contact Header */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto">Have questions about our plantations or investment opportunities? We'd love to hear from you.</p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">Get in Touch</h2>
                <p className="text-gray-700 mb-8">
                  Fill out the form and our team will get back to you within 24 hours, or use our contact information below to reach us directly.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-800">Our Office</h3>
                      <p className="text-gray-600">No. 66/A, Sri Somananda Mawatha, <br />Horana, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-800">Email</h3>
                      <p className="text-gray-600">susaruagro@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-800">Phone</h3>
                      <p className="text-gray-600">+94 70 102 1955</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-800">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8:30am - 5:30pm<br />Saturday: 9am - 1pm<br />Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-green-800">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://web.facebook.com/profile.php?id=61554669269177#" className="text-gray-500 hover:text-green-700" target="_blank" rel="noopener noreferrer">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-green-700">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-green-700">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                    <a href="https://wa.me/94727177635" className="text-gray-500 hover:text-green-700" target="_blank" rel="noopener noreferrer">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M20.472 3.527C18.224 1.277 15.307 0 12.213 0 5.545 0 0.125 5.42 0.125 12.088c0 2.128 0.56 4.211 1.619 6.038l-1.719 6.278 6.433-1.686c1.758 0.957 3.738 1.464 5.755 1.464h0.005c6.668 0 12.088-5.42 12.088-12.088 0-3.095-1.277-6.012-3.527-8.26L20.472 3.527zM12.213 22.1h-0.004c-1.804 0-3.573-0.485-5.112-1.401l-0.367-0.218-3.802 0.997 1.015-3.706-0.239-0.38c-1.009-1.604-1.541-3.452-1.541-5.304 0-5.546 4.514-10.06 10.064-10.06 2.688 0 5.213 1.046 7.109 2.947 1.897 1.897 2.943 4.422 2.942 7.107-0.001 5.546-4.514 10.06-10.064 10.06L12.213 22.1zM17.688 14.586c-0.303-0.152-1.793-0.885-2.07-0.984-0.277-0.101-0.479-0.152-0.681 0.152-0.202 0.303-0.782 0.984-0.959 1.186-0.177 0.202-0.353 0.227-0.656 0.076-0.303-0.152-1.279-0.471-2.437-1.503-0.9-0.802-1.507-1.793-1.684-2.095-0.177-0.303-0.019-0.466 0.133-0.617 0.136-0.135 0.303-0.353 0.454-0.53 0.152-0.177 0.202-0.303 0.303-0.505 0.101-0.202 0.05-0.379-0.025-0.53-0.076-0.152-0.681-1.643-0.934-2.248-0.246-0.59-0.496-0.51-0.681-0.519-0.177-0.009-0.379-0.009-0.581-0.009-0.202 0-0.53 0.076-0.808 0.379-0.277 0.303-1.059 1.036-1.059 2.527 0 1.491 1.085 2.932 1.237 3.134 0.152 0.202 2.145 3.274 5.199 4.589 0.727 0.313 1.293 0.501 1.735 0.642 0.729 0.232 1.393 0.199 1.918 0.121 0.585-0.087 1.793-0.733 2.046-1.441 0.252-0.708 0.252-1.313 0.177-1.441-0.076-0.126-0.277-0.202-0.581-0.353L17.688 14.586z" clipRule="evenodd" /></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-md border border-green-100">
                <h2 className="text-2xl font-bold mb-6 text-green-800">Send Us a Message</h2>

                {submitStatus && (
                  <div className={`p-4 mb-6 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-green-500 focus:border-green-500`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-green-500 focus:border-green-500`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-green-500 focus:border-green-500`}
                      placeholder="0XXXXXXXXX"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">I'm interested in</label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Please select</option>
                      <option value="vanilla-investment">Vanilla Cultivation Investment</option>
                      <option value="sandalwood-investment">Sandalwood Cultivation Investment</option>
                      <option value="agarwood-investment">Agarwood Cultivation Investment</option>
                      <option value="plantation-visit">Plantation Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${isSubmitting ? 'bg-green-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'} text-white font-semibold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Plantation Locations */}
        <section className="py-16 bg-green-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Our Plantation Locations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                <h3 className="text-xl font-semibold mb-3 text-green-800">Mawanella Agarwood Nurcery</h3>
                <p className="text-gray-600 mb-3">High-grown agarwood plantations in the wet zone in Sri Lanka.</p>
                <p className="text-gray-600">
                  <strong>Address:</strong> Aranayake Road, Mawanella<br />
                  <strong>Phone:</strong> +94 52 222 3456
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                <h3 className="text-xl font-semibold mb-3 text-green-800">Kalutara Sandalwood Plantation</h3>
                <p className="text-gray-600 mb-3">FSC-certified rubber cultivation and processing facility.</p>
                <p className="text-gray-600">
                  <strong>Address:</strong> Colombo Road, Kalutara<br />
                  <strong>Phone:</strong> +94 45 222 7890
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                <h3 className="text-xl font-semibold mb-3 text-green-800">Matale Vanilla Farm</h3>
                <p className="text-gray-600 mb-3">Premium vanilla cultivation in the central region of Sri Lanka.</p>
                <p className="text-gray-600">
                  <strong>Address:</strong> Kandy Road, Matale<br />
                  <strong>Phone:</strong> +94 66 223 4567
                </p>
              </div>
            </div>

            <div className="h-96 bg-gray-300 rounded-lg">
              {/* Replace with actual map component or embed */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-600">Interactive map of our plantation locations across Sri Lanka</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage