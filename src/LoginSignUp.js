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
    apiKey: "AIzaSyBaFxFtY1MUEVywG0GEjEflxa4L4PkE4qA",
    authDomain: "linkersdb-firestore.firebaseapp.com",
    projectId: "linkersdb-firestore",
    storageBucket: "linkersdb-firestore.appspot.com",
    messagingSenderId: "948306998721",
    appId: "1:948306998721:web:001b9c324a55eb77dcab40"
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
        <div className={`col-md-6 fade-transition ${isSignUp ? 'active' : ''}`}>
          <div className="text-center pb-3">
            <img
              src={LinkersDBlogo}
              style={{ display: 'block', margin: '-15px auto 0 auto', height: '230px', width: 'auto',paddingLeft:'10px' }}
              alt="LinkersDB Logo"
            />
            <h1 style={{marginRight:'10px'}}>{isSignUp ? 'Sign Up' : 'Login'}</h1>
          </div>
          <div style={{margin:'0px auto 0px auto'}}>

          <div>
            <div className="form-group mt-2 mb-2">
              <label htmlFor="username" style={{ marginLeft: '47%' }} >Email:</label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%' }}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-2">
              <label htmlFor="password" style={{ marginLeft: '46%' }}>Password:</label>
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
              <div className="form-group mt-2" >
                <label htmlFor="confirmPassword" style={{ marginLeft: '42%' }}>Confirm Password:</label>
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
            <div className="text-center">
              <button className="btn" onClick={handleLogin}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>
          <p className="mt-3 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <span onClick={toggleForm} className='mt-4' style={{ cursor: 'pointer', marginBottom: '-20px' }}>
              {isSignUp ? 'Login' : 'Sign Up'}
            </span>
          </p>
          <div className='belowsection'>

            <hr style={{ width: '300px', margin: '20px auto' }} />
            <div className="text-center">
              <button className="btn " onClick={signInWithGoogle}>
                <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '10px' }} /> Continue with Google
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
