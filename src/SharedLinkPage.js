// SharedLinkPage.js
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import LinkersDBlogo from './LinkersDBlogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt,faDashboard } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getFirestore, getDoc, doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { useCookies } from 'react-cookie';
import { BounceLoader } from 'react-spinners';

const SharedLinkPage = () => {
  const { linkId } = useParams();
  const [linkData, setLinkData] = useState(null);
  const [userId, setUserId] = useState(undefined);
  const [cookies, setCookie] = useCookies(['userId']);
  const history = useNavigate();

  //#region Friebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyBaFxFtY1MUEVywG0GEjEflxa4L4PkE4qA",
    authDomain: "linkersdb-firestore.firebaseapp.com",
    projectId: "linkersdb-firestore",
    storageBucket: "linkersdb-firestore.appspot.com",
    messagingSenderId: "948306998721",
    appId: "1:948306998721:web:001b9c324a55eb77dcab40"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app); // Get the Firestore instance
  //#endregion
  useEffect(() => {
    const userIdCookie = cookies.userId;
    console.log("userIdCookie:", userIdCookie);

    if (userIdCookie) {
      setUserId(userIdCookie);
    }
  }, [cookies]);

  useEffect(() => {
    const logStateAfterDelay = setTimeout(() => {
      console.log("userId state (after setting):", userId);
    }, 100);

    return () => clearTimeout(logStateAfterDelay);
  }, [userId]);
  useEffect(() => {
    // Function to get a link by ID from a user's collection
    const getLinkById = async () => {
      // Check if the user is logged in
      const url = window.location.href;
      if (cookies == undefined || cookies == "" || cookies == null) {
        // User is not logged in, redirect to login page
        history('./LoginSignUp', { state: { data: url } });;
        return;
      }

      try {
        const linkers = doc(db, "tlinks", linkId);

        const docSnap = await getDoc(linkers);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Document data:", data);

          // Update linkData state
          setLinkData(data);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Error getting link:', error);
      }
    };

    if (linkId) {
      getLinkById();
    }
  }, [linkId, history]);
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);


  const handleAddToList = async () => {

    const response = await addDoc(collection(db, "tlinks"), {
      "boolImp": false,
      "collection_id": null,
      "createDate": startOfToday,
      "note": linkData.note,
      "updateDate": startOfToday,
      "url": linkData.url,
      "user_id": cookies['userId']
    });
    if (response.id) {
      history("../Dashboard");
    }
  };
  const handleDashboard = async () => {
      history("../Dashboard");
  };

  return (
    <div className="container text-center">
      <button  className="btn" style={{ margin: '20px auto 20px auto' }} onClick={handleDashboard}>Dashboard</button>
      <div className="image">
        <img src={LinkersDBlogo} style={{ height: '100px', width: 'auto' }} alt="LinkersDB Logo" />
      </div>
      <h4 className="mt-4">Shared Link Details</h4>
      <hr style={{ width: '800px', margin: '20px auto 20px auto' }} />
      {linkData ? (
        <div className="w-75 mx-auto mt-4">
          <div className="form-group">
            <label className="font-weight-bold">Notes:</label>
            <input style={{ textAlign: 'center' }} value={linkData.note} readOnly className="form-control mb-3" />
          </div>
          <div className="form-group">
            <label className="font-weight-bold">URL:</label>
            <div className="input-group d-flex mb-3">
              <input type="text" style={{ textAlign: 'center' }} className="form-control" value={linkData.url} readOnly />
              <div className="input-group-append pl-5">
                <a
                  href={linkData.url}
                  className="btn btn-outline-secondary "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                </a>
              </div>
            </div>
          </div>
          <button onClick={handleAddToList} className="btn">Add to List</button>
        </div>
      ) : (
        <p>Loading.....</p>
      )}
    </div>

  );

};

export default SharedLinkPage;
