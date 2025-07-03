import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthAxios } from '../../utils/authUtils';
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
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Error fetching project details');
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

  // Calculate time-based progress percentage
  const calculateTimeBasedProgress = (startDate, endDate, projectDuration) => {
    if (!startDate) return 0;
    
    const start = new Date(startDate);
    const now = new Date();
    
    // If project is completed, return 100%
    if (endDate) return 100;
    
    // Calculate expected end date based on project duration
    let expectedEnd;
    if (projectDuration) {
      expectedEnd = new Date(start);
      expectedEnd.setFullYear(start.getFullYear() + projectDuration);
    } else {
      // Default to 1 year if no duration specified
      expectedEnd = new Date(start);
      expectedEnd.setFullYear(start.getFullYear() + 1);
    }
    
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
                <p className="text-sm text-gray-600">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                  {(() => {
                    // Calculate time-based progress
                    const timeBasedProgress = calculateTimeBasedProgress(
                      project.start_date, 
                      project.end_date, 
                      project.proposal?.project_duration
                    );
                    
                    return (
                      <div
                        className={`h-3 rounded-full ${getProgressColor(timeBasedProgress)}`}
                        style={{ width: `${timeBasedProgress}%` }}
                      ></div>
                    );
                  })()}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {(() => {
                    const timeBasedProgress = calculateTimeBasedProgress(
                      project.start_date, 
                      project.end_date, 
                      project.proposal?.project_duration
                    );
                    return `${timeBasedProgress}% Complete (Time-based)`;
                  })()}
                </p>
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
                <p className="font-medium text-gray-800">{project.proposal?.customer_land?.land_size || 'N/A'} acres</p>
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

              {/* Project Timeline Visualization */}
              {project.start_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Project Timeline</p>
                  <div className="relative">
                    {(() => {
                      const startDate = new Date(project.start_date);
                      const endDate = project.end_date ? new Date(project.end_date) : (() => {
                        const calculatedEnd = new Date(startDate);
                        calculatedEnd.setFullYear(startDate.getFullYear() + (project.proposal?.project_duration || 1));
                        return calculatedEnd;
                      })();
                      const currentDate = new Date();
                      
                      const totalDuration = endDate.getTime() - startDate.getTime();
                      const elapsedTime = Math.min(currentDate.getTime() - startDate.getTime(), totalDuration);
                      const progressPercentage = totalDuration > 0 ? Math.max(0, (elapsedTime / totalDuration) * 100) : 0;
                      
                      const startDateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const endDateStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      const currentDateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <div className="space-y-2">
                          {/* Timeline bar */}
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            ></div>
                            {/* Current date marker */}
                            {progressPercentage <= 100 && (
                              <div 
                                className="absolute top-0 h-full w-0.5 bg-red-500"
                                style={{ left: `${Math.min(progressPercentage, 100)}%` }}
                              ></div>
                            )}
                          </div>
                          
                          {/* Timeline labels */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <div className="text-left">
                              <div className="font-medium text-blue-600">Start</div>
                              <div>{startDateStr}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-red-600">Today</div>
                              <div>{currentDateStr}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
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
                                <span className={`ml-1 font-medium ${
                                  progressPercentage >= 100 ? 'text-green-600' : 
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

          {/* Project Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Project Timeline</h2>
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
                                if (days <= 30) return `${Math.floor(days/7)} weeks ago`;
                                return `${Math.floor(days/30)} months ago`;
                              })()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-700">
                              {(() => {
                                const timeBasedProgress = calculateTimeBasedProgress(
                                  project.start_date, 
                                  project.end_date, 
                                  project.proposal?.project_duration
                                );
                                return `${timeBasedProgress}%`;
                              })()}
                            </span>
                            <span className="text-xs text-gray-400 block">Progress</span>
                          </div>
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
                    onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}
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
                      onChange={(e) => setStatusForm({...statusForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                {statusForm.status === 'Completed' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={statusForm.end_date}
                      onChange={(e) => setStatusForm({...statusForm, end_date: e.target.value})}
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
                      onChange={(e) => setProgressForm({...progressForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Completed</label>
                  <textarea
                    value={progressForm.work_completed}
                    onChange={(e) => setProgressForm({...progressForm, work_completed: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                  <textarea
                    value={progressForm.next_steps}
                    onChange={(e) => setProgressForm({...progressForm, next_steps: e.target.value})}
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
                      onChange={(e) => setProgressForm({...progressForm, weather_conditions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Sunny, 25°C"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Conditions</label>
                    <input
                      type="text"
                      value={progressForm.soil_conditions}
                      onChange={(e) => setProgressForm({...progressForm, soil_conditions: e.target.value})}
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
                      onChange={(e) => setProgressForm({...progressForm, irrigation_status: e.target.value})}
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
                      onChange={(e) => setProgressForm({...progressForm, labor_hours: e.target.value})}
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
                    onChange={(e) => setProgressForm({...progressForm, pest_disease_status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., No issues observed"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenges Faced</label>
                  <textarea
                    value={progressForm.challenges_faced}
                    onChange={(e) => setProgressForm({...progressForm, challenges_faced: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materials Used</label>
                  <textarea
                    value={progressForm.materials_used}
                    onChange={(e) => setProgressForm({...progressForm, materials_used: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    value={progressForm.notes}
                    onChange={(e) => setProgressForm({...progressForm, notes: e.target.value})}
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
      </div>
      <Staff_Footer />
    </div>
  );
};

export default ProjectDetails;
