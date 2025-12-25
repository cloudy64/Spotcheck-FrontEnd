import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCafes, getCafesByStatus } from "../../services/cafeService";
import { UserContext } from "../../contexts/UserContext";

export default function CafeList() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

useEffect(() => {
  fetchCafes();
}, []);



  const handleCafeClick = (cafeId) => {
    navigate(`/cafes/${cafeId}`);
  };

  const getStatusEmoji = (status) => {
    if (status === "Available") return "🟢";
    if (status === "Filling") return "🟠";
    return "🔴";
  };

  const getStatusClass = (status) => {
    if (status === "Available") return "status-available";
    if (status === "Filling") return "status-filling";
    return "status-full";
  };

  const filteredCafes = cafes.filter((cafe) =>
    cafe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading cafes...</p>;

  return (
    <div className="cafe-list-container">
      <header className="cafe-list-header">
        <div>
          <h1>Campus Cafés</h1>
          <p>Find your perfect study spot with real-time availability</p>
        </div>
      </header>

      {filteredCafes.length === 0 ? (
        <div className="empty-state">
          <p>No cafés found matching your search.</p>
        </div>
      ) : (
        <div className="cafe-cards-grid">
          {filteredCafes.map((cafe) => (
            <article
              key={cafe._id}
              className="cafe-preview-card"
              onClick={() => handleCafeClick(cafe._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="cafe-image-wrapper">
                <img
                  src={cafe.photo || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"}
                  alt={`${cafe.name} interior`}
                  loading="lazy"
                />
                <span className="cafe-emoji-badge">{cafe.emoji || "☕"}</span>
              </div>

              <div className="cafe-card-content">
                <h3 className="cafe-card-name">{cafe.name}</h3>
                <p className="cafe-card-location">📍 {cafe.location}</p>
                <p className="cafe-card-blurb">
                  {cafe.description || "No description available"}
                </p>

                <div className="cafe-card-footer">
                  <span className={`status-badge ${getStatusClass(cafe.status)}`}>
                    {getStatusEmoji(cafe.status)} {cafe.status}
                  </span>
                  <span className="seats-info">
                    <strong>{cafe.availableSeats}</strong> / {cafe.totalSeats} seats
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}