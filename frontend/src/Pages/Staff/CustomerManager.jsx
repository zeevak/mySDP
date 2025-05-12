import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ /* fields */ });
  const [editingId, setEditingId] = useState(null);

  // Fetch customers
  useEffect(() => {
    axios.get("/api/customers").then(res => setCustomers(res.data));
  }, []);

  // Handle form input
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add or update customer
  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      axios.put(`/api/customers/${editingId}`, form).then(() => window.location.reload());
    } else {
      axios.post("/api/customers", form).then(() => window.location.reload());
    }
  };

  // Delete customer
  const handleDelete = id => {
    axios.delete(`/api/customers/${id}`).then(() => window.location.reload());
  };

  // Edit customer
  const handleEdit = customer => {
    setForm(customer);
    setEditingId(customer.customer_id);
  };

  return (
    <div>
      <h2>Manage Customers</h2>
      <form onSubmit={handleSubmit}>
        {/* Add your customer form fields here */}
        <input name="full_name" value={form.full_name || ""} onChange={handleChange} placeholder="Full Name" required />
        <input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" required />
        {/* ...other fields... */}
        <button type="submit">{editingId ? "Update" : "Add"} Customer</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.customer_id}>
              <td>{c.full_name}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.customer_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManager;
