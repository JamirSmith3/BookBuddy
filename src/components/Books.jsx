import { useEffect, useState } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import PropTypes               from 'prop-types';

import placeholderImg from '../assets/placeholder_image.png';

export default function Books({ token }) {
  const [books,        setBooks]        = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error,        setError]        = useState(null);
  const [filter,       setFilter]       = useState('');
  const [onlyAvail,    setOnlyAvail]    = useState(false);
  const [onlyMine,     setOnlyMine]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books',
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load books.');
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
        console.error('Could not load reservations');
      }
    })();
  }, [token]);

  if (error) return <p>{error}</p>;

  let displayed = books.filter((b) =>
    b.title.toLowerCase().includes(filter.toLowerCase()) ||
    b.author.toLowerCase().includes(filter.toLowerCase())
  );
  if (onlyAvail) displayed = displayed.filter((b) => b.available);
  if (onlyMine && token) {
    const mine = new Set(reservations.map((r) => r.bookid));
    displayed = displayed.filter((b) => mine.has(b.id));
  }

  return (
    <>
      {/* ——— Filter Bar ——— */}
      <div className="filter-bar">
        <input
          type="text"
          className="filter-input"
          placeholder="Search by title or author…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={onlyAvail}
              onChange={(e) => setOnlyAvail(e.target.checked)}
            />
            Only available
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => setOnlyMine(e.target.checked)}
            />
            Only my checked-out
          </label>
        </div>
      </div>

      {/* ——— Book Grid ——— */}
      <div className="book-grid">
        {displayed.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            <div className="cover">
              <img
                src={book.coverimage || placeholderImg}
                alt={book.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = placeholderImg;
                }}
              />
            </div>
            <div className="info">
              <Link to={`/books/${book.id}`}>{book.title}</Link>
              <p>by {book.author}</p>
            </div>
          </div>
        ))}
      </div>

      {!displayed.length && <p>No books match your criteria.</p>}
    </>
  );
}

Books.propTypes = {
  token: PropTypes.string,
};
