import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthAxios, getUserRole } from '../../utils/authUtils';
import Staff_Header from '../../Components/Staff_Header';
import Staff_Footer from '../../Components/Staff_Footer';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });
  const [progressForm, setProgressForm] = useState({
    date: new Date().toISOString().split('T')[0],
    work_completed: '',
    next_steps: '',
    weather_conditions: '',
    soil_conditions: '',
    irrigation_status: '',
    pest_disease_status: '',
    challenges_faced: '',
    materials_used: '',
    labor_hours: '',
    notes: ''
  });

  const [showEditProgressModal, setShowEditProgressModal] = useState(false);
  const [editProgressId, setEditProgressId] = useState(null);
  const [editProgressForm, setEditProgressForm] = useState({
    date: '',
    work_completed: '',
    next_steps: '',
    weather_conditions: '',
    soil_conditions: '',
    irrigation_status: '',
    pest_disease_status: '',
    challenges_faced: '',
    materials_used: '',
    labor_hours: '',
    notes: ''
  });

  const [paymentsData, setPaymentsData] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState(null);
  const [installmentSearchTerm, setInstallmentSearchTerm] = useState('');
  const [selectedInstallment, setSelectedInstallment] = useState('');

  const handleEditProgressClick = (progress) => {
    setEditProgressId(progress.progress_id);
    setEditProgressForm({
      date: progress.date ? progress.date.split('T')[0] : '',
      work_completed: progress.work_completed || '',
      next_steps: progress.next_steps || '',
      weather_conditions: progress.weather_conditions || '',
      soil_conditions: progress.soil_conditions || '',
      irrigation_status: progress.irrigation_status || '',
      pest_disease_status: progress.pest_disease_status || '',
      challenges_faced: progress.challenges_faced || '',
      materials_used: progress.materials_used || '',
      labor_hours: progress.labor_hours !== null && progress.labor_hours !== undefined ? String(progress.labor_hours) : '',
      notes: progress.notes || ''
    });
    setShowEditProgressModal(true);
  };

  const handleEditProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      const authAxios = getAuthAxios();

      const payload = { ...editProgressForm };
      if (payload.labor_hours === '') {
        payload.labor_hours = null;
      }

      const response = await authAxios.put(`/api/project/${projectId}/progress/${editProgressId}`, payload);

      if (response.data.success) {
        setShowEditProgressModal(false);
        setEditProgressId(null);
        refetchProjectDetails();
        alert('Progress entry updated successfully!');
      } else {
        alert('Failed to update progress entry');
      }
    } catch (err) {
      console.error('Error updating progress entry:', err);
      alert('Error updating progress entry');
    }
  };

  const handleDeleteProgressClick = async (progressId) => {
    if (window.confirm("Are you sure you want to delete this progress entry?")) {
      try {
        const authAxios = getAuthAxios();
        const response = await authAxios.delete(`/api/project/${projectId}/progress/${progressId}`);
        if (response.data.success) {
          refetchProjectDetails();
          alert("Progress entry deleted successfully!");
        } else {
          alert("Failed to delete progress entry");
        }
      } catch (err) {
        console.error("Error deleting progress entry:", err);
        alert("Error deleting progress entry");
      }
    }
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const authAxios = getAuthAxios();
        const response = await authAxios.get(`/api/project/${projectId}`);

        if (response.data.success) {
          setProject(response.data.data);
          setStatusForm({
            status: response.data.data.status,
            start_date: response.data.data.start_date ? response.data.data.start_date.split('T')[0] : '',
            end_date: response.data.data.end_date ? response.data.data.end_date.split('T')[0] : ''
          });
        } else {
          setError('Failed to fetch project details');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Error fetching project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
    fetchPaymentDetails();
  }, [projectId]);

  const refetchProjectDetails = async () => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get(`/api/project/${projectId}`);

      if (response.data.success) {
        setProject(response.data.data);
        setStatusForm({
          status: response.data.data.status,
          start_date: response.data.data.start_date ? response.data.data.start_date.split('T')[0] : '',
          end_date: response.data.data.end_date ? response.data.data.end_date.split('T')[0] : ''
        });
      } else {
        setError('Failed to fetch project details');
      }
      fetchPaymentDetails();
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Error fetching project details');
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      setPaymentsLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get(`/api/project/${projectId}/payments`);
      if (response.data.success) {
        setPaymentsData(response.data.data);
        setPaymentsError(null);
        if (response.data.data.payment_mode === 'installments') {
          setSelectedInstallment(String(response.data.data.next_installment_number));
        }
      } else {
        setPaymentsError('Failed to fetch payment details');
      }
    } catch (err) {
      console.error('Error fetching payment details:', err);
      setPaymentsError('Error fetching payment details');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleMarkFullPaymentPaid = async () => {
    if (window.confirm("Are you sure you want to mark this project as FULLY PAID?")) {
      try {
        const authAxios = getAuthAxios();
        const response = await authAxios.post(`/api/project/${projectId}/payments`, {
          payment_detail: 'Full Payment'
        });
        if (response.data.success) {
          fetchPaymentDetails();
          alert('Full payment marked successfully!');
        } else {
          alert(response.data.message || 'Failed to record payment');
        }
      } catch (err) {
        console.error('Error marking full payment paid:', err);
        alert(err.response?.data?.message || 'Error recording payment');
      }
    }
  };

  const handleMarkInstallmentPaid = async (instNum) => {
    if (!instNum) {
      alert('Please select an installment to mark as paid');
      return;
    }
    
    const nextExpected = paymentsData?.next_installment_number;
    if (parseInt(instNum) !== nextExpected) {
      alert(`Installments must be paid in sequence. Next expected installment is ${nextExpected}.`);
      return;
    }

    if (window.confirm(`Are you sure you want to mark Installment ${instNum} as PAID?`)) {
      try {
        const authAxios = getAuthAxios();
        const response = await authAxios.post(`/api/project/${projectId}/payments`, {
          installment_number: instNum
        });
        if (response.data.success) {
          fetchPaymentDetails();
          alert(`Installment ${instNum} payment recorded successfully!`);
        } else {
          alert(response.data.message || 'Failed to record payment');
        }
      } catch (err) {
        console.error('Error marking installment paid:', err);
        alert(err.response?.data?.message || 'Error recording payment');
      }
    }
  };

  const handleUnmarkPayment = async (paymentId, detail) => {
    if (window.confirm(`Are you sure you want to delete the payment record for "${detail}"?`)) {
      try {
        const authAxios = getAuthAxios();
        const response = await authAxios.delete(`/api/project/${projectId}/payments/${paymentId}`);
        if (response.data.success) {
          fetchPaymentDetails();
          alert('Payment record deleted successfully.');
        } else {
          alert(response.data.message || 'Failed to delete payment record');
        }
      } catch (err) {
        console.error('Error deleting payment record:', err);
        alert(err.response?.data?.message || 'Error deleting payment record');
      }
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put(`/api/project/${projectId}/status`, statusForm);

      if (response.data.success) {
        setProject(response.data.data);
        setShowStatusModal(false);
        alert('Project status updated successfully!');
      } else {
        alert('Failed to update project status');
      }
    } catch (err) {
      console.error('Error updating project status:', err);
      alert('Error updating project status');
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.post(`/api/project/${projectId}/progress`, progressForm);

      if (response.data.success) {
        setShowProgressModal(false);
        setProgressForm({
          date: new Date().toISOString().split('T')[0],
          work_completed: '',
          next_steps: '',
          weather_conditions: '',
          soil_conditions: '',
          irrigation_status: '',
          pest_disease_status: '',
          challenges_faced: '',
          materials_used: '',
          labor_hours: '',
          notes: ''
        });
        refetchProjectDetails(); // Refresh project details
        alert('Progress entry added successfully!');
      } else {
        alert('Failed to add progress entry');
      }
    } catch (err) {
      console.error('Error adding progress entry:', err);
      alert('Error adding progress entry');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yet To Start':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProposalDurationYears = () => {
    const duration = Number(project?.proposal?.project_duration);
    return Number.isFinite(duration) && duration > 0 ? duration : null;
  };

  const calculateExpectedEndDate = (startDate, durationYears) => {
    if (!startDate || !durationYears) return null;
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) return null;

    const end = new Date(start);
    end.setFullYear(end.getFullYear() + durationYears);
    return end;
  };

  // Calculate time-based progress percentage
  const calculateTimeBasedProgress = (startDate, endDate, projectDuration) => {
    if (!startDate) return 0;

    const start = new Date(startDate);
    const now = new Date();

    // If project is completed, return 100%
    if (endDate) return 100;

    const durationYears = Number(projectDuration);
    if (!Number.isFinite(durationYears) || durationYears <= 0) return 0;

    const expectedEnd = new Date(start);
    expectedEnd.setFullYear(start.getFullYear() + durationYears);

    const totalDuration = expectedEnd.getTime() - start.getTime();
    const elapsedTime = now.getTime() - start.getTime();

    if (elapsedTime <= 0) return 0;
    if (elapsedTime >= totalDuration) return 95; // Cap at 95% until completion

    return Math.round((elapsedTime / totalDuration) * 100);
  };

  // Get timeline color based on progress status
  const getTimelineColor = (date, isCompleted = false) => {
    const progressDate = new Date(date);
    const now = new Date();
    const daysDiff = Math.floor((now - progressDate) / (1000 * 60 * 60 * 24));

    if (isCompleted) return 'border-green-500 bg-green-50';
    if (daysDiff === 0) return 'border-blue-500 bg-blue-50'; // Today
    if (daysDiff <= 7) return 'border-yellow-500 bg-yellow-50'; // Within a week
    if (daysDiff <= 30) return 'border-orange-500 bg-orange-50'; // Within a month
    return 'border-gray-500 bg-gray-50'; // Older
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Staff_Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        </div>
        <Staff_Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Staff_Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl text-red-300 mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Project Not Found</h3>
            <p className="text-gray-500 mb-4">{error || 'The requested project could not be found.'}</p>
            <button
              onClick={() => navigate('/staff/projects')}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Back to Projects
            </button>
          </div>
        </div>
        <Staff_Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Staff_Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/staff/projects')}
            className="text-green-600 hover:text-green-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Project #{project.project_id}</h1>
              <p className="text-gray-600">{project.proposal?.project_type || 'Agricultural Project'}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowProgressModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Progress
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column Wrapper */}
          <div className="space-y-8">
            {/* Project Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>



              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium text-gray-800">{project.proposal?.customer?.full_name || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-800">{project.proposal?.customer_land?.city || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Land Size</p>
                <p className="font-medium text-gray-800">{project.proposal?.customer_land?.land_size || 'N/A'} perches</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Project Duration</p>
                <p className="font-medium text-gray-800">
                  {project.proposal?.project_duration ? `${project.proposal.project_duration} years` : 'N/A'}
                </p>
              </div>

              {project.start_date && (
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-800">{new Date(project.start_date).toLocaleDateString()}</p>
                </div>
              )}

              {project.end_date && (
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-800">{new Date(project.end_date).toLocaleDateString()}</p>
                </div>
              )}

              {project.start_date && !project.end_date && calculateExpectedEndDate(project.start_date, getProposalDurationYears()) && (
                <div>
                  <p className="text-sm text-gray-600">Expected End Date</p>
                  <p className="font-medium text-gray-800">
                    {calculateExpectedEndDate(project.start_date, getProposalDurationYears()).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Project Timeline Visualization */}
              {project.start_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Project Timeline</p>
                  <div className="relative">
                    {(() => {
                      const startDate = new Date(project.start_date);
                      const expectedEndDate = calculateExpectedEndDate(project.start_date, getProposalDurationYears());
                      const endDate = project.end_date ? new Date(project.end_date) : expectedEndDate;
                      if (!endDate) {
                        return (
                          <div className="text-sm text-gray-500">
                            Project duration is missing, so expected end date cannot be calculated.
                          </div>
                        );
                      }
                      const currentDate = new Date();

                      const totalDuration = endDate.getTime() - startDate.getTime();
                      const elapsedTime = Math.min(currentDate.getTime() - startDate.getTime(), totalDuration);
                      const progressPercentage = totalDuration > 0 ? Math.max(0, (elapsedTime / totalDuration) * 100) : 0;

                      const startDateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const endDateStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                      return (
                        <div className="space-y-1">
                          {/* Timeline bar */}
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            ></div>
                          </div>

                          {/* Timeline labels at the bottom */}
                          <div className="flex justify-between text-xs text-gray-500 pt-1">
                            <div className="text-left">
                              <div className="font-semibold text-blue-600">Start</div>
                              <div>{startDateStr}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                {project.end_date ? 'End' : 'Expected End'}
                              </div>
                              <div>{endDateStr}</div>
                            </div>
                          </div>

                          {/* Timeline stats */}
                          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium">Days elapsed:</span>
                                <span className="ml-1">{Math.max(0, Math.floor(elapsedTime / (1000 * 60 * 60 * 24)))}</span>
                              </div>
                              <div>
                                <span className="font-medium">Total duration:</span>
                                <span className="ml-1">{Math.floor(totalDuration / (1000 * 60 * 60 * 24))} days</span>
                              </div>
                              <div>
                                <span className="font-medium">Days remaining:</span>
                                <span className="ml-1">{Math.max(0, Math.floor((totalDuration - elapsedTime) / (1000 * 60 * 60 * 24)))}</span>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <span className={`ml-1 font-medium ${progressPercentage >= 100 ? 'text-green-600' :
                                  progressPercentage >= 75 ? 'text-yellow-600' :
                                    'text-blue-600'
                                  }`}>
                                  {progressPercentage >= 100 ? 'Overdue' :
                                    progressPercentage >= 75 ? 'Near end' :
                                      'On track'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-800">{new Date(project.last_updated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Investment & Payments Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💰</span> Investment & Payments
            </h2>
            
            {paymentsLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : paymentsError ? (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{paymentsError}</div>
            ) : paymentsData ? (
              <div className="space-y-6">
                {/* Mode Indicator */}
                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md border">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Payment Mode</p>
                    <p className="text-base font-bold text-gray-800">
                      {paymentsData.payment_mode === 'full' ? 'Full Payment' : 'Installment-Based'}
                    </p>
                  </div>
                  <div>
                    {paymentsData.payment_mode === 'full' ? (
                      paymentsData.isPaid ? (
                        <span className="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                          <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          PAID IN FULL
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                          PENDING
                        </span>
                      )
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        {paymentsData.installments_paid} / {paymentsData.installment_count} PAID
                      </span>
                    )}
                  </div>
                </div>

                {/* Content for Full Payment */}
                {paymentsData.payment_mode === 'full' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 p-2.5 rounded border">
                        <span className="block text-xs text-gray-500">Original Value</span>
                        <span className="text-sm font-semibold text-gray-700">LKR {parseFloat(paymentsData.project_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="bg-green-50 p-2.5 rounded border border-green-100">
                        <span className="block text-xs text-green-600 font-medium">10% Discount</span>
                        <span className="text-sm font-semibold text-green-700">- LKR {parseFloat(paymentsData.discount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="bg-green-100/50 p-2.5 rounded border border-green-200">
                        <span className="block text-xs text-green-700 font-semibold">Reduced Price</span>
                        <span className="text-base font-bold text-green-800">LKR {parseFloat(paymentsData.final_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Checkbox for staff to mark paid */}
                    {!paymentsData.isPaid ? (
                      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="markFullPaidCheckbox"
                          checked={false}
                          onChange={handleMarkFullPaymentPaid}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                        />
                        <label htmlFor="markFullPaidCheckbox" className="text-sm font-medium text-yellow-800 cursor-pointer">
                          Mark this project as fully paid (LKR {parseFloat(paymentsData.final_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                        </label>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-md border border-green-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-500 rounded-full p-1 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-green-800 block">PAID</span>
                            <span className="text-xs text-green-600 font-medium">
                              Payment recorded on {paymentsData.payments[0] ? new Date(paymentsData.payments[0].payment_date).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnmarkPayment(paymentsData.payments[0].payment_id, 'Full Payment')}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold"
                        >
                          Unmark Paid
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Content for Installments */}
                {paymentsData.payment_mode === 'installments' && (
                  <div className="space-y-5">
                    {/* Key stats grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-gray-50 p-2 rounded border">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Inst. Value</span>
                        <span className="text-xs font-bold text-gray-700">LKR {parseFloat(paymentsData.installment_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Total Paid</span>
                        <span className="text-xs font-bold text-green-600">LKR {parseFloat(paymentsData.total_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Remaining</span>
                        <span className="text-xs font-bold text-red-500">LKR {parseFloat(paymentsData.total_due).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded border">
                        <span className="block text-[10px] text-gray-500 uppercase font-semibold">Next Due</span>
                        <span className="text-[10px] font-bold text-gray-700">
                          {paymentsData.next_payment_date ? new Date(paymentsData.next_payment_date).toLocaleDateString() : 'Completed'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3.5 rounded-md border space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 font-medium">
                        <span>Paid: <strong className="text-green-600">{paymentsData.installments_paid}</strong></span>
                        <span>Remaining: <strong className="text-red-500">{paymentsData.installments_remaining}</strong></span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(paymentsData.installments_paid / paymentsData.installment_count) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Search and Dropdown for payment submission */}
                    {paymentsData.installments_paid < paymentsData.installment_count && (
                      <div className="bg-green-50/50 p-4 rounded-md border border-green-100 space-y-3">
                        <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Record Installment Payment</p>
                        {(() => {
                          const allInstallmentNumbers = Array.from({ length: paymentsData.installment_count }, (_, i) => i + 1);
                          const filteredInstallmentNumbers = allInstallmentNumbers.filter(num => 
                            String(num).includes(installmentSearchTerm)
                          );
                          return (
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <input
                                type="text"
                                placeholder="Search Installment #..."
                                value={installmentSearchTerm}
                                onChange={(e) => setInstallmentSearchTerm(e.target.value)}
                                className="w-full sm:w-1/3 border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                              />
                              <select
                                value={selectedInstallment}
                                onChange={(e) => setSelectedInstallment(e.target.value)}
                                className="w-full sm:w-2/3 border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                              >
                                <option value="">Select Installment...</option>
                                {filteredInstallmentNumbers.map(num => {
                                  const isPaid = paymentsData.paid_installment_numbers.includes(num);
                                  return (
                                    <option key={num} value={num} disabled={isPaid}>
                                      Installment {num} {isPaid ? '(PAID)' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                              <button
                                type="button"
                                onClick={() => handleMarkInstallmentPaid(selectedInstallment)}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition duration-150 shrink-0"
                              >
                                Mark Paid
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Scrollable installment schedule timeline */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Installments Schedule</p>
                      <div className="border rounded-md divide-y max-h-60 overflow-y-auto bg-white shadow-inner">
                        {Array.from({ length: paymentsData.installment_count }, (_, i) => {
                          const num = i + 1;
                          const isPaid = paymentsData.paid_installment_numbers.includes(num);
                          const paymentRecord = paymentsData.payments.find(p => p.payment_detail === `Installment ${num}`);
                          
                          let instDateStr = 'N/A';
                          if (project.start_date) {
                            const date = new Date(project.start_date);
                            date.setMonth(date.getMonth() + i);
                            instDateStr = date.toLocaleDateString();
                          }

                          return (
                            <div key={num} className={`p-2.5 flex justify-between items-center text-xs ${isPaid ? 'bg-green-50/20' : ''}`}>
                              <div className="flex items-center space-x-2.5">
                                <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                <div>
                                  <span className="font-semibold text-gray-700">Installment #{num}</span>
                                  <span className="text-gray-400 ml-2">Due: {instDateStr}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-600">
                                  LKR {parseFloat(paymentsData.installment_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                {isPaid ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 inline-flex items-center text-[10px] font-bold rounded bg-green-100 text-green-800 border border-green-200">
                                      PAID
                                    </span>
                                    {num === Math.max(...paymentsData.paid_installment_numbers) && (
                                      <button
                                        type="button"
                                        onClick={() => handleUnmarkPayment(paymentRecord.payment_id, `Installment ${num}`)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Unmark paid"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="px-2 py-0.5 inline-flex items-center text-[10px] font-bold rounded bg-gray-100 text-gray-500 border border-gray-200">
                                    PENDING
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">No payment information available</div>
            )}
          </div>
        </div>

        {/* Right Column: Project Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Project Updates</h2>
              <div className="flex space-x-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 border-l-4 border-blue-500 mr-1"></div>
                  <span>Today</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 border-l-4 border-yellow-500 mr-1"></div>
                  <span>This week</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 border-l-4 border-orange-500 mr-1"></div>
                  <span>This month</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 border-l-4 border-gray-500 mr-1"></div>
                  <span>Older</span>
                </div>
              </div>
            </div>
            {project.project_progresses && project.project_progresses.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Sort progress entries by date (newest first) */}
                {project.project_progresses
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((progress, index) => {
                    const isCompleted = project.status === 'Completed';
                    const timelineColorClass = getTimelineColor(progress.date, isCompleted);

                    return (
                      <div key={index} className={`border-l-4 pl-4 pb-4 ${timelineColorClass}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {new Date(progress.date).toLocaleDateString()}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {(() => {
                                const days = Math.floor((new Date() - new Date(progress.date)) / (1000 * 60 * 60 * 24));
                                if (days === 0) return 'Today';
                                if (days === 1) return 'Yesterday';
                                if (days <= 7) return `${days} days ago`;
                                if (days <= 30) return `${Math.floor(days / 7)} weeks ago`;
                                return `${Math.floor(days / 30)} months ago`;
                              })()}
                            </span>
                          </div>

                          {getUserRole() === 'Admin' && (
                            <div className="flex space-x-2 text-xs">
                              <button
                                onClick={() => handleEditProgressClick(progress)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleDeleteProgressClick(progress.progress_id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Work Completed:</h4>
                          <p className="text-sm text-gray-600">{progress.work_completed}</p>
                        </div>

                        {progress.next_steps && (
                          <div className="mb-2">
                            <h5 className="text-xs font-medium text-gray-600">Next Steps:</h5>
                            <p className="text-xs text-gray-500">{progress.next_steps}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {progress.weather_conditions && (
                            <div>
                              <span className="font-medium text-gray-600">Weather:</span>
                              <span className="text-gray-500 ml-1">{progress.weather_conditions}</span>
                            </div>
                          )}
                          {progress.soil_conditions && (
                            <div>
                              <span className="font-medium text-gray-600">Soil:</span>
                              <span className="text-gray-500 ml-1">{progress.soil_conditions}</span>
                            </div>
                          )}
                          {progress.irrigation_status && (
                            <div>
                              <span className="font-medium text-gray-600">Irrigation:</span>
                              <span className="text-gray-500 ml-1">{progress.irrigation_status}</span>
                            </div>
                          )}
                          {progress.pest_disease_status && (
                            <div>
                              <span className="font-medium text-gray-600">Pest/Disease:</span>
                              <span className="text-gray-500 ml-1">{progress.pest_disease_status}</span>
                            </div>
                          )}
                        </div>

                        {progress.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <h5 className="text-xs font-medium text-gray-600">Notes:</h5>
                            <p className="text-xs text-gray-500 italic">{progress.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl text-gray-300 mb-3">📅</div>
                <p className="text-gray-500">No progress entries yet.</p>
                <p className="text-sm text-gray-400 mt-1">Add your first progress update to start the timeline.</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Update Project Status</h2>
              <form onSubmit={handleStatusUpdate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Yet To Start">Yet To Start</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {statusForm.status === 'Ongoing' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={statusForm.start_date}
                      onChange={(e) => setStatusForm({ ...statusForm, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {statusForm.start_date && calculateExpectedEndDate(statusForm.start_date, getProposalDurationYears()) && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected End Date</label>
                        <input
                          type="date"
                          value={calculateExpectedEndDate(statusForm.start_date, getProposalDurationYears()).toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Auto-calculated from selected proposal duration ({project.proposal?.project_duration} years).
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {statusForm.status === 'Completed' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={statusForm.end_date}
                      onChange={(e) => setStatusForm({ ...statusForm, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Progress Entry Modal */}
        {showProgressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add Progress Entry</h2>
              <form onSubmit={handleProgressSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={progressForm.date}
                      onChange={(e) => setProgressForm({ ...progressForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Completed</label>
                  <textarea
                    value={progressForm.work_completed}
                    onChange={(e) => setProgressForm({ ...progressForm, work_completed: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                  <textarea
                    value={progressForm.next_steps}
                    onChange={(e) => setProgressForm({ ...progressForm, next_steps: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
                    <input
                      type="text"
                      value={progressForm.weather_conditions}
                      onChange={(e) => setProgressForm({ ...progressForm, weather_conditions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Sunny, 25°C"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Conditions</label>
                    <input
                      type="text"
                      value={progressForm.soil_conditions}
                      onChange={(e) => setProgressForm({ ...progressForm, soil_conditions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Well-drained, pH 6.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Status</label>
                    <input
                      type="text"
                      value={progressForm.irrigation_status}
                      onChange={(e) => setProgressForm({ ...progressForm, irrigation_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Adequate, Schedule adjusted"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labor Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={progressForm.labor_hours}
                      onChange={(e) => setProgressForm({ ...progressForm, labor_hours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 8.5"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pest/Disease Status</label>
                  <input
                    type="text"
                    value={progressForm.pest_disease_status}
                    onChange={(e) => setProgressForm({ ...progressForm, pest_disease_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., No issues observed"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenges Faced</label>
                  <textarea
                    value={progressForm.challenges_faced}
                    onChange={(e) => setProgressForm({ ...progressForm, challenges_faced: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materials Used</label>
                  <textarea
                    value={progressForm.materials_used}
                    onChange={(e) => setProgressForm({ ...progressForm, materials_used: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={progressForm.notes}
                    onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProgressModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Progress
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Progress Entry Modal */}
        {showEditProgressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Edit Progress Entry</h2>
              <form onSubmit={handleEditProgressSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={editProgressForm.date}
                      onChange={(e) => setEditProgressForm({ ...editProgressForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Completed</label>
                  <textarea
                    value={editProgressForm.work_completed}
                    onChange={(e) => setEditProgressForm({ ...editProgressForm, work_completed: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                  <textarea
                    value={editProgressForm.next_steps}
                    onChange={(e) => setEditProgressForm({ ...editProgressForm, next_steps: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
                    <input
                      type="text"
                      value={editProgressForm.weather_conditions}
                      onChange={(e) => setEditProgressForm({ ...editProgressForm, weather_conditions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Sunny, 25°C"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Conditions</label>
                    <input
                      type="text"
                      value={editProgressForm.soil_conditions}
                      onChange={(e) => setEditProgressForm({ ...editProgressForm, soil_conditions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Well-drained, pH 6.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Status</label>
                    <input
                      type="text"
                      value={editProgressForm.irrigation_status}
                      onChange={(e) => setEditProgressForm({ ...editProgressForm, irrigation_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Adequate, Schedule adjusted"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labor Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editProgressForm.labor_hours}
                      onChange={(e) => setEditProgressForm({ ...editProgressForm, labor_hours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 8.5"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pest/Disease Status</label>
                  <input
                    type="text"
                    value={editProgressForm.pest_disease_status}
                    onChange={(e) => setEditProgressForm({ ...editProgressForm, pest_disease_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., No issues observed"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenges Faced</label>
                  <textarea
                    value={editProgressForm.challenges_faced}
                    onChange={(e) => setEditProgressForm({ ...editProgressForm, challenges_faced: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materials Used</label>
                  <textarea
                    value={editProgressForm.materials_used}
                    onChange={(e) => setEditProgressForm({ ...editProgressForm, materials_used: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={editProgressForm.notes}
                    onChange={(e) => setEditProgressForm({ ...editProgressForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProgressModal(false);
                      setEditProgressId(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Staff_Footer />
    </div>
  );
};

export default ProjectDetails;
