import React, { useState } from 'react';
import './loginpage.css'; // Import your CSS file for styling
import LinkersDBlogo from './LinkersDBlogo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp() {
  const navigate = useNavigate(); // Change 'history' to 'navigate'
  const location = useLocation();
  const transferUrl = location.pathname;

  let url;
  if (transferUrl.includes('/SharedLinkPage/')) {
    // Extract the shared link part
    url = transferUrl.split('/SharedLinkPage/')[0] + '/SharedLinkPage/' + transferUrl.split('/SharedLinkPage/')[1].split('/')[0];
  } else if (transferUrl.includes('/SharedCollectionPage/')) {
    // Extract the share collection part
    url = transferUrl.split('/SharedCollectionPage/')[0] + '/SharedCollectionPage/' + transferUrl.split('/SharedCollectionPage/')[1].split('/')[0];
  } else {
    // Handle other cases or provide a default URL
    url = '../Dashboard';
  }

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //#region Firebase Config
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  //#endregion
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const userId = user.uid; // Accessing the user ID
        if (userId !== ' ' || userId !== null) {
          localStorage.setItem('userId', userId);
          document.cookie = `userId=${userId}; expires=your_expiry_time_in_gmt; path=/`;
          navigate(url);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = async () => {
    const apibaseurl = 'http://127.0.0.1:5000/';

    if(!username  || !password){
      alert("Fill the required Fields!")
      return;
    }

    if (!confirmPassword && isSignUp==true) {
      alert("Confirm Your Password");
      return;
    }
  
    // Check if password and confirm password match
    if (password !== confirmPassword && isSignUp==true) {
      alert("Password and Confirm Password do not match");
      return;
    }
    // Set the URL for the API based on the current mode (sign-up or login)
    const apiUrl = isSignUp ? `${apibaseurl}/signup` : `${apibaseurl}/login`;

    if (apiUrl === `${apibaseurl}/signup`) {
      createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userId = user.uid; // Accessing the user ID
          if (userId !== ' ' || userId !== null) {
            localStorage.setItem('userId', userId);
            document.cookie = `userId=${userId}; expires=your_expiry_time_in_gmt; path=/`;
            navigate(url);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userId = user.uid; // Accessing the user ID
          if (userId !== ' ' || userId !== null) {
            localStorage.setItem('userId', userId);
            document.cookie = `userId=${userId}; expires=your_expiry_time_in_gmt; path=/`;
            navigate(url);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  return (
    <div className="container" style={{ height: 'auto', width: 'auto' }}>
      <div className="row justify-content-center">
        <div className="col-md-6 fade-transition" style={{ position: 'relative' }}>
          <div className="text-center pb-3">
            <img
              src={LinkersDBlogo}
              style={{ display: 'block', margin: '-15px auto 0 auto', height: '230px', width: 'auto', paddingLeft: '10px' }}
              alt="LinkersDB Logo"
            />
          </div>
          <div className='d-flex justify-content-center'>
            <div></div>
            <div className="pt-1 pb-1">
              <h2 style={{ position: 'absolute', transform: 'translate(-50%, -50%)', margin: '0', transition: 'opacity 0.5s', opacity: isSignUp ? '0' : '1' }}>Login</h2>
              <h2 style={{ position: 'absolute', marginTop: '-50px', transform: 'translate(-50%, -50%)', margin: '0', transition: 'opacity 0.5s', opacity: isSignUp ? '1' : '0' }}>Sign Up</h2>
            </div>
            <div></div>
          </div>
          <div>
            <div className="row justify-content-center mt-3">
            </div>
            <div className="form-group mt-2 mb-2">
              <label htmlFor="password" style={{fontSize:'12px'}}>Email:</label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%' }}
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-2">
              <label htmlFor="password" style={{fontSize:'12px'}}>Password:</label>
              <input
                type="password"
                className="form-control"
                style={{ width: '100%' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <div className="form-group mt-2">
                <label htmlFor="confirmPassword" style={{fontSize:'12px'}}>Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  style={{ width: '100%' }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="text-center mt-2">
              <button className="btn" onClick={handleLogin}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </div>
            <p className="mt-3 text-center" onClick={toggleForm}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <span  className='mt-4 mt-2' style={{ cursor: 'pointer', marginBottom: '-20px' }}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </span>
            </p>
          </div>
          <div className='belowsection'>
            <hr style={{width:'300px',margin:'0px auto 0px auto'}}/>
            <div className="text-center mt-3">
              <button className="btn " onClick={signInWithGoogle}>
                <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '10px' }} /> Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
