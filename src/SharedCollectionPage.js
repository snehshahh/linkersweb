// SharedCollectionPage.js
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import LinkersDBlogo from './LinkersDBlogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, addDoc, writeBatch, doc, getDoc } from 'firebase/firestore';
import { useCookies } from 'react-cookie';


const SharedCollectionPage = () => {
    const { collectionId } = useParams();
    const [collectionData, setCollectionData] = useState(null);
    const [userId, setUserId] = useState(undefined);
    const [collectionTitle, setCollectionTitle] = useState('');
    const [cookie, setCookie, removeCookie] = useCookies(['userId']); // Destructure removeCookie from useCookies
    const [hoveredLinks, setHoveredLinks] = useState({});

    const history = useNavigate();

    //#region Friebase Config
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app); // Get the Firestore instance
    //#endregion
    useEffect(() => {
        const userIdCookie = cookie.userId;
        setUserId(userIdCookie)
      }, [userId]);
      console.log(userId);

    useEffect(() => {
        // Function to get the user's shared collection of links
        const getSharedCollection = async () => {
            // Check if the user is logged in
            if (!cookie) {
                // User is not logged in, redirect to login page
                history('./LoginSignUp');
                return;
            }
            try {
                // Query to get all links from the user's collection
                const q = query(collection(db, 'tlinks'), where('collection_id', '==', collectionId));
                const querySnapshot = await getDocs(q);

                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                // Update collectionData state
                setCollectionData(data);
                console.log(collectionData);
            } catch (error) {
                console.error('Error getting shared collection:', error);
            }
        };

        getSharedCollection();
    }, [userId, history]);
    useEffect(() => {
        // Function to get the user's shared collection of links
        const getCollectionTitle = async () => {

            try {
                const collectionTitle = doc(db, "tcollections", collectionId);
                const docSnap = await getDoc(collectionTitle);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Document data:", data);
                    // Update linkData state
                    setCollectionTitle(data.collection_title);
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            } catch (error) {
                console.error('Error getting link:', error);
            }
        };
        getCollectionTitle();
    }, [collectionTitle]);

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const Addlink = async (item) => {
        const response = await addDoc(collection(db, "tlinks"), {
            "boolImp": false,
            "collection_id": "string",
            "createDate": startOfToday,
            "note": item.note,
            "updateDate": startOfToday,
            "url": item.url,
            "user_id": userId
        });

    };
    const [showCollection, setShowCollection] = useState(false);

    const toggleCollection = () => {
        setShowCollection(!showCollection);
    };

    const AddCollection = async () => {
        if (collectionData) {
            const collectionRef = collection(db, "tcollections");
            const linksCollectionRef = collection(db, "tlinks");
            const batch = writeBatch(db);
            const collectionDocRef = doc(collectionRef);
            batch.set(collectionDocRef, {
                "collection_title": collectionTitle,
                "createDate": startOfToday,
                "updateDate": startOfToday,
                "user_id": userId
            });
            // Add links data
            collectionData.forEach((linkItem) => {
                const linkDocRef = doc(linksCollectionRef);
                batch.set(linkDocRef, {
                    "boolImp": false,
                    "collection_id": collectionDocRef.id,
                    "createDate": startOfToday,
                    "note": linkItem.note,
                    "updateDate": startOfToday,
                    "url": linkItem.url,
                    "user_id": userId
                });
            });
            try {
                // Commit the batch
                await batch.commit();
                history("../Dashboard");
            }
            catch (error) {
                console.error("Error adding collection and links", error);
            }
        }
        else {
            console.log("error");
        }

    };
    const handleDashboard = async () => {
        history("../Dashboard");
    };
    return (
        <div className="container text-center">
            <div className="mb-4 pb-4" >
                <div className="image">
                    <img src={LinkersDBlogo} style={{ height: '200px', width: 'auto' }} alt="LinkersDB Logo" />
                </div>
                <h4 className="mt-4">Shared Collection Details</h4>

                <hr style={{ width: '800px', margin: '20px auto 0px auto' }} />
                <button className="btn border" style={{ margin: '20px auto 20px auto' }} onClick={handleDashboard}>Dashboard</button>
            </div>
            <div className="w-75 mx-auto mt-4 mb-3" style={{ position: 'sticky', top: '0', zIndex: 1, backgroundColor: 'white' }}>
                <div>
                    <label className='collectionTitle mx-auto' style={{ fontWeight: 'bold', backgroundColor: 'white', textAlign: 'center' }}>
                        <h2>{collectionTitle}</h2>
                    </label>
                </div>
                <div>
                    <button onClick={toggleCollection} className="btn">{showCollection ? 'Hide Collection' : 'Show Collection'}</button>
                    <button onClick={AddCollection} className="btn">Add Collection</button>
                </div>
                <hr style={{ width: '100px', margin: '20px auto 0px auto' }} />
                <div style={{ height: '10px' }}></div>

            </div>
            {collectionData ? (
                <div className="w-75 mx-auto mt-4" style={{ position: 'relative' }}>

                    {showCollection && (
                        <div className="mb-4 pb-4" style={{ maxHeight: '400px' }}>

                            {collectionData.map((item) => (
                                <div
                                    key={item.id}
                                    className="mb-3"
                                    onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [item.id]: true }))}
                                    onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [item.id]: false }))}
                                >
                                    <hr
                                        style={{
                                            width: '100px',
                                            margin: '20px auto 30px auto',
                                            height: hoveredLinks[item.id] ? '4px' : '0px', /* Set desired thickness */
                                            backgroundColor: hoveredLinks[item.id] ? 'black' : 'black', /* Set color of the line */
                                            transition: 'height 0.3s ease' /* Add transition for height property */

                                        }} />
                                    <div style={{ width: '100%' }}>
                                        <input type="text" style={{ textAlign: 'center' }} value={item.note} readOnly className="form-control mb-3" />
                                        <div className="input-group d-flex mb-3">
                                            <input type="text" className="form-control" style={{ textAlign: 'center' }} readOnly value={item.url} disabled />
                                            <div className="input-group-append pl-5">
                                                <a
                                                    href={item.url}
                                                    className="btn btn-outline-secondary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => Addlink(item)} className="btn">Add to Your List</button>
                                    </div>
                                    <hr
                                        style={{
                                            width: '100px',
                                            margin: '20px auto 0px auto',
                                            height: hoveredLinks[item.id] ? '4px' : '0px', /* Set desired thickness */
                                            backgroundColor: hoveredLinks[item.id] ? 'black' : 'black', /* Set color of the line */
                                            transition: 'height 0.3s ease' /* Add transition for height property */

                                        }} />
                                </div>
                            ))}

                        </div>
                    )}

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>

    );
};

export default SharedCollectionPage;
