import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { getAuthAxios, isAuthenticated, logout } from '../../utils/authUtils';

const EditProposal = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [customerLands, setCustomerLands] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    customer_land_id: '',
    project_type: '',
    project_duration: '',
    project_value: '',
    payment_mode: '',
    status: ''
  });

  const [availableDurations, setAvailableDurations] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch proposal details
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      logout(navigate);
      return;
    }

    const fetchProposal = async () => {
      try {
        setLoading(true);
        const authAxios = getAuthAxios();

        const response = await authAxios.get(`/api/proposal/${proposalId}`);

        if (response.data && response.data.success) {
          const proposalData = response.data.data;
          setProposal(proposalData);
          
          // Set form data
          setFormData({
            customer_land_id: proposalData.customer_land_id || '',
            project_type: proposalData.project_type || '',
            project_duration: proposalData.project_duration || '',
            project_value: proposalData.project_value || '',
            payment_mode: proposalData.payment_mode || '',
            status: proposalData.status || ''
          });

          // Fetch customer details and lands
          if (proposalData.customer_id) {
            const customerResponse = await authAxios.get(`/api/staff/customers/${proposalData.customer_id}`);
            if (customerResponse.data && customerResponse.data.success) {
              setCustomer(customerResponse.data.data);
            }

            // Fetch customer lands
            const landsResponse = await authAxios.get(`/api/proposal/customer-lands/${proposalData.customer_id}`);
            if (landsResponse.data && landsResponse.data.success) {
              setCustomerLands(landsResponse.data.data);
            }
          }
        } else {
          setError('Failed to fetch proposal details');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError('Failed to fetch proposal details. Please try again.');
        setLoading(false);
        
        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          logout(navigate);
        }
      }
    };

    fetchProposal();
  }, [proposalId, navigate]);

  // Fetch available durations when project type changes
  useEffect(() => {
    if (formData.project_type) {
      const fetchDurations = async () => {
        try {
          const authAxios = getAuthAxios();
          const response = await authAxios.get(`/api/proposal/durations/${formData.project_type}`);
          
          if (response.data && response.data.success) {
            setAvailableDurations(response.data.data);
          }
        } catch (err) {
          console.error('Error fetching durations:', err);
        }
      };

      fetchDurations();
    }
  }, [formData.project_type]);

  // Calculate payment details when form changes
  useEffect(() => {
    const calculatePayment = async () => {
      try {
        setCalculating(true);
        const authAxios = getAuthAxios();
        
        const response = await authAxios.post('/api/proposal/calculate-installments', {
          project_value: parseFloat(formData.project_value),
          payment_mode: formData.payment_mode
        });

        if (response.data && response.data.success) {
          setPaymentDetails(response.data.data);
        }
      } catch (err) {
        console.error('Error calculating payment:', err);
      } finally {
        setCalculating(false);
      }
    };

    if (formData.project_value && formData.payment_mode) {
      calculatePayment();
    }
  }, [formData.project_value, formData.payment_mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.project_type || !formData.project_duration || !formData.project_value || !formData.payment_mode) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const authAxios = getAuthAxios();

      const updatedData = {
        project_type: formData.project_type,
        project_duration: parseInt(formData.project_duration),
        project_value: parseFloat(formData.project_value),
        payment_mode: formData.payment_mode,
        status: formData.status
      };

      // Add installment details if payment mode is installment
      if (formData.payment_mode === 'installment' && paymentDetails) {
        updatedData.installment_count = paymentDetails.installments.count;
        updatedData.installment_amount = paymentDetails.installments.amount;
      } else {
        updatedData.installment_count = null;
        updatedData.installment_amount = null;
      }

      const response = await authAxios.patch(`/api/proposal/${proposalId}`, updatedData);

      if (response.data && response.data.success) {
        setSuccess('Proposal updated successfully!');
        setTimeout(() => {
          navigate('/staff/proposals');
        }, 2000);
      } else {
        setError('Failed to update proposal');
      }
    } catch (err) {
      console.error('Error updating proposal:', err);
      setError('Failed to update proposal. Please try again.');
      
      // Handle unauthorized error
      if (err.response && err.response.status === 401) {
        logout(navigate);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle land selection update
  const handleLandUpdate = async (newLandId) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const authAxios = getAuthAxios();
      
      const response = await authAxios.patch(`/api/proposal/${proposalId}/land`, {
        customer_land_id: newLandId
      });

      if (response.data && response.data.success) {
        setSuccess('Land selection updated successfully!');
        setFormData(prev => ({
          ...prev,
          customer_land_id: newLandId
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update land selection');
      }
    } catch (err) {
      console.error('Error updating land selection:', err);
      setError('Failed to update land selection. Please try again.');
      
      // Handle unauthorized error
      if (err.response && err.response.status === 401) {
        logout(navigate);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <StaffHeader />
        <main className="flex-grow bg-gray-50 p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </main>
        <StaffFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />
      
      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Proposal</h1>
            <button
              onClick={() => navigate('/staff/proposals')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Proposals
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Customer Info */}
          {customer && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{customer.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Proposal Details</h2>
            
            {/* Land Selection Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-md font-medium text-gray-800 mb-3">Land Selection</h3>
              {customerLands.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Land for this Proposal
                    </label>
                    <select
                      value={formData.customer_land_id}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          customer_land_id: e.target.value
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select a land...</option>
                      {customerLands.map(land => (
                        <option key={land.customer_land_id} value={land.customer_land_id}>
                          {land.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLandUpdate(formData.customer_land_id)}
                    disabled={!formData.customer_land_id || submitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Updating...' : 'Update Land Selection'}
                  </button>
                  {!formData.customer_land_id && (
                    <p className="text-sm text-red-600">
                      ⚠️ This proposal needs a land selection. Please select a land above.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  No lands available for this customer. Please add a land first.
                </p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Project Type</option>
                  <option value="Agarwood">Agarwood</option>
                  <option value="Coconut">Coconut</option>
                  <option value="Cinnamon">Cinnamon</option>
                  <option value="Pepper">Pepper</option>
                  <option value="Vanilla">Vanilla</option>
                </select>
              </div>

              {/* Project Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Duration *
                </label>
                <select
                  name="project_duration"
                  value={formData.project_duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Duration</option>
                  {availableDurations.map(duration => (
                    <option key={duration.months} value={duration.months}>
                      {duration.months} months
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Value (LKR) *
                </label>
                <input
                  type="number"
                  name="project_value"
                  value={formData.project_value}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode *
                </label>
                <select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="full">Full Payment</option>
                  <option value="installment">Installment</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Payment Details */}
              {paymentDetails && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-medium">LKR {paymentDetails.total_amount}</p>
                    </div>
                    {formData.payment_mode === 'installment' && (
                      <>
                        <div>
                          <p className="text-gray-600">Number of Installments</p>
                          <p className="font-medium">{paymentDetails.installments.count}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Installment Amount</p>
                          <p className="font-medium">LKR {paymentDetails.installments.amount}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/staff/proposals')}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || calculating}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <StaffFooter />
    </div>
  );
};

export default EditProposal;
