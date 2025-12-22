import { Link } from 'react-router-dom';

const featuredCafes = [
  {
    name: 'Central Library Café',
    emoji: '💻',
    blurb: 'Quiet study atmosphere with fast WiFi and plenty of power outlets.',
    location: 'Library Building, 2nd Floor',
    status: 'Available',
    seatsAvailable: 35,
    seatsTotal: 50,
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Student Union Lounge',
    emoji: '👩‍💻',
    blurb: 'Vibrant social space with coffee, snacks, and collaborative seating.',
    location: 'Student Union, Ground Floor',
    status: 'Filling',
    seatsAvailable: 12,
    seatsTotal: 40,
    img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Business School Café',
    emoji: '📚',
    blurb: 'Premium coffee and quiet workspace for focused studying.',
    location: 'Business Building, 3rd Floor',
    status: 'Available',
    seatsAvailable: 28,
    seatsTotal: 35,
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Engineering Hub Café',
    emoji: '🧠',
    blurb: 'Power-heavy seating perfect for coding marathons and group projects.',
    location: 'Engineering Center, Level 1',
    status: 'Available',
    seatsAvailable: 22,
    seatsTotal: 32,
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Riverwalk Espresso Bar',
    emoji: '☕️',
    blurb: 'Serene views of the river, natural light, and artisanal espresso drinks.',
    location: 'Riverwalk Pavilion',
    status: 'Filling',
    seatsAvailable: 9,
    seatsTotal: 28,
    img: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Arts District Roastery',
    emoji: '🎧',
    blurb: 'Creative atmosphere with rotating art installations and gourmet pastries.',
    location: 'Fine Arts Building, Street Level',
    status: 'Full',
    seatsAvailable: 0,
    seatsTotal: 24,
    img: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d12?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Science Quad Brew Lab',
    emoji: '🖥️',
    blurb: 'Cold brew on tap, lab-style seating, and built-in whiteboards for brainstorming.',
    location: 'Science Quad, Innovation Wing',
    status: 'Available',
    seatsAvailable: 18,
    seatsTotal: 30,
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dormside Night Owl Café',
    emoji: '🛋️',
    blurb: 'Open late with cozy booths, board games, and comfort snacks for night owls.',
    location: 'East Dorm Commons',
    status: 'Filling',
    seatsAvailable: 7,
    seatsTotal: 26,
    img: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=800&q=80',
  },
];

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

const Landing = () => (
  <main className='landing-spotcheck'>
    <section className='hero-section'>
      <div className='hero-content'>
        <h1 className='hero-title'>
          <span className='hero-emoji'>☕</span>
          Find Your Perfect Study Spot
        </h1>
        <p className='hero-subtitle'>
          Check real-time café availability across campus. Never waste time traveling to a full café again.
        </p>
      </div>
      <div className='hero-stats'>
        <div className='stat-card'>
          <span className='stat-number'>4</span>
          <span className='stat-label'>Campus Cafés</span>
        </div>
        <div className='stat-card'>
          <span className='stat-number'>110</span>
          <span className='stat-label'>Available Seats</span>
        </div>
        <div className='stat-card'>
          <span className='stat-number'>Real-Time</span>
          <span className='stat-label'>Updates</span>
        </div>
      </div>
    </section>

    <section className='cafes-preview'>
      <div className='preview-header'>
        <div>
          <h2 className='section-title'>Featured Campus Cafés</h2>
          <p className='section-subtitle'>Find your perfect study spot with real-time availability</p>
        </div>
      </div>

      <div className='cafe-cards-grid'>
        {featuredCafes.map((cafe) => (
          <article className='cafe-preview-card' key={cafe.name}>
            <div className='cafe-image-wrapper'>
              <img src={cafe.img} alt={`${cafe.name} interior`} loading='lazy' />
              <span className='cafe-emoji-badge'>{cafe.emoji}</span>
            </div>
            <div className='cafe-card-content'>
              <h3 className='cafe-card-name'>{cafe.name}</h3>
              <p className='cafe-card-location'>📍 {cafe.location}</p>
              <p className='cafe-card-blurb'>{cafe.blurb}</p>
              
              <div className='cafe-card-footer'>
                <span className={`status-badge ${getStatusClass(cafe.status)}`}>
                  {getStatusEmoji(cafe.status)} {cafe.status}
                </span>
                <span className='seats-info'>
                  <strong>{cafe.seatsAvailable}</strong> / {cafe.seatsTotal} seats
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className='features-section'>
      <h2 className='section-title'>Why SpotCheck?</h2>
      <div className='features-grid'>
        <div className='feature-card'>
          <div className='feature-icon'>📍</div>
          <h3>Real-Time Availability</h3>
          <p>See exactly how many seats are available before you leave</p>
        </div>
        <div className='feature-card'>
          <div className='feature-icon'>⚡</div>
          <h3>Save Time</h3>
          <p>No more walking to full cafés - check availability instantly</p>
        </div>
        <div className='feature-card'>
          <div className='feature-icon'>📊</div>
          <h3>Detailed Info</h3>
          <p>View hours, WiFi speed, noise levels, and amenities</p>
        </div>
      </div>
    </section>

  </main>
);

export default Landing;
