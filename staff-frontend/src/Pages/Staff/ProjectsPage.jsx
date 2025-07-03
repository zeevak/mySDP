import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthAxios } from '../../utils/authUtils';
import Staff_Header from '../../Components/Staff_Header';
import Staff_Footer from '../../Components/Staff_Footer';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to calculate end date based on start date and duration
  const calculateEndDate = (startDate, durationInYears) => {
    if (!startDate || !durationInYears) return null;
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + durationInYears);
    console.log('Calculating end date:', { startDate, durationInYears, calculatedEnd: end }); // Debug log
    return end;
  };

  // Calculate time-based progress percentage
  const calculateTimeBasedProgress = (startDate, endDate, projectDuration, status) => {
    if (status === 'Yet To Start') return 0;
    if (status === 'Completed') return 100;
    if (!startDate) return 0;
    
    const start = new Date(startDate);
    const now = new Date();
    
    // Calculate expected end date
    let expectedEnd;
    if (endDate) {
      expectedEnd = new Date(endDate);
    } else if (projectDuration) {
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/project/approved');
      
      if (response.data.success) {
        console.log('Projects data:', response.data.data); // Debug log
        setProjects(response.data.data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/staff/projects/${projectId}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Staff_Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Projects</h1>
          <p className="text-gray-600">Manage and track your approved agricultural projects</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Found</h3>
            <p className="text-gray-500">No approved projects are available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleProjectClick(project.project_id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Project #{project.project_id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium text-gray-800">
                        {project.proposal?.customer?.full_name || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Project Type</p>
                      <p className="font-medium text-gray-800">
                        {project.proposal?.project_type || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-800">
                        {project.proposal?.customer_land?.city || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Land Size</p>
                      <p className="font-medium text-gray-800">
                        {project.proposal?.customer_land?.land_size || 'N/A'} acres
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {(() => {
                          // Calculate time-based progress
                          const timeBasedProgress = calculateTimeBasedProgress(
                            project.start_date,
                            project.end_date,
                            project.proposal?.project_duration,
                            project.status
                          );
                          
                          return (
                            <div
                              className={`h-2 rounded-full ${getProgressColor(timeBasedProgress)}`}
                              style={{ width: `${timeBasedProgress}%` }}
                            ></div>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {(() => {
                          const timeBasedProgress = calculateTimeBasedProgress(
                            project.start_date,
                            project.end_date,
                            project.proposal?.project_duration,
                            project.status
                          );
                          return `${timeBasedProgress}% Complete`;
                        })()}
                        <span className="text-xs text-gray-400 ml-1">(time-based)</span>
                      </p>
                    </div>

                    {project.start_date && (
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(project.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* End Date - show if exists or can be calculated */}
                    {(project.end_date || (project.start_date && project.proposal?.project_duration)) && (
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium text-gray-800">
                          {(() => {
                            // If actual end date exists, use it
                            if (project.end_date) {
                              return new Date(project.end_date).toLocaleDateString();
                            }
                            // If we have start date and duration, calculate it
                            if (project.start_date && project.proposal?.project_duration) {
                              const calculatedEndDate = calculateEndDate(project.start_date, project.proposal.project_duration);
                              return calculatedEndDate ? calculatedEndDate.toLocaleDateString() + ' (calculated)' : 'N/A';
                            }
                            return 'N/A';
                          })()}
                        </p>
                      </div>
                    )}

                    {/* Show duration if available */}
                    {project.proposal?.project_duration && (
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-gray-800">
                          {project.proposal.project_duration} {project.proposal.project_duration === 1 ? 'year' : 'years'}
                        </p>
                      </div>
                    )}

                    {project.last_updated && (
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-medium text-gray-800">
                          {new Date(project.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Staff_Footer />
    </div>
  );
};

export default ProjectsPage;
