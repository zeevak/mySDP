import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_name: "",
    item_type: "",
    quantity: "",
    price: "",
    staff_id: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch inventory items
  useEffect(() => {
    axios.get("/api/inventory").then(res => setItems(res.data));
  }, []);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add or update inventory item
  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      axios.put(`/api/inventory/${editingId}`, form).then(() => window.location.reload());
    } else {
      axios.post("/api/inventory", form).then(() => window.location.reload());
    }
  };

  // Delete inventory item
  const handleDelete = id => {
    axios.delete(`/api/inventory/${id}`).then(() => window.location.reload());
  };

  // Edit inventory item
  const handleEdit = item => {
    setForm(item);
    setEditingId(item.inventory_id);
  };

  return (
    <div>
      <h2>Manage Inventory</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="item_name"
          value={form.item_name || ""}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
        <select
          name="item_type"
          value={form.item_type || ""}
          onChange={handleChange}
          required
        >
          <option value="">Type</option>
          <option value="Plant">Plant</option>
          <option value="Fertilizer">Fertilizer</option>
        </select>
        <input
          name="quantity"
          type="number"
          value={form.quantity || ""}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price || ""}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          name="staff_id"
          type="number"
          value={form.staff_id || ""}
          onChange={handleChange}
          placeholder="Staff ID"
        />
        <button type="submit">{editingId ? "Update" : "Add"} Item</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Qty</th><th>Price</th><th>Staff</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.inventory_id}>
              <td>{i.item_name}</td>
              <td>{i.item_type}</td>
              <td>{i.quantity}</td>
              <td>{i.price}</td>
              <td>{i.staff_id}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Edit</button>
                <button onClick={() => handleDelete(i.inventory_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;
