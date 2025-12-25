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
    totalSeats: 50,
    availableSeats: 50,
    status: "Available",
    hours: {
      weekday: { open: "07:00", close: "23:00" },
      saturday: { open: "09:00", close: "21:00" },
      sunday: { open: "10:00", close: "20:00" }
    },
    amenities: {
      wifi: true,
      powerOutlets: true,
      quietZone: false,
      foodAvailable: true
    },
    noiseLevel: "Moderate"
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

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value
        }
      }
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
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
      totalSeats: 50,
      availableSeats: 50,
      status: "Available",
      hours: {
        weekday: { open: "07:00", close: "23:00" },
        saturday: { open: "09:00", close: "21:00" },
        sunday: { open: "10:00", close: "20:00" }
      },
      amenities: {
        wifi: true,
        powerOutlets: true,
        quietZone: false,
        foodAvailable: true
      },
      noiseLevel: "Moderate"
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
      status: cafe.status,
      hours: cafe.hours || {
        weekday: { open: "07:00", close: "23:00" },
        saturday: { open: "09:00", close: "21:00" },
        sunday: { open: "10:00", close: "20:00" }
      },
      amenities: cafe.amenities || {
        wifi: true,
        powerOutlets: true,
        quietZone: false,
        foodAvailable: true
      },
      noiseLevel: cafe.noiseLevel || "Moderate"
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
            <button onClick={() => navigate("/")} className="back-btn">
           ← Back to Dashboard
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
          <div className="modal-content enhanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCafe ? "✏️ Edit Café" : "➕ Add New Café"}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cafe-form enhanced-form">
              {/* Row 1: Name and Emoji */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Café Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g., Central Library Café"
                    required
                  />
                </div>

                <div className="form-group emoji-group">
                  <label htmlFor="emoji">Café Emoji ☕</label>
                  <input
                    type="text"
                    id="emoji"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    placeholder="☕"
                    maxLength="2"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="E.g., Library Building, 2nd Floor, Room 201"
                />
              </div>

              {/* Row 2: Capacity and Available Seats */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalSeats">Total Capacity *</label>
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
                  <label htmlFor="availableSeats">Initial Available Seats *</label>
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

              {/* Upload Photo */}
              <div className="form-group">
                <label htmlFor="photo">Upload Photo</label>
                <div className="photo-upload-area">
                  <div className="upload-icon">📷</div>
                  <p>Click to upload or drag and drop</p>
                  <p className="upload-hint">PNG, JPG up to 5MB</p>
                  <input
                    type="url"
                    id="photo"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    style={{ marginTop: "0.5rem" }}
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div className="form-group">
                <label>Operating Hours *</label>
                <div className="hours-grid">
                  <div className="hours-row">
                    <span className="day-label">Monday - Friday</span>
                    <input
                      type="time"
                      value={formData.hours.weekday.open}
                      onChange={(e) => handleHoursChange('weekday', 'open', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={formData.hours.weekday.close}
                      onChange={(e) => handleHoursChange('weekday', 'close', e.target.value)}
                    />
                  </div>

                  <div className="hours-row">
                    <span className="day-label">Saturday</span>
                    <input
                      type="time"
                      value={formData.hours.saturday.open}
                      onChange={(e) => handleHoursChange('saturday', 'open', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={formData.hours.saturday.close}
                      onChange={(e) => handleHoursChange('saturday', 'close', e.target.value)}
                    />
                  </div>

                  <div className="hours-row">
                    <span className="day-label">Sunday</span>
                    <input
                      type="time"
                      value={formData.hours.sunday.open}
                      onChange={(e) => handleHoursChange('sunday', 'open', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={formData.hours.sunday.close}
                      onChange={(e) => handleHoursChange('sunday', 'close', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-checkboxes">
                  <label className={formData.amenities.wifi ? "checked" : ""}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.wifi}
                      onChange={() => handleAmenityChange('wifi')}
                    />
                    <span>📶 Fast WiFi</span>
                  </label>

                  <label className={formData.amenities.powerOutlets ? "checked" : ""}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.powerOutlets}
                      onChange={() => handleAmenityChange('powerOutlets')}
                    />
                    <span>🔌 Power Outlets</span>
                  </label>

                  <label className={formData.amenities.quietZone ? "checked" : ""}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.quietZone}
                      onChange={() => handleAmenityChange('quietZone')}
                    />
                    <span>🤫 Quiet Zone</span>
                  </label>

                  <label className={formData.amenities.foodAvailable ? "checked" : ""}>
                    <input
                      type="checkbox"
                      checked={formData.amenities.foodAvailable}
                      onChange={() => handleAmenityChange('foodAvailable')}
                    />
                    <span>🍽️ Food Available</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(true)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  💾 {editingCafe ? "Update Café" : "Save Café"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}