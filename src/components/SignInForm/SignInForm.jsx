import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/cafes');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <h1>🔐 Welcome Back</h1>
        <p>Sign in to manage campus cafés and track availability</p>

        <p className='form-message'>{message}</p>

        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='auth-field'>
            <label htmlFor='username'>Username</label>
            <div className='input-shell'>
              <span className='input-icon' aria-hidden='true'>👤</span>
              <input
                type='text'
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Enter your username'
                required
              />
            </div>
          </div>

          <div className='auth-field'>
            <label htmlFor='password'>Password</label>
            <div className='input-shell'>
              <span className='input-icon' aria-hidden='true'>🔒</span>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                required
              />
            </div>
          </div>

          <div className='form-buttons'>
            <button type='submit' className='btn-primary'>
              Sign In
            </button>
            <button
              type='button'
              className='btn-secondary'
              onClick={() => navigate('/sign-up')}
            >
              Need an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
