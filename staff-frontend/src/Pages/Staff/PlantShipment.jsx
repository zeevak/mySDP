import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const PlantShipment = () => {
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    customer_id: "",
    inventory_id: "",
    quantity: 1,
    notes: ""
  });
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch customers
        const customersResponse = await axios.get("http://localhost:5001/api/customer", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (customersResponse.data && customersResponse.data.data) {
          setCustomers(customersResponse.data.data);
        }
        
        // Fetch inventory
        const inventoryResponse = await axios.get("http://localhost:5001/api/inventory", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (inventoryResponse.data && inventoryResponse.data.data) {
          setInventory(inventoryResponse.data.data);
        }
        
        // Fetch shipments
        const shipmentsResponse = await axios.get("http://localhost:5001/api/shipment", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (shipmentsResponse.data && shipmentsResponse.data.data) {
          setShipments(shipmentsResponse.data.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: value
    });
    
    // Update selected plant when inventory_id changes
    if (name === 'inventory_id') {
      const plant = inventory.find(item => item.inventory_id.toString() === value);
      setSelectedPlant(plant || null);
      
      // Reset quantity if plant changes
      if (plant) {
        setForm(prev => ({
          ...prev,
          quantity: 1
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!form.customer_id) {
      setError("Please select a customer");
      return;
    }
    
    if (!form.inventory_id) {
      setError("Please select a plant");
      return;
    }
    
    if (!form.quantity || form.quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    
    if (selectedPlant && form.quantity > selectedPlant.quantity) {
      setError(`Insufficient inventory. Only ${selectedPlant.quantity} ${selectedPlant.item_name} available.`);
      return;
    }
    
    // Show confirmation dialog
    setShowConfirm(true);
  };

  // Create shipment
  const createShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        "http://localhost:5001/api/shipment",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update inventory
      const updatedInventory = inventory.map(item => {
        if (item.inventory_id.toString() === form.inventory_id) {
          return {
            ...item,
            quantity: item.quantity - parseInt(form.quantity)
          };
        }
        return item;
      });
      
      setInventory(updatedInventory);
      
      // Add new shipment to the list
      if (response.data && response.data.data) {
        setShipments([response.data.data, ...shipments]);
      }
      
      // Reset form
      setForm({
        customer_id: "",
        inventory_id: "",
        quantity: 1,
        notes: ""
      });
      
      setSelectedPlant(null);
      setShowConfirm(false);
      setSuccess("Plants shipped successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error creating shipment:", err);
      setError(err.response?.data?.error || "Failed to create shipment");
      setShowConfirm(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get customer name by ID
  const getCustomerName = (id) => {
    const customer = customers.find(c => c.customer_id.toString() === id.toString());
    return customer ? customer.name_with_ini : 'Unknown';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <StaffHeader />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Plant Shipments</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipment Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Send Plants to Customer</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <select
                      name="customer_id"
                      value={form.customer_id}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.customer_id} value={customer.customer_id}>
                          {customer.name_with_ini} ({customer.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plant
                    </label>
                    <select
                      name="inventory_id"
                      value={form.inventory_id}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Plant</option>
                      {inventory
                        .filter(item => item.quantity > 0) // Only show items with available quantity
                        .map(item => (
                          <option key={item.inventory_id} value={item.inventory_id}>
                            {item.item_name} (Available: {item.quantity})
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      max={selectedPlant ? selectedPlant.quantity : 1}
                      value={form.quantity}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    {selectedPlant && (
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {selectedPlant.quantity}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700"
                      disabled={loading || !selectedPlant || selectedPlant.quantity < 1}
                    >
                      Ship Plants
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Recent Shipments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Recent Shipments</h2>
                </div>
                
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading shipments...</p>
                  </div>
                ) : shipments.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No shipments found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {shipments.map(shipment => (
                          <tr key={shipment.shipment_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(shipment.shipment_date)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {shipment.Customer ? shipment.Customer.name_with_ini : getCustomerName(shipment.customer_id)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {shipment.plant_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {shipment.quantity}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <StaffFooter />
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Shipment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to ship {form.quantity} {selectedPlant?.item_name || 'plants'} to {getCustomerName(form.customer_id)}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createShipment}
                className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantShipment;
