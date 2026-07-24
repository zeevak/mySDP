import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAuthAxios } from '../../utils/authUtils';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { generateIndividualCustomerPDF } from '../../utils/customerReportPdfService';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get(`/api/staff/customers/${customerId}`);

      if (response.data && response.data.success) {
        setCustomer(response.data.data);
      } else {
        setError('Failed to fetch customer details');
      }

      // Fetch customer uploaded documents
      try {
        const docsResponse = await authAxios.get(`/api/staff/customers/${customerId}/documents`);
        if (docsResponse.data && docsResponse.data.success) {
          setDocuments(docsResponse.data.data || []);
        }
      } catch (docErr) {
        console.error('Error fetching customer documents:', docErr);
      }
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!customer) return;
    try {
      setIsGeneratingPDF(true);
      await generateIndividualCustomerPDF({
        ...customer,
        documents: documents && documents.length > 0 ? documents : (customer.documents || [])
      });
    } catch (pdfErr) {
      console.error('Error generating PDF report:', pdfErr);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProposalStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'Yet To Start':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const calculateTimeBasedProgress = (startDate, endDate, projectDuration, status) => {
    if (status === 'Yet To Start') return 0;
    if (status === 'Completed') return 100;
    if (!startDate) return 0;

    const start = new Date(startDate);
    const now = new Date();

    let expectedEnd;
    if (endDate) {
      expectedEnd = new Date(endDate);
    } else if (projectDuration) {
      expectedEnd = new Date(start);
      expectedEnd.setFullYear(start.getFullYear() + projectDuration);
    } else {
      expectedEnd = new Date(start);
      expectedEnd.setFullYear(start.getFullYear() + 1);
    }

    const totalDuration = expectedEnd.getTime() - start.getTime();
    const elapsedTime = now.getTime() - start.getTime();

    if (elapsedTime <= 0) return 0;
    if (elapsedTime >= totalDuration) return 95;

    return Math.round((elapsedTime / totalDuration) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <StaffHeader />
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </main>
        <StaffFooter />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <StaffHeader />
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error || 'Customer not found'}</p>
            <Link to="/staff/customers" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
              Back to Customers
            </Link>
          </div>
        </main>
        <StaffFooter />
      </div>
    );
  }

  const { lands = [], proposals = [], projects = [] } = customer;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StaffHeader />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <Link to="/staff/customers" className="hover:text-green-600">Customers</Link>
                <span>&gt;</span>
                <span className="text-gray-800">Customer Details</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {customer.title} {customer.full_name}
              </h1>
              <p className="text-sm text-gray-500">Customer ID: {customer.customer_id}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-md font-semibold text-sm transition duration-150 flex items-center justify-center shadow-sm ${
                  isGeneratingPDF
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>
              <Link
                to="/staff/customers"
                className="flex-1 sm:flex-initial text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-150 text-sm font-semibold"
              >
                Back to Customers
              </Link>
              <Link
                to={`/staff/customers/${customer.customer_id}/add-land`}
                className="flex-1 sm:flex-initial text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 text-sm font-semibold"
              >
                Add New Land
              </Link>
              <Link
                to={`/staff/edit-customer/${customer.customer_id}`}
                className="flex-1 sm:flex-initial text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-150 text-sm font-semibold"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Personal Details */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-150 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</span>
                  <p className="text-gray-800 font-medium">{customer.title} {customer.full_name}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name with Initials</span>
                  <p className="text-gray-800 font-medium">{customer.name_with_ini || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</span>
                  <p className="text-gray-800 font-medium">{customer.f_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</span>
                  <p className="text-gray-800 font-medium">{customer.l_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">NIC Number</span>
                  <p className="text-gray-800 font-medium">{customer.nic_number || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date of Birth</span>
                  <p className="text-gray-800 font-medium">{formatDate(customer.date_of_birth)}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Since</span>
                  <p className="text-gray-800 font-medium">{formatDate(customer.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-150">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                  <p className="text-gray-800 font-medium">{customer.email}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Primary Phone</span>
                  <p className="text-gray-800 font-medium">{customer.phone_no_1 || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Secondary Phone</span>
                  <p className="text-gray-800 font-medium">{customer.phone_no_2 || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Postal Address</span>
                  <p className="text-gray-800 font-medium">
                    {[
                      customer.add_line_1,
                      customer.add_line_2,
                      customer.add_line_3,
                      customer.city,
                      customer.district,
                      customer.province
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-150 mb-8">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Customer Uploaded Documents ({documents.length})</h2>
            </div>
            {documents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No uploaded documents found for this customer.
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {documents.map((doc) => {
                  const ext = (doc.file_name || doc.file_path || '').split('.').pop().toUpperCase();
                  const fullUrl = doc.file_path.startsWith('http') ? doc.file_path : `http://localhost:5001${doc.file_path}`;

                  return (
                    <div key={doc.document_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 font-extrabold text-xs rounded border border-green-200">
                            {ext}
                          </span>
                          <h3 className="font-bold text-gray-800 text-sm truncate" title={doc.caption}>
                            {doc.caption}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 truncate" title={doc.file_name}>
                          File: {doc.file_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Uploaded: {formatDate(doc.created_at)}
                        </p>
                      </div>
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-1.5 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-xs font-semibold transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Open Document</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer Lands Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-150 mb-8">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Lands Registered ({lands.length})</h2>
              <Link
                to={`/staff/customers/${customer.customer_id}/add-land`}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition duration-150 text-xs font-semibold"
              >
                + Add Land
              </Link>
            </div>
            {lands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No lands registered for this customer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Climate Zone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land Shape</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soil Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water / Stones</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lands.map((land) => (
                      <tr key={land.customer_land_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                          {land.customer_land_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {[land.city, land.district, land.province].filter(Boolean).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {land.climate_zone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {land.land_shape || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          {land.land_size ? `${land.land_size} perch` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {land.soil_type || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="block">Water: {land.has_water ? '✅ Yes' : '❌ No'}</span>
                          <span className="block">Stones: {land.has_stones ? '⚠️ Yes' : '✅ No'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/staff/edit-land/${land.customer_land_id}`}
                            className="text-green-600 hover:text-green-900 font-semibold"
                          >
                            Edit Land
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Proposals Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-150 mb-8">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Proposals Submitted ({proposals.length})</h2>
              <Link
                to={`/staff/create-proposal/${customer.customer_id}`}
                className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition duration-150 text-xs font-semibold"
              >
                Create Proposal
              </Link>
            </div>
            {proposals.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No proposals submitted for this customer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposal ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {proposals.map((proposal) => (
                      <tr key={proposal.proposal_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                          {proposal.proposal_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          {proposal.project_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {proposal.project_duration} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {proposal.CustomerLand ? 
                            `${proposal.CustomerLand.city}, ${proposal.CustomerLand.district}` : 
                            'N/A'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          LKR {Number(proposal.project_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                          {proposal.payment_mode}
                          {proposal.payment_mode === 'installments' && ` (${proposal.installment_count} inst.)`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(proposal.proposal_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getProposalStatusColor(proposal.status)}`}>
                            {proposal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/staff/proposals/${proposal.proposal_id}/edit`}
                            className="text-green-600 hover:text-green-900 font-semibold"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-150 mb-8">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-bold text-gray-800">Approved Projects ({projects.length})</h2>
            </div>
            {projects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No active/completed projects for this customer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => {
                      const timeBasedProgress = calculateTimeBasedProgress(
                        project.start_date,
                        project.end_date,
                        project.proposal?.project_duration,
                        project.status
                      );

                      return (
                        <tr 
                          key={project.project_id} 
                          className="hover:bg-gray-50 cursor-pointer transition duration-150"
                          onClick={() => navigate(`/staff/projects/${project.project_id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                            #{project.project_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                            {project.proposal?.project_type || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {project.proposal?.project_duration ? `${project.proposal.project_duration} years` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(project.start_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(project.end_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(timeBasedProgress)}`}
                                  style={{ width: `${timeBasedProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 font-semibold">{timeBasedProgress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getProjectStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                            <Link
                              to={`/staff/projects/${project.project_id}`}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded transition duration-150 font-semibold"
                            >
                              View Project
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <StaffFooter />
    </div>
  );
};

export default CustomerDetails;
