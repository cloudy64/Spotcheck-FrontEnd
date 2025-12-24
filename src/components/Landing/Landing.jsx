import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);


  if (user) {
    navigate("/cafes");
    return null;
  }

  return (
    <div className="landing-spotcheck">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-emoji">☕</span>
          <h1 className="hero-title">Campus Cafés</h1>
          <p className="hero-subtitle">
            Find your perfect study spot with real-time café availability across campus
          </p>
        </div>
      </section>
    </div>
  );
}