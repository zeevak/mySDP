import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [userRole, setUserRole] = useState('');

  // Form state
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: ''
  });

  // Modal state for edit and delete
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Validation functions
  const validateItemName = (name) => {
    if (!name.trim()) return 'Item name is required';
    if (!/^[A-Za-z0-9\s]+$/.test(name)) return 'Item name should only contain letters, numbers, and spaces';
    return '';
  };

  const validateQuantity = (quantity) => {
    if (!quantity) return 'Quantity is required';
    if (isNaN(quantity) || parseInt(quantity) < 0) return 'Quantity must be a non-negative number';
    return '';
  };

  useEffect(() => {
    fetchInventory();

    // Get user role from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if response has data property
      if (response.data && response.data.data) {
        setInventory(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Handle case where response is directly an array
        setInventory(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received unexpected data format from server');
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load inventory data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field as user types
    let errorMessage = '';
    switch (name) {
      case 'item_name':
        errorMessage = validateItemName(value);
        break;
      case 'quantity':
        errorMessage = validateQuantity(value);
        break;
      default:
        break;
    }

    // Update form errors
    setFormErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleEditItem = (item) => {
    setFormMode('edit');
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name,
      quantity: item.quantity
    });
    setShowModal(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/inventory/${selectedItem.inventory_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state after successful deletion
      setInventory(inventory.filter(item => item.inventory_id !== selectedItem.inventory_id));
      setShowDeleteConfirm(false);
      setSelectedItem(null);
      setSuccessMessage('Inventory item deleted successfully');

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError('Failed to delete inventory item');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccessMessage(null);

    // Validate all fields
    const errors = {
      item_name: validateItemName(formData.item_name),
      quantity: validateQuantity(formData.quantity)
    };

    // Update form errors
    setFormErrors(errors);

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    // Check for duplicate item name
    if (formMode === 'add' || (formMode === 'edit' && formData.item_name !== selectedItem?.item_name)) {
      try {
        // Check for existing values in other inventory items
        const existingItem = inventory.find(item =>
          item.inventory_id !== (selectedItem?.inventory_id || 0) &&
          item.item_name.toLowerCase() === formData.item_name.toLowerCase()
        );

        if (existingItem) {
          setFormErrors(prev => ({ ...prev, item_name: 'Item name already exists' }));
          setError('Item name already exists. Please choose a different name.');
          return;
        }
      } catch (err) {
        console.error('Error checking for duplicates:', err);
      }
    }

    try {
      const token = localStorage.getItem('token');

      // Create a properly formatted request payload
      const inventoryData = {
        item_name: formData.item_name.trim(),
        quantity: parseInt(formData.quantity)
      };

      console.log('Sending inventory data:', inventoryData);

      if (formMode === 'edit' && selectedItem) {
        // Update existing inventory item
        const response = await axios({
          method: 'put',
          url: `http://localhost:5001/api/inventory/${selectedItem.inventory_id}`,
          data: inventoryData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Update the inventory item in the local state
        setInventory(inventory.map(item => item.inventory_id === selectedItem.inventory_id ? response.data.data : item));

        // Show success message
        setSuccessMessage(`Successfully updated ${formData.item_name} in inventory.`);

        // Close modal if open
        setShowModal(false);
        setSelectedItem(null);
      } else {
        // Add new inventory item
        console.log('Adding new inventory item...');

        try {
          const response = await fetch('http://localhost:5001/api/inventory', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(inventoryData)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Response data:', data);

          if (data && data.data) {
            // Add the new inventory item to the local state
            setInventory([...inventory, data.data]);

            // Show success message
            setSuccessMessage(`Successfully added ${formData.item_name} to inventory.`);

            // Reset form for new items
            setFormData({
              item_name: '',
              quantity: ''
            });

            // Clear form errors
            setFormErrors({});
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          setError(`Failed to add inventory item: ${fetchError.message}`);
        }
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        console.error('Response error status:', err.response.status);
      }
      setError(`Failed to ${formMode === 'edit' ? 'update' : 'add'} inventory item: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Inventory Management
              {userRole === 'Admin' && (
                <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Admin Only
                </span>
              )}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
              {successMessage}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    {userRole === 'Admin' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add new item row for Admin */}
                  {userRole === 'Admin' && (
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="item_name"
                          value={formData.item_name}
                          onChange={handleInputChange}
                          placeholder="Enter new item name"
                          className={`w-full border ${formErrors.item_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formErrors.item_name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.item_name}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="Enter quantity"
                          min="0"
                          className={`w-full border ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formErrors.quantity && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={handleSubmit}
                          disabled={!formData.item_name || !formData.quantity}
                          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* Inventory items */}
                  {inventory.map((item) => (
                    <tr key={item.inventory_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      {userRole === 'Admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Item
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.item_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.item_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.item_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    min="0"
                    required
                  />
                  {formErrors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{selectedItem?.item_name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
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

export default InventoryManager;
