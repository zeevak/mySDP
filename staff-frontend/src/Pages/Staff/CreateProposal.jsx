import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { getAuthAxios, isAuthenticated, logout } from '../../utils/authUtils';

const CreateProposal = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    project_type: 'Agarwood',
    project_duration: '',
    project_value: '',
    payment_mode: 'full'
  });

  const [availableDurations, setAvailableDurations] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch customer details
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      logout(navigate);
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const authAxios = getAuthAxios();

        const response = await authAxios.get(`/api/staff/customers/${customerId}`);

        if (response.data && response.data.success) {
          setCustomer(response.data.data);
        } else {
          setError('Failed to fetch customer details');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer:', err);

        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            logout(navigate);
          }, 2000);
        } else {
          setError('Error fetching customer details. Please try again.');
        }

        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId, navigate]);

  // Fetch available durations when project type changes
  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const authAxios = getAuthAxios();

        const response = await authAxios.get(`/api/proposal/durations/${formData.project_type}`);

        if (response.data && response.data.success) {
          setAvailableDurations(response.data.data);
          // Set default duration to first available
          if (response.data.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              project_duration: response.data.data[0]
            }));
          }
        } else {
          console.error('Failed to fetch durations');
        }
      } catch (err) {
        console.error('Error fetching durations:', err);

        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            logout(navigate);
          }, 2000);
        }
      }
    };

    if (formData.project_type) {
      fetchDurations();
    }
  }, [formData.project_type, navigate]);

  // Calculate payment details when relevant fields change
  useEffect(() => {
    const calculatePayment = async () => {
      if (!formData.project_value || !formData.project_duration) return;

      try {
        setCalculating(true);
        const authAxios = getAuthAxios();

        const response = await authAxios.post('/api/proposal/calculate-installments', {
          projectValue: parseFloat(formData.project_value),
          projectDuration: parseInt(formData.project_duration),
          paymentMode: formData.payment_mode
        });

        if (response.data && response.data.success) {
          // When switching payment modes, clear previous payment details first
          // to avoid accessing stale data structure
          setPaymentDetails(null);

          // Then set the new payment details after a short delay
          setTimeout(() => {
            setPaymentDetails(response.data.data);
            setCalculating(false);
          }, 50);
        } else {
          console.error('Failed to calculate payment details');
          setCalculating(false);
        }
      } catch (err) {
        console.error('Error calculating payment:', err);
        setCalculating(false);

        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            logout(navigate);
          }, 2000);
        }
      }
    };

    // Debounce calculation to avoid too many requests
    const timer = setTimeout(() => {
      if (formData.project_value && formData.project_duration) {
        calculatePayment();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.project_value, formData.project_duration, formData.payment_mode, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.project_type || !formData.project_duration || !formData.project_value || !formData.payment_mode) {
      setError('All fields are required');
      return;
    }

    // Show confirmation dialog
    setShowConfirm(true);
  };

  // Handle proposal creation
  const createProposal = async () => {
    try {
      setSubmitting(true);
      const authAxios = getAuthAxios();

      const proposalData = {
        customer_id: customerId,
        project_type: formData.project_type,
        project_duration: parseInt(formData.project_duration),
        project_value: parseFloat(formData.project_value),
        payment_mode: formData.payment_mode
      };

      // Add installment details if applicable
      if (formData.payment_mode === 'installments' && paymentDetails && paymentDetails.installments) {
        proposalData.installment_count = paymentDetails.installments.count;
        proposalData.installment_amount = paymentDetails.installments.amount;
      } else if (formData.payment_mode === 'full') {
        // For full payment, set installment fields to null
        proposalData.installment_count = null;
        proposalData.installment_amount = null;
      }

      console.log('Sending proposal data:', proposalData);

      const response = await authAxios.post('/api/proposal', proposalData);

      if (response.data && response.data.success) {
        setSuccess('Proposal created successfully!');
        setShowConfirm(false);

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/staff/dashboard');
        }, 2000);
      } else {
        setError('Failed to create proposal');
        setShowConfirm(false);
      }

      setSubmitting(false);
    } catch (err) {
      console.error('Error creating proposal:', err);

      // Get more detailed error message if available
      let errorMessage = 'Error creating proposal. Please try again.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = `Error: ${err.response.data.error}`;
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      // Handle unauthorized error
      if (err.response && err.response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        setTimeout(() => {
          logout(navigate);
        }, 2000);
      }

      setError(errorMessage);
      setShowConfirm(false);
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Create Proposal</h1>
            <button
              onClick={() => navigate('/staff/submit-proposal')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Back to Customer Selection
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
              {success}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : customer ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Customer Info */}
              <div className="p-6 bg-green-50 border-b border-green-100">
                <h2 className="text-lg font-semibold text-green-800 mb-2">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name:</p>
                    <p className="font-medium">{customer.title} {customer.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone:</p>
                    <p className="font-medium">{customer.phone_no_1 || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIC:</p>
                    <p className="font-medium">{customer.nic_number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Proposal Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="Agarwood">Agarwood</option>
                      <option value="Sandalwood">Sandalwood</option>
                      <option value="Vanilla">Vanilla</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Project Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Duration (Years)
                    </label>
                    <select
                      name="project_duration"
                      value={formData.project_duration}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      {availableDurations.map(duration => (
                        <option key={duration} value={duration}>{duration} Year{duration !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Project Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Value (LKR)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="project_value"
                        value={formData.project_value}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-right pr-16"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">LKR</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Mode
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="payment_mode"
                          value="full"
                          checked={formData.payment_mode === 'full'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Full Payment (10% Discount)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="payment_mode"
                          value="installments"
                          checked={formData.payment_mode === 'installments'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Installments</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Details */}
                  {paymentDetails && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="text-md font-semibold text-gray-700 mb-3">Payment Details</h3>

                      {formData.payment_mode === 'full' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Original Amount:</span>
                            <span>{formatCurrency(paymentDetails.originalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount ({paymentDetails.discountPercentage}%):</span>
                            <span className="text-green-600">-{formatCurrency(paymentDetails.discountAmount)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Final Amount:</span>
                            <span>{formatCurrency(paymentDetails.finalAmount)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span>{formatCurrency(paymentDetails.originalAmount)}</span>
                          </div>
                          {paymentDetails.installments && (
                            <div className="flex justify-between font-semibold">
                              <span>Monthly Installments:</span>
                              <span>{paymentDetails.installments.count} × {formatCurrency(paymentDetails.installments.amount)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                      disabled={calculating || !paymentDetails}
                    >
                      {calculating ? 'Calculating...' : 'Confirm Proposal'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md border border-yellow-200">
              Customer not found. Please go back and select a valid customer.
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Proposal</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to create this proposal for {customer?.title} {customer?.full_name}?
            </p>

            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Project Type:</div>
                <div className="font-medium">{formData.project_type}</div>

                <div className="text-gray-600">Duration:</div>
                <div className="font-medium">{formData.project_duration} Years</div>

                <div className="text-gray-600">Value:</div>
                <div className="font-medium">{formatCurrency(formData.project_value)}</div>

                <div className="text-gray-600">Payment Mode:</div>
                <div className="font-medium">{formData.payment_mode === 'full' ? 'Full Payment' : 'Installments'}</div>

                {formData.payment_mode === 'full' && paymentDetails && (
                  <>
                    <div className="text-gray-600">Discounted Amount:</div>
                    <div className="font-medium">{formatCurrency(paymentDetails.finalAmount)}</div>
                  </>
                )}

                {formData.payment_mode === 'installments' && paymentDetails && paymentDetails.installments && (
                  <>
                    <div className="text-gray-600">Monthly Installments:</div>
                    <div className="font-medium">
                      {paymentDetails.installments.count} × {formatCurrency(paymentDetails.installments.amount)}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={createProposal}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <StaffFooter />
    </div>
  );
};

export default CreateProposal;
