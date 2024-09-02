
import React, { useState ,useEffect} from 'react';
import './Style.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "./Firebase_config"; // Ensure firebaseApp is correctly initialized
import Swal from 'sweetalert2';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

function Signupin() {
  axios.defaults.withCredentials = true;
  const [signUpMode, setSignUpMode] = useState(false);

  const handleSignUpClick = () => {
    setSignUpMode(true);
  };

  const handleSignInClick = () => {
    setSignUpMode(false);
  };

const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    password: '',
    cpassword: '',
    emailsign: '',
    passwordsign: '',

});

const[focus, setFocus]=useState({
    errFirstname: false,
    errEmail: false,
    errPassword: false,
    errCpassword: false,
    errEmailsign: false,
    errPasswordsign: false,
})




const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setFormData({
        ...formData, [name] : value
    })
}
const navigate=useNavigate();

const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/register',{...formData})
    .then(res =>{console.log(res)
      if(res.data==="exists"){
        Swal.fire("email already exists...")
      }
      else{
        setSignUpMode(false);
        Swal.fire("submitted successfully. :)")}
    })
    .catch(err => console.log(err)) 
}

const handleLogin=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/login',{...formData})
    .then(res => {console.log(res.data)
      
        if(res.status === 200){
          localStorage.setItem('userEmail', res.data.data);
          localStorage.setItem('userId', res.data.id);
            navigate('/')
        }else
        {
          Swal.fire(res.data)
        }
    })
    .catch(err => console.log(err))
}

// const loginwithgoogle=()=>{
//   window.open("http://localhost:3001/auth/google/callback","_self")
// }


const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
        };

        axios.post("http://localhost:3001/authWithGoogle", fields).then((res) => {
          try {
            if (res.status === 200) {
              localStorage.setItem("token", res.data.token);

              const user = {
                name: res.data.user?.name,
                email: res.data.user?.email,
                userId: res.data.user?._id,
              };

              localStorage.setItem("userEmail", user.email);
              localStorage.setItem("userId", user.userId);

              Swal.fire(res.data.msg);
              navigate('/')

             
            } else {
              Swal.fire(res.data.msg);
              navigate('/signup')
              
            }
          } catch (error) {
            console.log(error);
           
          }
        });

        Swal.fire("User authentication successful!");
      })
      .catch((error) => {
        Swal.fire( error.message);
       
      });
  };

  return (
    <div className={`container ${signUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" name="emailsign" placeholder="Email" value={FormData.emailsign} onChange={handleChange} onBlur={()=>setFocus({...focus,errEmailsign: true})} focus={focus.errEmailsign.toString()}  required/>
              <span>enter a valid email id</span>
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="passwordsign" pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])([a-zA-Z\d[^a-zA-Z\d]]{6,50})$" placeholder="Password" value={FormData.passwordsign} onChange={handleChange} onBlur={()=>setFocus({...focus,errPasswordsign: true})} focus={focus.errPasswordsign.toString()} required/>
              <span>password should be atleast 6 characters and include atleast 1 letter,1 number,1 special characters</span>
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
             
              
              <a href="#" className="social-icon" onClick={signInWithGoogle}>
                <i className="fab fa-google"></i>
              </a>
              
            </div>
          </form>
          <form action="#" className="sign-up-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign up</h2>
            <div className="input-fields-container">
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" pattern="^[A-Za-z]+$" className='input' name="firstname" placeholder="First name" value={FormData.firstname} onChange={handleChange} onBlur={()=>setFocus({...focus,errFirstname: true})} focus={focus.errFirstname.toString()} required/>
              <span>first name should be character</span>
            </div>
           
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" name="email" className='input'  placeholder="Email" value={FormData.email} onChange={handleChange} onBlur={()=>setFocus({...focus,errEmail: true})} focus={focus.errEmail.toString()} required/>
              <span>enter a valid email</span>
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" className='input' name="password" pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])([a-zA-Z\d[^a-zA-Z\d]]{6,50})$" placeholder="Password" value={FormData.password} onChange={handleChange} onBlur={()=>setFocus({...focus,errPassword: true})} focus={focus.errPassword.toString()} required/>
              <span>password should be atleast 6 characters and include atleast 1 letter,1 number,1 special characters</span> 
            </div>
            
            
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" className='input' name="cpassword" pattern={formData.password} placeholder="Confirm Password" value={FormData.cpassword} onChange={handleChange} onBlur={()=>setFocus({...focus,errCpassword: true})} focus={focus.errCpassword.toString()} required/>
              <span>password not matching</span>
            </div>
            </div>
            
        
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
             
              <a href="#" className="social-icon" onClick={signInWithGoogle}>
                <i className="fab fa-google"></i>
              </a>
             
            </div>
            
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
            The Best Holidays Start Here!
            Make Yourself At Home In Our Hotel..
            </p>
            <button className="btn transparent" onClick={handleSignUpClick} id="sign-up-btn">
              Sign up
            </button>
          </div>
          <img src="img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
            The Best Holidays Start Here!
            Make Yourself At Home In Our Hotel..
            </p>
            <button className="btn transparent" onClick={handleSignInClick} id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src="img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Signupin;
