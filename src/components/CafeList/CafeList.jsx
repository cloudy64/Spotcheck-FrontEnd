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


    </div>
  );
}