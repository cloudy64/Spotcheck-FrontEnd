import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate(); 

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleCreateCafe = () => {
    navigate('/admin'); 
  };

  return (
    <nav>
      <ul className={`nav-list${user ? '' : ' nav-list--guest'}`}>
        {user ? (
          <>
            <li>Welcome, {user.username}</li>
            <li><Link className='nav-link' to='/'>Dashboard</Link></li>
            {user.role === 'admin' && (
              <li>
                <button type='button' className='nav-action' onClick={handleCreateCafe}>
                  Create Cafe
                </button>
              </li>
            )}
            <li><Link className='nav-link' to='/' onClick={handleSignOut}>Sign Out</Link></li>
          </>
        ) : (
          <>
            <li><Link className='nav-link' to='/'>🏠 Home</Link></li>
            <li><Link className='nav-pill nav-pill--solid' to='/sign-up'>📝 Sign Up</Link></li>
            <li><Link className='nav-pill nav-pill--outline' to='/sign-in'>🔐 Sign In</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;