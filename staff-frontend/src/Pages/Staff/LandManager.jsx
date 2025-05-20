import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const LandManager = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [landToDelete, setLandToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLands, setFilteredLands] = useState([]);

  // Fetch all lands
  useEffect(() => {
    fetchLands();
  }, []);

  // Filter lands based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLands(lands);
    } else {
      const filtered = lands.filter(land => {
        const landId = land.customer_land_id ? land.customer_land_id.toLowerCase() : '';
        const customerId = land.customer_id ? land.customer_id.toLowerCase() : '';
        const location = `${land.city || ''} ${land.district || ''} ${land.province || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return landId.includes(searchLower) || 
               customerId.includes(searchLower) || 
               location.includes(searchLower);
      });
      
      setFilteredLands(filtered);
    }
  }, [searchTerm, lands]);

  // Fetch all lands
  const fetchLands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5001/api/staff/lands', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        setLands(response.data.data);
        setFilteredLands(response.data.data);
      } else {
        setError('Failed to fetch lands');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching lands:', err);
      setError('Failed to load lands. Please try again later.');
      setLoading(false);
    }
  };

  // Handle land selection for details view
  const handleViewDetails = (land) => {
    setSelectedLand(land);
  };

  // Handle edit land
  const handleEdit = (landId) => {
    navigate(`/staff/edit-land/${landId}`);
  };

  // Handle delete land
  const handleDelete = (land) => {
    setLandToDelete(land);
    setShowDeleteModal(true);
  };

  // Confirm delete land
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`http://localhost:5001/api/staff/lands/${landToDelete.customer_land_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        // Remove the deleted land from the state
        setLands(lands.filter(land => land.customer_land_id !== landToDelete.customer_land_id));
        
        // Close the modal and reset the selected land
        setShowDeleteModal(false);
        setLandToDelete(null);
        
        // If the deleted land was selected, clear the selection
        if (selectedLand && selectedLand.customer_land_id === landToDelete.customer_land_id) {
          setSelectedLand(null);
        }
      } else {
        setError('Failed to delete land');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting land:', err);
      setError('Failed to delete land. Please try again later.');
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />
      
      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Land Management</h1>
            <button
              onClick={() => navigate('/staff/add-land')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Add New Land
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">All Lands</h2>
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search lands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredLands.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No lands match your search criteria.' : 'No lands found in the system.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size (perch)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLands.map((land) => (
                      <tr key={land.customer_land_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{land.customer_land_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{land.customer_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {[land.city, land.district, land.province].filter(Boolean).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{land.land_size}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(land)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(land.customer_land_id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(land)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Land Details Panel */}
          {selectedLand && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Land Details</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(selectedLand.customer_land_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedLand(null)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Land ID:</span>
                        <p className="text-gray-800">{selectedLand.customer_land_id}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Customer ID:</span>
                        <p className="text-gray-800">{selectedLand.customer_id}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Land Size:</span>
                        <p className="text-gray-800">{selectedLand.land_size} perch</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Location</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Province:</span>
                        <p className="text-gray-800">{selectedLand.province || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">District:</span>
                        <p className="text-gray-800">{selectedLand.district || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">City:</span>
                        <p className="text-gray-800">{selectedLand.city || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Land Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Climate Zone:</span>
                      <p className="text-gray-800">{selectedLand.climate_zone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Land Shape:</span>
                      <p className="text-gray-800">{selectedLand.land_shape || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Soil Type:</span>
                      <p className="text-gray-800">{selectedLand.soil_type || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Land Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${selectedLand.has_water ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                      <span className="text-gray-800">{selectedLand.has_water ? 'Has Water Source' : 'No Water Source'}</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${selectedLand.has_stones ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
                      <span className="text-gray-800">{selectedLand.has_stones ? 'Has Stones' : 'No Stones'}</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${selectedLand.has_landslide_risk ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
                      <span className="text-gray-800">{selectedLand.has_landslide_risk ? 'Has Landslide Risk' : 'No Landslide Risk'}</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${selectedLand.has_forestry ? 'bg-green-500' : 'bg-gray-500'} mr-2`}></div>
                      <span className="text-gray-800">{selectedLand.has_forestry ? 'Has Forestry' : 'No Forestry'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete land <span className="font-semibold">{landToDelete.customer_land_id}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <StaffFooter />
    </div>
  );
};

export default LandManager;
