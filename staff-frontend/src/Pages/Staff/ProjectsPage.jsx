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
          <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => handleProjectClick(project.project_id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{project.project_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {project.proposal?.customer?.full_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.proposal?.customer_land?.city || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.proposal?.customer_land?.land_size || 'N/A'} perch
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.proposal?.project_type || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.proposal?.project_duration ? `${project.proposal.project_duration} years` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(timeBasedProgress)}`}
                                style={{ width: `${timeBasedProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{timeBasedProgress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectClick(project.project_id);
                            }}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition duration-150"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Staff_Footer />
    </div>
  );
};

export default ProjectsPage;
