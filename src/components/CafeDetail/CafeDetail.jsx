import { useContext } from 'react'; 
import { UserContext } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCafeById } from '../../services/cafeService';

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafe = async () => {
      setLoading(true);
      const data = await getCafeById(id);
      setCafe(data);
      setLoading(false);
    };
    fetchCafe();
  }, [id]);

  if (loading) return <p>Loading café details...</p>;
  if (!cafe) return <p>Café not found</p>;

  const getStatusEmoji = (status) => {
    if (status === 'Available') return '🟢';
    if (status === 'Filling') return '🟠';
    return '🔴';
  };

  const getStatusClass = (status) => {
    if (status === 'Available') return 'status-available';
    if (status === 'Filling') return 'status-filling';
    return 'status-full';
  };

  const occupancyPercentage = ((cafe.totalSeats - cafe.availableSeats) / cafe.totalSeats * 100).toFixed(0);

  return (
    <main className="landing-spotcheck">
      <button onClick={() => navigate('/')} className="back-btn">
  ← Back to Dashboard
    </button>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-emoji">{cafe.emoji || '☕'}</span>
            {cafe.name}
          </h1>
          <p className="hero-subtitle">
            📍 {cafe.location}
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{cafe.availableSeats}</span>
            <span className="stat-label">Available Seats</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{cafe.totalSeats}</span>
            <span className="stat-label">Total Seats</span>
          </div>
          <div className="stat-card">
            <span className={`status-badge ${getStatusClass(cafe.status)}`}>
              {getStatusEmoji(cafe.status)} {cafe.status}
            </span>
          </div>
        </div>
      </section>

      <section className="cafes-preview">
        <div className="preview-header">
          <h2 className="section-title">Café Details</h2>
        </div>

        <div className="cafe-cards-grid">
          <article className="cafe-preview-card">
            <div className="cafe-image-wrapper">
              <img 
                src={cafe.photo || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'} 
                alt={cafe.name}
                loading="lazy"
              />
            </div>
            <div className="cafe-card-content">
              <h3 className="cafe-card-name">About</h3>
              <p className="cafe-card-blurb">{cafe.description || 'No description available'}</p>
            </div>
          </article>

          <article className="cafe-preview-card">
            <div className="cafe-card-content">
              <h3 className="cafe-card-name">⏰ Hours</h3>
              <p className="cafe-card-blurb">
                <strong>Monday - Friday:</strong> {cafe.hours?.weekday?.open || '07:00'} - {cafe.hours?.weekday?.close || '23:00'}<br/>
                <strong>Saturday:</strong> {cafe.hours?.saturday?.open || '09:00'} - {cafe.hours?.saturday?.close || '21:00'}<br/>
                <strong>Sunday:</strong> {cafe.hours?.sunday?.open || '10:00'} - {cafe.hours?.sunday?.close || '20:00'}
              </p>
            </div>
          </article>

          <article className="cafe-preview-card">
            <div className="cafe-card-content">
              <h3 className="cafe-card-name">🎯 Amenities</h3>
              <p className="cafe-card-blurb">
                📶 WiFi: {cafe.amenities?.wifi ? '✓' : '✗'}<br/>
                🔌 Power Outlets: {cafe.amenities?.powerOutlets ? '✓' : '✗'}<br/>
                🤫 Quiet Zone: {cafe.amenities?.quietZone ? '✓' : '✗'}<br/>
                🍽️ Food Available: {cafe.amenities?.foodAvailable ? '✓' : '✗'}
              </p>
            </div>
          </article>

          <article className="cafe-preview-card">
            <div className="cafe-card-content">
              <h3 className="cafe-card-name">🔊 Noise Level</h3>
              <p className="cafe-card-blurb">
                <span className={`status-badge ${cafe.noiseLevel === 'Quiet' ? 'status-available' : cafe.noiseLevel === 'Loud' ? 'status-full' : 'status-filling'}`}>
                  {cafe.noiseLevel || 'Moderate'}
                </span>
              </p>
              <p className="cafe-card-blurb" style={{ marginTop: '1rem' }}>
                {cafe.noiseLevel === 'Quiet' && 'Perfect for focused studying'}
                {cafe.noiseLevel === 'Moderate' && 'Good for general work'}
                {cafe.noiseLevel === 'Loud' && 'Best for group work'}
                {!cafe.noiseLevel && 'Good for general work'}
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Live Occupancy</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">{occupancyPercentage}%</div>
            <h3>Currently Occupied</h3>
            <p>{cafe.totalSeats - cafe.availableSeats} out of {cafe.totalSeats} seats taken</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Last Updated</h3>
            <p>{new Date(cafe.updatedAt).toLocaleString()}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">{getStatusEmoji(cafe.status)}</div>
            <h3>Current Status</h3>
            <p>{cafe.status} - {cafe.availableSeats} seats available</p>
          </div>
        </div>
      </section>
    </main>
  );
}