import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './checkin.css';

function Checkin({ searchdata }) {  // Accept the searchdata prop
  const navigate = useNavigate();
  const [guestPopupVisible, setGuestPopupVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
  });
  const [minCheckOutDate, setMinCheckOutDate] = useState('');

  useEffect(() => {
    if (searchdata && Object.keys(searchdata).length > 0) {
      setBookingDetails(searchdata);
      const nextDay = new Date(searchdata.checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const formattedNextDay = nextDay.toISOString().split('T')[0];
      setMinCheckOutDate(formattedNextDay);
    }
  }, [searchdata]);

  const today = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e) => {
    const selectedCheckInDate = e.target.value;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      checkInDate: selectedCheckInDate,
    }));

    const nextDay = new Date(selectedCheckInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const formattedNextDay = nextDay.toISOString().split('T')[0];
    setMinCheckOutDate(formattedNextDay);
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      checkOutDate: formattedNextDay,
    }));
  };

  const handleCheckOutChange = (e) => {
    const selectedCheckOutDate = e.target.value;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      checkOutDate: selectedCheckOutDate,
    }));
  };

  const toggleGuestPopup = () => {
    setGuestPopupVisible(!guestPopupVisible);
  };

  const handleAdultChange = (increment) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      adults: prevDetails.adults + increment,
    }));
  };

  const handleChildrenChange = (increment) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      children: prevDetails.children + increment,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/rooms', { state: { data: bookingDetails } });
  };

  return (
    <section className="section__container booking__container">
      <form action="" className="booking__form">
        <div className="input__group">
          <span><i className="ri-calendar-2-fill"></i></span>
          <div>
            <label htmlFor="check-in">CHECK-IN</label>
            <input
              type="date"
              name="check-in"
              id="check-in"
              min={today}
              className="date-picker"
              value={bookingDetails.checkInDate}
              onChange={handleCheckInChange}
            />
          </div>
        </div>
        <div className="input__group">
          <span><i className="ri-calendar-2-fill"></i></span>
          <div>
            <label htmlFor="check-out">CHECK-OUT</label>
            <input
              type="date"
              name="check-out"
              id="check-out"
              min={minCheckOutDate}
              className="date-picker"
              value={bookingDetails.checkOutDate || minCheckOutDate}
              onChange={handleCheckOutChange}
            />
          </div>
        </div>
        <div className="input__group">
          <span><i className="ri-user-fill"></i></span>
          <div>
            <label htmlFor="guest">GUEST</label>
            <input
              type="text"
              placeholder={`Adults: ${bookingDetails.adults}, Children: ${bookingDetails.children}`}
              name="guest"
              id="guest"
              readOnly
              onClick={toggleGuestPopup}
            />
          </div>
        </div>
        <div className="input__group input__btn">
          <button className="btn" onClick={handleSearch}>Search</button>
        </div>
      </form>

      {guestPopupVisible && (
        <div className="guest__popup">
          <div className="popup__content">
            <div className="popup__item">
              <span>Adults</span>
              <button onClick={() => handleAdultChange(-1)} disabled={bookingDetails.adults <= 1}>-</button>
              <span>{bookingDetails.adults}</span>
              <button onClick={() => handleAdultChange(1)}>+</button>
            </div>
            <div className="popup__item">
              <span>Children</span>
              <button onClick={() => handleChildrenChange(-1)} disabled={bookingDetails.children <= 0}>-</button>
              <span>{bookingDetails.children}</span>
              <button onClick={() => handleChildrenChange(1)}>+</button>
            </div>
            <button className="popup__close" onClick={toggleGuestPopup}>Set</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Checkin;
