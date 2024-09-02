import React, { useEffect, useState } from 'react';
import Header from '../Header';
import axios from 'axios';
import './MyBookings.css'; // Create this CSS file for styling

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No user found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3001/my-bookings/${userId}`);
        if (response.status === 200) {
          setBookings(response.data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
    <div className='MyBookingsnav'>
        <Header />
    </div>
    <div className="bookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking._id}>
              <div className="booking-card">
                <p><strong>BookingId:</strong> {booking._id}</p>
                {/* <p><strong>Room:</strong> {booking.roomName}</p> */}
                <p><strong>Check-In Date:</strong>  {formatDate(booking.check_in)}</p>
                <p><strong>Check-Out Date:</strong> {formatDate(booking.check_out)}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}

export default MyBookings;
