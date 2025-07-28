import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import PropTypes               from 'prop-types';

export default function Account({ token }) {
  const [user, setUser]               = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(
          'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error();
        setUser(await res.json());
      } catch {
        console.error('Unauthorized');
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(
          'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error();
        setReservations(await res.json());
      } catch {
        console.error('Failed to load reservations');
      }
    })();
  }, [token]);

  const handleReturn = async (id) => {
    try {
      const res = await fetch(
        `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status !== 204) throw new Error();
      setReservations(r => r.filter(x => x.id !== id));
    } catch {
      console.error('Return failed');
    }
  };

  if (!token) return <p>Please log in to view your account.</p>;
  if (!user) return <p>Loading account details…</p>;

  return (
    <div>
      <h1>
        Welcome, {user.firstname} {user.lastname}
      </h1>
      <p>Email: {user.email}</p>
      <h2>Your Checked-Out Books</h2>
      {reservations.length ? (
        <ul>
          {reservations.map(r => (
            <li key={r.id}>
              <Link to={`/books/${r.bookid}`}>{r.title}</Link> by {r.author}{' '}
              <button onClick={() => handleReturn(r.id)}>Return</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no books checked out.</p>
      )}
    </div>
  );
}

Account.propTypes = {
  token: PropTypes.string,
};
