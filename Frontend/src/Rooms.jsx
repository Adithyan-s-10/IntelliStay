import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import Header from '../components/Header';
import './Rooms.css';
import room1 from '../src/assets/room-1.jpg';
import room2 from '../src/assets/room-2.jpg';
import room3 from '../src/assets/room-3.jpg';
import Checkin from '../components/checkin';
import { useLocation,useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

function Rooms() {
  useAuth();
  const navigate=useNavigate();
  const [rooms, setRooms] = useState([]);
  const location = useLocation();
  const state = location.state || {};
  const searchdata = state.data || {};

  const checkrooms = () => {
    axios.post("http://localhost:3001/checkrooms", { searchdata })
      .then(res => {
        if (res.status === 200) {
          setRooms(res.data); // Assuming the response data contains the rooms
        }
      })
      .catch(err => {
        console.error("Error", err);
      });
  };

  useEffect(() => {
    checkrooms();
  }, [searchdata]);

  return (
    <div>
      <div className='room_nav'>
        <Header />
      </div>
      <Checkin searchdata={searchdata} />
      <section className="section__container room__container">
        <p className="section__subheader">OUR LIVING ROOM</p>
        <h2 className="section__header">The Most Memorable Rest Time Starts Here.</h2>
        <div className="room__grid">
          {rooms.map(room => (
            <div key={room._id} className="room__card">
              <div className="room__card__image">
                <img src={room1} alt="room" />
                <div className="room__card__icons">
                  <span><i className="ri-heart-fill"></i></span>
                  <span><i className="ri-paint-fill"></i></span>
                  <span><i className="ri-shield-star-line"></i></span>
                </div>
              </div>
              <div className="room__card__details">
                <h4>{room.roomtype}</h4>
                <p>{room.description}</p>
                <h5>Starting from <span>₹{room.rate}/night</span></h5>
                <button className="btn" onClick={()=>{navigate('/roominfo',{state:{data: searchdata,roomdata:room}})}} >See Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Rooms;
