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
    quantity: '',
    unit_type: 'Count'
  });

  // Modal state for edit and delete
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Validation functions
  const validateItemName = (name) => {
    if (!name.trim()) return 'Item name is required';
    if (!/^[A-Za-z0-9\s\-_()]+$/.test(name)) return 'Item name contains invalid characters';
    return '';
  };

  const validateQuantity = (quantity) => {
    if (quantity === '' || quantity === undefined || quantity === null) return 'Quantity is required';
    if (isNaN(quantity) || parseFloat(quantity) < 0) return 'Quantity must be a non-negative number';
    return '';
  };

  useEffect(() => {
    fetchInventory();

    // Get user role from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setInventory(response.data.data);
      } else if (Array.isArray(response.data)) {
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
    setFormData(prev => ({ ...prev, [name]: value }));

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
      quantity: item.quantity,
      unit_type: item.unit_type || 'Count'
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

      setInventory(inventory.filter(item => item.inventory_id !== selectedItem.inventory_id));
      setShowDeleteConfirm(false);
      setSelectedItem(null);
      setSuccessMessage('Inventory item deleted successfully');

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

    setError(null);
    setSuccessMessage(null);

    const errors = {
      item_name: validateItemName(formData.item_name),
      quantity: validateQuantity(formData.quantity)
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(errStr => errStr !== '');
    if (hasErrors) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    if (formMode === 'add' || (formMode === 'edit' && formData.item_name !== selectedItem?.item_name)) {
      const existingItem = inventory.find(item =>
        item.inventory_id !== (selectedItem?.inventory_id || 0) &&
        item.item_name.toLowerCase() === formData.item_name.toLowerCase()
      );

      if (existingItem) {
        setFormErrors(prev => ({ ...prev, item_name: 'Item name already exists' }));
        setError('Item name already exists. Please choose a different name.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const inventoryData = {
        item_name: formData.item_name.trim(),
        quantity: parseFloat(formData.quantity),
        unit_type: formData.unit_type || 'Count'
      };

      if (formMode === 'edit' && selectedItem) {
        const response = await axios({
          method: 'put',
          url: `http://localhost:5001/api/inventory/${selectedItem.inventory_id}`,
          data: inventoryData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setInventory(inventory.map(item => item.inventory_id === selectedItem.inventory_id ? response.data.data : item));
        setSuccessMessage(`Successfully updated ${formData.item_name} in inventory.`);
        setShowModal(false);
        setSelectedItem(null);
      } else {
        const response = await axios({
          method: 'post',
          url: 'http://localhost:5001/api/inventory',
          data: inventoryData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.data) {
          setInventory([...inventory, response.data.data]);
          setSuccessMessage(`Successfully added ${formData.item_name} (${formData.quantity} ${formData.unit_type}) to inventory.`);
          setFormData({
            item_name: '',
            quantity: '',
            unit_type: 'Count'
          });
          setFormErrors({});
        }
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(`Failed to ${formMode === 'edit' ? 'update' : 'add'} inventory item: ${err.response?.data?.error || err.message}`);
    }
  };

  const getUnitBadge = (unit) => {
    switch (unit) {
      case 'kg':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">kg (Kilograms)</span>;
      case 'Liters':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">Liters (L)</span>;
      case 'Packs':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Packs</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">Count (Plants / Units)</span>;
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit / Type</th>
                    {userRole === 'Admin' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Add new item row for Admin */}
                  {userRole === 'Admin' && (
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="item_name"
                          value={formData.item_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Agarwood Seedlings / Weedicide"
                          className={`w-full border ${formErrors.item_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formErrors.item_name && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.item_name}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="any"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="e.g. 500 or 12.5"
                          min="0"
                          className={`w-full border ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                        />
                        {formErrors.quantity && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.quantity}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="unit_type"
                          value={formData.unit_type}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          <option value="Count">Count (Plants / Units)</option>
                          <option value="kg">kg (Kilograms - Weedicide / Fertilizer)</option>
                          <option value="Liters">Liters (Liquid)</option>
                          <option value="Packs">Packs / Bags</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={handleSubmit}
                          disabled={!formData.item_name || formData.quantity === ''}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold"
                        >
                          <span>+ Add Item</span>
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* Inventory items */}
                  {inventory.length === 0 ? (
                    <tr>
                      <td colSpan={userRole === 'Admin' ? 4 : 3} className="px-6 py-8 text-center text-gray-500 text-sm">
                        No inventory items found. Add items above.
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item.inventory_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{item.item_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-800">
                            {item.quantity} <span className="text-xs text-gray-500 font-normal">{item.unit_type || 'Count'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getUnitBadge(item.unit_type)}
                        </td>
                        {userRole === 'Admin' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="text-red-600 hover:text-red-900 text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <StaffFooter />

      {/* Edit Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Edit Inventory Item
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.item_name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.item_name && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.item_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="any"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                    min="0"
                    required
                  />
                  {formErrors.quantity && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unit / Quantity Type</label>
                  <select
                    name="unit_type"
                    value={formData.unit_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="Count">Count (Plants / Units)</option>
                    <option value="kg">kg (Kilograms - Weedicide / Fertilizer)</option>
                    <option value="Liters">Liters (Liquid)</option>
                    <option value="Packs">Packs / Bags</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong className="text-gray-900">{selectedItem?.item_name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm text-white hover:bg-red-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
