import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  
  const [message, setMessage] = useState("");
  
  const roleOptions = [
    { value: 'student', label: 'Student', description: 'Find study spots', icon: '📚' },
    { value: 'admin', label: 'Admin', description: 'Manage cafés', icon: '🧑‍💻' },
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    passwordConf: ""
  });

  const { username, email, role, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setMessage("");
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate("/cafes");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && email && role && password && password === passwordConf);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>☕ Create Account</h1>
        <p>Join Campus Cafés to find your perfect study spot</p>

        <p className="form-message">{message}</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <div className='input-shell'>
              <span className='input-icon' aria-hidden='true'>👤</span>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <div className='input-shell'>
              <span className='input-icon' aria-hidden='true'>✉️</span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="your.email@university.edu"
                required
              />
            </div>
          </div>

          <div className="role-field">
            <span className="role-label">Role</span>
            <div className="role-options" role="group" aria-label="Select role">
              {roleOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`role-button${role === option.value ? ' selected' : ''}`}
                  onClick={() => handleRoleSelect(option.value)}
                  aria-pressed={role === option.value}
                >
                  <span className="role-header">
                    <span className="role-icon" aria-hidden="true">{option.icon}</span>
                    <span className="role-title">{option.label}</span>
                  </span>
                  <span className="role-description">{option.description}</span>
                </button>
              ))}
            </div>
            <input type="hidden" name="role" value={role} required readOnly />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className='input-shell'>
              <span className='input-icon' aria-hidden='true'>🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirm Password</label>
            <div className='input-shell'>
              <span className='input-icon' aria-hidden='true'>🔐</span>
              <input
                type="password"
                id="confirm"
                name="passwordConf"
                value={passwordConf}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isFormInvalid()}
            >
              Sign Up
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
