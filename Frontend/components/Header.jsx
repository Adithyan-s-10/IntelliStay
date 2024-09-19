import React, { useEffect,useState } from 'react';
import './Header.css';
import logo from '../src/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollReveal from 'scrollreveal'; 

 function Header() {
    const navigate = useNavigate();

    useEffect(() => {
      const menuBtn = document.getElementById("menu-btn");
      const navLinks = document.getElementById("nav-links");
      const menuBtnIcon = menuBtn.querySelector("i");
  
      const toggleMenu = () => {
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        menuBtnIcon.setAttribute("className", isOpen ? "ri-close-line" : "ri-menu-line");
      };
  
      menuBtn.addEventListener("click", toggleMenu);
      navLinks.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtnIcon.setAttribute("className", "ri-menu-line");
      });
  
      const scrollRevealOption = {
        distance: "50px",
        origin: "bottom",
        duration: 1000,
      };
  
      ScrollReveal().reveal(".header__container p", {
        ...scrollRevealOption,
      });
  
      ScrollReveal().reveal(".header__container h1", {
        ...scrollRevealOption,
        delay: 500,
      });
  
      ScrollReveal().reveal(".about__image img", {
        ...scrollRevealOption,
        origin: "left",
      });
  
      ScrollReveal().reveal(".about__content .section__subheader", {
        ...scrollRevealOption,
        delay: 500,
      });
  
      ScrollReveal().reveal(".about__content .section__header", {
        ...scrollRevealOption,
        delay: 1000,
      });
  
      ScrollReveal().reveal(".about__content .section__description", {
        ...scrollRevealOption,
        delay: 1500,
      });
  
      ScrollReveal().reveal(".about__btn", {
        ...scrollRevealOption,
        delay: 2000,
      });
  
      ScrollReveal().reveal(".room__card", {
        ...scrollRevealOption,
        interval: 500,
      });
  
      ScrollReveal().reveal(".service__list li", {
        ...scrollRevealOption,
        interval: 500,
        origin: "right",
      });
  
      // Cleanup listeners on component unmount
  
      return () => {
        menuBtn.removeEventListener("click", toggleMenu);
        navLinks.removeEventListener("click", () => {});
      };
    }, []);
    axios.defaults.withCredentials = true;
    const handleLogout = () => {
      axios.post("http://localhost:3001/logout")
        .then(res => {
          if (res.status === 200) {
            localStorage.removeItem('userEmail');
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            // localStorage.setItem('signout', 'signout');
            navigate("/signup"); // Redirect to public route
          }
        })
        .catch(err => {
          console.error("Error logging out:", err);
        });
    };
    const [user, setUser] = useState('');
    const handleUser=(email)=>{
      if(email){
        setUser(email);
      }
      else{
        navigate('/signup')
      }
  
    }
  
    useEffect(() => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        handleUser(email);
       
      } else {
        setUser('');
         // Redirect to login if no session found
      }
    }, []);
  return (
    <div>
      
    
        <nav>
          <div className="nav__bar">
            <div className="logo">
              <a href="#"><img src={logo} alt="logo" /></a>
            </div>
            <div className="nav__menu__btn" id="menu-btn">
              <i className="ri-menu-line"></i>
            </div>
          </div>
          <ul className="nav__links" id="nav-links">
            <li><a href="#home" onClick={()=>{navigate('/')}}>Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#service">Services</a></li>
            <li><a href="#explore">Explore</a></li>
            <li><a href="#contact">Contact</a></li>
            {user ? (
                <>
                 
                  <li className="dropdown">
                        <a href="" className="username">{user}</a>
                            <div className="dropdown-content">
                                  <a href="/profile">Profile</a>
                                   <a href="/my-bookings">My Bookings</a>
                                   <a href="" onClick={handleLogout}>Logout</a>
                            </div>
                   </li>
              </>
            
              
            ) : (
              <li>
               <a href="" onClick={() => navigate('/signup')} > Login</a>
              </li>
            )}
            {/*<li><a href="#" onClick={handleLogout}>Logout</a></li>
            <li><a href="#"></a>{user}</li>
            */}
          </ul>
        <button className="btn nav__btn" onClick={() => navigate('/rooms')}>Book Now</button> 
        </nav>
        
    </div>
  )
}

export default Header;