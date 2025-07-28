import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes                    from 'prop-types';

export default function SingleBook({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        setBook(await res.json());
      } catch (err) {
        console.error(err);
        setError('Could not load book.');
      }
    })();
  }, [id, token]);

  const handleCheckout = async () => {
    try {
      const res = await fetch(
        'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookId: Number(id) }),
        }
      );
      if (res.status !== 201) throw new Error('Checkout failed');
      navigate('/account');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!book) return <p>Loading…</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p>{book.description}</p>
      <img src={book.coverimage} alt={book.title} style={{ maxWidth: '200px' }} />
      <p><strong>Available:</strong> {book.available ? 'Yes' : 'No'}</p>
      {token && book.available && (
        <button onClick={handleCheckout}>Check Out</button>
      )}
    </div>
  );
}

SingleBook.propTypes = {
  token: PropTypes.string,
};
