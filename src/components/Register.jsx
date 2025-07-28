import { useState }    from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes       from 'prop-types';

export default function Register({ setToken }) {
  const [firstname, setFirstname] = useState('');
  const [lastname,  setLastname ] = useState('');
  const [email,     setEmail    ] = useState('');
  const [password,  setPassword ] = useState('');
  const [error,     setError    ] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(
        'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstname, lastname, email, password }),
        }
      );
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/account');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to communicate with the server.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={e => setFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired,
};
