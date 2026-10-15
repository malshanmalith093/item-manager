import { useEffect, useState } from "react";

// Local: http://localhost:5000 | Deployed: set VITE_API_URL to your Render URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyForm = { name: "", price: "", category: "" };

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/items`);
      setItems(await res.json());
      setError("");
    } catch {
      setError("Cannot reach the backend. Is it running?");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/items/${editingId}` : `${API_URL}/api/items`;
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      return setError(data.message || "Something went wrong");
    }
    setForm(emptyForm);
    setEditingId(null);
    loadItems();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({ name: item.name, price: item.price, category: item.category || "" });
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/api/items/${id}`, { method: "DELETE" });
    loadItems();
  };

  return (
    <div className="container">
      <h1>Item Manager</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />  
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {items.map((item) => (
        <div className="item" key={item._id}>
          <div>
            <p><strong>{item.name}</strong></p>
            <p>Rs. {item.price}</p>
            <p>Category: {item.category}</p>
          </div>
          <div className="actions">
            <button className="secondary" onClick={() => startEdit(item)}>Edit</button>
            <button className="danger" onClick={() => deleteItem(item._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
