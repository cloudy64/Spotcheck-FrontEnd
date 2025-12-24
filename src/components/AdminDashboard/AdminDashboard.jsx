import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCafes, createCafe, updateCafe, deleteCafe } from "../../services/cafeService";
import { UserContext } from "../../contexts/UserContext";

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCafe, setEditingCafe] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    emoji: "☕",
    photo: "",
    totalSeats: 0,
    availableSeats: 0,
    status: "Available"
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/cafes");
      return;
    }
    fetchCafes();
  }, [user, navigate]);

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const data = await getCafes();
      setCafes(data || []);
    } catch (err) {
      console.error("Error fetching cafes:", err);
      setCafes([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "totalSeats" || name === "availableSeats" 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const openCreateModal = () => {
    setEditingCafe(null);
    setFormData({
      name: "",
      location: "",
      description: "",
      emoji: "☕",
      photo: "",
      totalSeats: 0,
      availableSeats: 0,
      status: "Available"
    });
    setShowModal(true);
  };

  const openEditModal = (cafe) => {
    setEditingCafe(cafe);
    setFormData({
      name: cafe.name,
      location: cafe.location,
      description: cafe.description || "",
      emoji: cafe.emoji || "☕",
      photo: cafe.photo || "",
      totalSeats: cafe.totalSeats,
      availableSeats: cafe.availableSeats,
      status: cafe.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCafe) {
        await updateCafe(editingCafe._id, formData);
      } else {
        await createCafe(formData);
      }
      
      setShowModal(false);
      fetchCafes();
    } catch (err) {
      console.error("Error saving cafe:", err);
      alert("Failed to save café. Please try again.");
    }
  };

  const handleDelete = async (cafeId, cafeName) => {
    if (!window.confirm(`Are you sure you want to delete "${cafeName}"?`)) {
      return;
    }

    try {
      await deleteCafe(cafeId);
      fetchCafes();
    } catch (err) {
      console.error("Error deleting cafe:", err);
      alert("Failed to delete café. Please try again.");
    }
  };

  const getStatusEmoji = (status) => {
    if (status === "Available") return "🟢";
    if (status === "Filling") return "🟠";
    return "🔴";
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage campus cafés and seating availability</p>
        </div>
        <div className="header-actions">
          <button onClick={openCreateModal} className="create-btn">
            ➕ Add New Café
          </button>
          <button onClick={() => navigate("/cafes")} className="back-btn">
            ← Back to Cafés
          </button>
        </div>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{cafes.length}</h3>
          <p>Total Cafés</p>
        </div>
        <div className="stat-card">
          <h3>{cafes.filter(c => c.status === "Available").length}</h3>
          <p>Available</p>
        </div>
        <div className="stat-card">
          <h3>{cafes.reduce((sum, c) => sum + c.totalSeats, 0)}</h3>
          <p>Total Seats</p>
        </div>
        <div className="stat-card">
          <h3>{cafes.reduce((sum, c) => sum + c.availableSeats, 0)}</h3>
          <p>Available Seats</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Café</th>
              <th>Location</th>
              <th>Status</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cafes.map(cafe => (
              <tr key={cafe._id}>
                <td>
                  <div className="cafe-cell">
                    <span className="cafe-emoji">{cafe.emoji || "☕"}</span>
                    <strong>{cafe.name}</strong>
                  </div>
                </td>
                <td>{cafe.location}</td>
                <td>
                  <span className={`status-badge status-${cafe.status.toLowerCase()}`}>
                    {getStatusEmoji(cafe.status)} {cafe.status}
                  </span>
                </td>
                <td>
                  <span className="seats-display">
                    {cafe.availableSeats} / {cafe.totalSeats}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => openEditModal(cafe)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(cafe._id, cafe.name)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCafe ? "Edit Café" : "Create New Café"}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cafe-form">
              <div className="form-group">
                <label htmlFor="name">Café Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Building A, 2nd Floor"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the café..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emoji">Emoji</label>
                  <input
                    type="text"
                    id="emoji"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    placeholder="☕"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Filling">Filling</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="photo">Photo URL</label>
                <input
                  type="url"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalSeats">Total Seats *</label>
                  <input
                    type="number"
                    id="totalSeats"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availableSeats">Available Seats *</label>
                  <input
                    type="number"
                    id="availableSeats"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    min="0"
                    max={formData.totalSeats}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCafe ? "Update Café" : "Create Café"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}