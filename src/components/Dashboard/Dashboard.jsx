import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCafes } from "../../services/cafeService";
import { UserContext } from "../../contexts/UserContext";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchCafes();

    const savedFavorites = JSON.parse(localStorage.getItem('favoriteCafes') || '[]');
    setFavorites(savedFavorites);
  }, []);

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

  const toggleFavorite = (cafeId) => {
    const newFavorites = favorites.includes(cafeId)
      ? favorites.filter(id => id !== cafeId)
      : [...favorites, cafeId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCafes', JSON.stringify(newFavorites));
  };

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

  // Calculate stats
  const totalCafes = cafes.length;
  const availableCafes = cafes.filter(c => c.status === "Available").length;
  const totalSeats = cafes.reduce((sum, c) => sum + c.totalSeats, 0);
  const availableSeats = cafes.reduce((sum, c) => sum + c.availableSeats, 0);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <main className="landing-spotcheck">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-emoji">☕</span>
            Find a seat before you arrive.
          </h1>
          <p className="hero-subtitle">
            Browse curated cafes, check real-time availability, and reserve your favorite corner.
            {!user && " Sign up to unlock the full dashboard experience."}
          </p>

          {!user && (
            <div className="hero-actions">
              <a href="/signup" className="btn-primary">Get Started</a>
              <a href="/signin" className="btn-secondary">Sign In</a>
            </div>
          )}
        </div>

        {user && (
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-number">{totalCafes}</span>
              <span className="stat-label">Total Cafés</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{availableCafes}</span>
              <span className="stat-label">Available Now</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{availableSeats}</span>
              <span className="stat-label">Open Seats</span>
            </div>
          </div>
        )}
      </section>

      <section className="cafes-preview">
        <div className="preview-header">
  <h2 className="section-title">Featured Cafés</h2>
  <p className="section-subtitle">Discover the perfect study spot on campus</p>
</div>

        <div className="cafe-cards-grid">
          {cafes.map((cafe) => (
            <article
              key={cafe._id}
              className="cafe-preview-card"
            >
              <div 
                className="cafe-image-wrapper"
                onClick={() => handleCafeClick(cafe._id)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <img
                  src={cafe.photo || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"}
                  alt={`${cafe.name} interior`}
                  loading="lazy"
                />
                <span className="cafe-emoji-badge">{cafe.emoji || "☕"}</span>
                
                {user && (
                  <button
                    className="favorite-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(cafe._id);
                    }}
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      transition: "transform 200ms ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    aria-label={favorites.includes(cafe._id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(cafe._id) ? "❤️" : "🤍"}
                  </button>
                )}
              </div>

              <div className="cafe-card-content">
                <h3 
                  className="cafe-card-name"
                  onClick={() => handleCafeClick(cafe._id)}
                  style={{ cursor: "pointer" }}
                >
                  {cafe.name}
                </h3>
                
                <p className="cafe-card-location">📍 {cafe.location}</p>
                <p className="cafe-card-blurb">
                  {cafe.description || "A cozy spot perfect for studying and relaxing."}
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
      </section>

      <section className="features-section">
        <h2 className="section-title">Why SpotCheck?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Updates</h3>
            <p>See live seat availability across all campus cafés instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Easy Navigation</h3>
            <p>Get directions to your chosen café with one tap.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Save Favorites</h3>
            <p>Bookmark your go-to study spots for quick access.</p>
          </div>
        </div>
      </section>

      {!user && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to find your perfect study spot?</h2>
            <p>Join SpotCheck today and never waste time looking for a seat again.</p>
            <a href="/signup" className="btn-primary-large">Sign Up Now</a>
          </div>
        </section>
      )}
    </main>
  );
}