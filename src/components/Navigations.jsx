import { NavLink } from 'react-router-dom';
import PropTypes    from 'prop-types';

export default function Navigations({ token, handleLogout }) {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink
            to="/books"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Books
          </NavLink>
        </li>

        {!token ? (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/account"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Account
              </NavLink>
            </li>
            <li>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

Navigations.propTypes = {
  token: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
};
