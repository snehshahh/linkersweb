import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { initializeApp } from "firebase/app";
import LinkPopup from './LinkPopup.js';  // Adjust the path based on your file structure
import { getFirestore, collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './dashboard.css'; // Import your CSS file for styling
import { useCookies } from 'react-cookie';
import { BeatLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faShare, faTrash, faPen, faCheck, faBookmark, faTimes, faPlus, faBoxOpen, faExternalLinkAlt, faFileAlt, faQuestionCircle, faClock, faListSquares, faPowerOff, faMinus, faSearch } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {

  //#region Friebase Config
  const navigate = useNavigate(); // Change 'history' to 'navigate'

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

  //#region  Variables and States
  const [links, setLinks] = useState([]);
  const [recentlinks, recentsetLinks] = useState([]);
  const [importantlinks, importntsetLinks] = useState([]);
  const [collectiontitle, setCollectiontitles] = useState([]);
  const [cookie, setCookie] = useCookies(['userId']);
  const [loadingAllLinks, setLoadingAllLinks] = useState(true);
  const [loadingImportantLinks, setLoadingImportantLinks] = useState(true);
  const [loadingRecentLinks, setLoadingRecentLinks] = useState(true);

  const [userId, setUserId] = useState('');
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [linkToAddToCollection, setLinkToAddToCollection] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [toggle, setToggle] = useState(true)

  //#endregion
  //#region Inintial-Fetch
  //UserId from Cookies
  useEffect(() => {
    const userIdCookie = cookie.userId;
    setUserId(userIdCookie)
  }, [userId]);

  const fetchData = async (userId, db, linkType, setLoading, setLinksFunction) => {
    if (userId !== undefined) {
      setLoading(true);
      var today = new Date();
      var startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      let q;

      if (linkType === 'all') {
        q = query(collection(db, "tlinks"), where("user_id", "==", userId));
      } else if (linkType === 'important') {
        q = query(collection(db, "tlinks"), where("user_id", "==", userId), where("boolImp", "==", true));
      } else if (linkType === 'recent') {
        q = query(
          collection(db, "tlinks"),
          where("user_id", "==", userId),
          where("createDate", ">=", startOfToday),
          where("createDate", "<", endOfToday),
          orderBy("createDate", "desc")
        );
      }

      try {
        const querySnapshot = await getDocs(q);
        const linksData = [];
        querySnapshot.forEach((doc) => {
          linksData.push({ id: doc.id, data: doc.data() });
        });

        setLinksFunction(linksData);
        setLoading(false);
      } catch (error) {
        alert('Error fetching links:', error);
        setLoading(false);
      }
    }
    else {
      navigate('../LoginSignUp');
    }
  };
  // Inside your component

  useEffect(() => {
    fetchData(userId, db, 'all', setLoadingAllLinks, setLinks);
    fetchData(userId, db, 'important', setLoadingImportantLinks, importntsetLinks);
    fetchData(userId, db, 'recent', setLoadingRecentLinks, recentsetLinks);
  }, [userId, db]);

  // Collection Details
  useEffect(() => {
    if (userId !== undefined) {
      const fetchCollections = async () => {
        const q = query(collection(db, "tcollections"), where("user_id", "==", userId));

        try {
          const querySnapshot = await getDocs(q);
          const collectionsData = [];
          querySnapshot.forEach((doc) => {
            collectionsData.push({ id: doc.id, data: doc.data() });
          });
          setCollections(collectionsData);
        } catch (error) {
          alert('Error fetching collections:', error);
        }
      };

      fetchCollections();
    }
  }, [userId, db]);
  //#endregion

  //#region Crud
  //#region COMPLETE DELETE
  const handleRecentDelete = async (id) => {
    try {
      // Asynchronously delete the document
      await deleteDoc(doc(db, "tlinks", id));

      // Filter out the link with the given ID
      recentlinks((prevCollections) =>
        prevCollections.filter((collection) => collection.id !== id)
      );
      links((prevCollections) =>
        prevCollections.filter((collection) => collection.id !== id)
      );

    } catch (error) {
      // Handle errors, e.g., log them or show a notification to the user
      alert("Error deleting document:", error);
    }
  };
  const handleImportantDelete = async (id) => {
    try {
      // Asynchronously delete the document
      const linkers = doc(db, "tlinks", id);

      const endOfToday = new Date();
      endOfToday.setUTCHours(0, 0, 0, 0);
      const updateLinks = async () => {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          boolImp: false,
          updateDate: endOfToday
          // Add other fields you want to update here
        });
        importntsetLinks((prevCollections) =>
          prevCollections.filter((collection) => collection.id !== id)
        );
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === id ? { ...link, data: { ...link.data, boolImp: false } } : link
          )
        );
        recentsetLinks((prevRecentLinks) =>
          prevRecentLinks.map((recentLink) =>
            recentLink.id === id ? { ...recentLink, data: { ...recentLink.data, boolImp: false } } : recentLink
          )
        );
        importntsetLinks((prevImportantLinks) =>
          prevImportantLinks.map((importantLink) =>
            importantLink.id === id
              ? { ...importantLink, data: { ...importantLink.data, boolImp: false } }
              : importantLink
          )
        );
        console.log(`Update clicked for ID: ${linkId}`);
      }
      updateLinks();

    } catch (error) {
      // Handle errors, e.g., log them or show a notification to the user
      alert("Error deleting document:", error);
    }
  };
  const handleDeleteFromAll = async (id) => {
    try {
      // Iterate over all sections
      const sections = [recentlinks, importantlinks]; // Add other sections as needed
      await deleteDoc(doc(db, "tlinks", id)); // Delete document for "recents"
      const allLinks = links.filter((link) => link.id !== id);
      setLinks(allLinks);

      for (const section of sections) {
        // Filter out the link with the given ID
        const updatedSection = section.filter((link) => link.id !== id);

        // Update state with the modified array
        if (section === recentlinks) {
          recentsetLinks(updatedSection);
        } else if (section === importantlinks) {
          importntsetLinks(updatedSection);
          // Delete document for "importantLinks" if needed
        }
      }
    } catch (error) {
      alert("Error deleting link:", error);
    }
  };
  //#endregion

  //#region COMPLETE UPDATE

  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [linkId, setLinkId] = useState(null);
  //#region Important Links Update
  const handleUpdateClick = (linkId) => {
    // Your existing logic for handling the update button click, if needed
    setLinkId(linkId);
    // Enable edit mode for the selected link
    setEditMode(true);
    // Fetch the current note value for the selected link and set it in the state
    const linkToUpdate = importantlinks.find((link) => link.id === linkId);
    setEditedNote(linkToUpdate.data.note);
  };
  //#endregion

  //#region Recent Links Update

  const handleRecentUpdateClick = (linkId) => {
    // Your existing logic for handling the update button click, if needed
    setLinkId(linkId);
    // Enable edit mode for the selected link
    setEditMode(true);
    // Fetch the current note value for the selected link and set it in the state
    const linkToUpdate = recentlinks.find((link) => link.id === linkId);
    setEditedNote(linkToUpdate.data.note);
  };

  //#endregion

  //#region All Links Update

  const handleAllUpdateClick = (linkId) => {
    // Your existing logic for handling the update button click, if needed
    setLinkId(linkId);
    // Enable edit mode for the selected link
    setEditMode(true);
    // Fetch the current note value for the selected link and set it in the state
    const linkToUpdate = links.find((link) => link.id === linkId);
    setEditedNote(linkToUpdate.data.note);
  };

  const handleAllSaveUpdate = (linkId) => {
    setEditMode(false);
    setEditedNote('');
    const linkers = doc(db, "tlinks", linkId);

    const endOfToday = new Date();
    endOfToday.setUTCHours(0, 0, 0, 0);

    const updateAllLinks = async () => {
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          note: editedNote,
          updateDate: endOfToday
          // Add other fields you want to update here
        });

        console.log(`Update clicked for ID: ${linkId}`);
      } catch (error) {
        alert('Error updating links:', error);
      }
    };

    updateAllLinks();

    // Check if the link exists in the links array
    const linkIndex = links.findIndex(link => link.id === linkId);
    if (linkIndex !== -1) {
      // Create a new array with the updated note
      const updatedLinks = [
        ...links.slice(0, linkIndex),
        {
          ...links[linkIndex],
          data: {
            ...(links[linkIndex]?.data || {}),
            note: editedNote,
          },
        },
        ...links.slice(linkIndex + 1),
      ];

      // Update state with the new array
      setLinks(updatedLinks);
    }

    // Check if the link exists in the recentlinks array
    const linkIndexforRecent = recentlinks.findIndex(link => link.id === linkId);
    if (linkIndexforRecent !== -1) {
      // Create a new array with the updated note
      const updateRecentLinks = [
        ...recentlinks.slice(0, linkIndexforRecent),
        {
          ...recentlinks[linkIndexforRecent],
          data: {
            ...(recentlinks[linkIndexforRecent]?.data || {}),
            note: editedNote,
          },
        },
        ...recentlinks.slice(linkIndexforRecent + 1),
      ];

      // Update state with the new array
      recentsetLinks(updateRecentLinks);
    }

    // Check if the link exists in the importantlinks array
    const linkIndeximportant = importantlinks.findIndex(link => link.id === linkId);
    if (linkIndeximportant !== -1) {
      // Create a new array with the updated note
      const updatedAllLinks = [
        ...importantlinks.slice(0, linkIndeximportant),
        {
          ...importantlinks[linkIndeximportant],
          data: {
            ...(importantlinks[linkIndeximportant]?.data || {}),
            note: editedNote,
          },
        },
        ...importantlinks.slice(linkIndeximportant + 1),
      ];

      // Update state with the new array
      importntsetLinks(updatedAllLinks);
    }
  };


  //#endregion

  //#endregion

  //#endregion

  //#region SettingCollection
  const handleAddToCollection = (id) => {
    setLinkToAddToCollection(id);
    setPopupOpen(true);
  };
  const handleSelectCollection = (collectionId, linkId) => {
    // Set the selected collection ID and close the popup
    setSelectedCollectionId(collectionId);
    const linkers = doc(db, "tlinks", linkId);

    const endOfToday = new Date();
    endOfToday.setUTCHours(0, 0, 0, 0);
    // Set the "capital" field of the city 'DC'
    const updateLinks = async () => {
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          collection_id: collectionId,
          updateDate: endOfToday
          // Add other fields you want to update here
        });
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === linkId ? { ...link, data: { ...link.data, collection_id: linkId } } : link
          )
        );
        recentsetLinks((prevRecentLinks) =>
          prevRecentLinks.map((recentLink) =>
            recentLink.id === linkId ? { ...recentLink, data: { ...recentLink.data, collection_id: linkId } } : recentLink
          )
        );
        importntsetLinks((prevImportantLinks) =>
          prevImportantLinks.map((importantLink) =>
            importantLink.id === linkId
              ? { ...importantLink, data: { ...importantLink.data, collection_id: linkId } }
              : importantLink
          )
        );
      } catch (error) {
        alert('Error updating links:', error);
      }
    };

    updateLinks();
    setPopupOpen(false);
  };
  const handleAddCollectionTitle = async () => {
    if (userId !== undefined && newCollectionName.trim() !== '') {
      try {
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setUTCHours(23, 59, 59, 0);

        const collectionRef = collection(db, "tcollections");
        const docRef = await addDoc(collectionRef, {
          user_id: userId,
          collection_title: newCollectionName,
          createDate: startOfToday,
          updateDate: endOfToday,
        });

        // Update state with the new collection
        setCollections([...collections, { id: docRef.id, data: { user_id: userId, collection_title: newCollectionName } }]);

        // Clear the input field
        setNewCollectionName('');
        setShowAddCollection(false);
      } catch (error) {
        alert('Error adding collection:', error);
      }
    }
  };
  const [tlinks, setTlinks] = useState([]);
  const [showLinksForCollection, setShowLinksForCollection] = useState(null);
  // Function to fetch tlinks documents for a specific collection
  const fetchTlinksForCollection = async (collectionId) => {
    setTlinks([]);
    const q = query(collection(db, "tlinks"), where("user_id", "==", userId), where("collection_id", "==", collectionId));
    try {
      const querySnapshot = await getDocs(q);
      console.log('Query Snapshot:', querySnapshot);
      const linksData = [];
      querySnapshot.forEach((doc) => {
        linksData.push({ id: doc.id, data: doc.data() });
      });
      setTlinks(linksData);
    } catch (error) {
      alert('Error fetching links:', error);
    }
  };

  // Function to handle showing links for a specific collection
  const handleShowLinks = (collectionId) => {
    setShowLinksForCollection((prev) => (prev === collectionId ? null : collectionId));
    fetchTlinksForCollection(collectionId);
  };


  const handleRemoveFromCollection = (linkId, collectionId) => {
    const linkers = doc(db, "tlinks", linkId);

    const endOfToday = new Date();
    endOfToday.setUTCHours(0, 0, 0, 0);
    const updateLinks = async () => {
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          collection_id: null
        });
        // Check if there are no links left in the collection
        const linksInCollection = await getDocs(
          query(collection(db, "tlinks"), where("collection_id", "==", collectionId))
        );

        if (linksInCollection.empty) {

          // If no links left, delete the collection
          await deleteDoc(doc(db, "tcollections", collectionId));
          setCollections((prevCollections) =>
            prevCollections.filter((collection) => collection.id !== collectionId)
          );
          setShowLinksForCollection(null);
        }
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === linkId ? { ...link, data: { ...link.data, collection_id: null } } : link
          )
        );
        setTlinks((prevLinks) =>
          prevLinks.filter((link) => link.id !== linkId)
        );
        recentsetLinks((prevRecentLinks) =>
          prevRecentLinks.map((recentLink) =>
            recentLink.id === linkId ? { ...recentLink, data: { ...recentLink.data, collection_id: null } } : recentLink
          )
        );
        importntsetLinks((prevImportantLinks) =>
          prevImportantLinks.map((importantLink) =>
            importantLink.id === linkId
              ? { ...importantLink, data: { ...importantLink.data, collection_id: null } }
              : importantLink
          )
        );
        console.log(`Update clicked for ID: ${linkId}`);
      } catch (error) {
        alert('Error updating links:', error);
      }
    };
    updateLinks();
  }

  const handleDeleteCollection = async (id) => {
    try {
      // Asynchronously delete the document
      await deleteDoc(doc(db, "tcollections", id));
      // Filter out the link with the given ID
      const updatedCollection = collections.filter((link) => link.id !== id);
      setCollections(updatedCollection);

    } catch (error) {
      // Handle errors, e.g., log them or show a notification to the user
      alert("Error deleting document:", error);
    }
  };


  // Assume you have a state variable to track the edited title and the currently edited collection ID
  const [editedCollectionTitle, setEditedCollectionTitle] = useState('');
  const [editingCollectionId, setEditingCollectionId] = useState(null);

  // ...

  const handlEditCollectionClick = (collectionId) => {
    // Find the collection in the array based on the collection ID
    const collectionToEdit = collections.find(collection => collection.id === collectionId);

    // Set the initial value of the edited title and the editingCollectionId state
    setEditedCollectionTitle(collectionToEdit.data.collection_title);
    setEditingCollectionId(collectionId);
  };

  const handleUpdateCollectionTitle = (collectionId) => {
    // Find the collection in the array based on the collection ID
    const collectionToUpdate = collections.find(collection => collection.id === collectionId);

    // Update the title of the collection with the edited title
    collectionToUpdate.data.collection_title = editedCollectionTitle;
    const linkers = doc(db, "tcollections", collectionId);

    const updatetitle = async () => {
      const endOfToday = new Date();
      endOfToday.setUTCHours(23, 59, 59, 0);
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          collection_title: editedCollectionTitle,
          updateDate: endOfToday
          // Add other fields you want to update here
        });

        console.log(`Update clicked for ID: ${linkId}`);
      } catch (error) {
        alert('Error updating links:', error);
      }

    };
    updatetitle();

    // Update the state with the modified collections array
    setCollections([...collections]);
    // Reset the editing state
    setEditedCollectionTitle('');
    setEditingCollectionId(null);
  };
  //#endregion

  //#region Common Functionalities
  const [showAddCollection, setShowAddCollection] = useState(false);

  const toggleImportant = (id) => {
    const linkers = doc(db, "tlinks", id);

    const endOfToday = new Date();
    endOfToday.setUTCHours(0, 0, 0, 0);
    const updateLinks = async () => {
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          boolImp: true
        });
        if (userId !== undefined) {
          const fetchimportantLinks = async () => {
            const q = query(collection(db, "tlinks"), where("user_id", "==", userId), where("boolImp", "==", true));

            try {
              const querySnapshot = await getDocs(q);
              console.log('Query Snapshot:', querySnapshot);
              const implinksData = [];
              querySnapshot.forEach((doc) => {
                implinksData.push({ id: doc.id, data: doc.data() });
              });
              importntsetLinks(implinksData);
            } catch (error) {
              alert('Error fetching links:', error);
            }
          };

          fetchimportantLinks();
        }
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === id ? { ...link, data: { ...link.data, boolImp: true } } : link
          )
        );
        recentsetLinks((prevRecentLinks) =>
          prevRecentLinks.map((recentLink) =>
            recentLink.id === id ? { ...recentLink, data: { ...recentLink.data, boolImp: true } } : recentLink
          )
        );
        importntsetLinks((prevImportantLinks) => {
          console.log('Previous State:', prevImportantLinks);
          const updatedLinks = prevImportantLinks.map((importantLink) =>
            importantLink.id === id
              ? { ...importantLink, data: { ...importantLink.data, boolImp: true } }
              : importantLink
          );
          console.log('Updated State:', updatedLinks);
          fetchData(userId, db, 'important', setLoadingImportantLinks, importntsetLinks);

          return updatedLinks;
        });

        console.log(`Update clicked for ID: ${linkId}`);
      } catch (error) {
        alert('Error updating links:', error);
      }
    };
    const fetchimportantLinks = async () => {
      const q = query(collection(db, "tlinks"), where("user_id", "==", userId), where("boolImp", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        console.log('Query Snapshot:', querySnapshot);
        const implinksData = [];
        querySnapshot.forEach((doc) => {
          implinksData.push({ id: doc.id, data: doc.data() });
        });
        importntsetLinks(implinksData);
      } catch (error) {
        alert('Error fetching links:', error);
      }
    };

    updateLinks();
    fetchimportantLinks();

  };
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLinks, setHoveredLinks] = useState({});

  const copyToClipboard = (text) => {
    // Create a temporary textarea to copy text to clipboard
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert("Copied To Clipboard!");
    // Optionally, you can provide user feedback or notifications about the successful copy
  };

  const [selectedTab, setSelectedTab] = useState('tab1');
  const handleTabClick = (tab) => {
    if (tab === 'tab4') {
      setShowLinksForCollection(null);
      setSelectedTab(tab);
    }
    else {
      setSelectedTab(tab);
    }
  };
  const [isSearchRecentVisible, setIsSearchRecentVisible] = useState(false);
  const [isSearchInportantVisible, setIsSearchImportantVisible] = useState(false);
  const [isSearchAllVisible, setIsSearchAllVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRecentlink, setSearchRecentLink] = useState('');
  const [searchImplink, setImpSearchLink] = useState('');

  // Function to filter links based on the search query
  const filteredLinks = links.filter((link) =>
    link.data.note.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRecentLinks = recentlinks.filter((link) =>
    link.data.note.toLowerCase().includes(searchRecentlink.toLowerCase())
  );
  const filteredImportant = importantlinks.filter((link) =>
    link.data.note.toLowerCase().includes(searchImplink.toLowerCase())
  );
  const toggleSearchVisibility = () => {
    setIsSearchRecentVisible(!isSearchRecentVisible);
  };
  const handleLogOut = () => {
    localStorage.setItem('userId', '');
    navigate('../LoginSignUp')
  };
  //#endregion
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');

  const handleSave = async () => {
    const startOfToday = new Date();
    const response = await addDoc(collection(db, "tlinks"), {
      "boolImp": false,
      "collection_id": null,
      "createDate": startOfToday,
      "note": note,
      "updateDate": startOfToday,
      "url": url,
      "user_id": userId
    });
    if (response.id) {
      console.log("Added Manually");
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-container">
      <div className='col-md-12' style={{ margin: '0px auto 0px auto' }}>
        <div className='button-container'>
          <div></div>
          <div>
            <button className="btn mb-3 pr-5 mr-5" onClick={handleLogOut}>
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>
          <div></div>
        </div>
      </div>
      <div className='col-md-12' style={{ margin: '0px auto 20px auto' }}>
        <div className='button-container'>
          <div></div>
          <div>
            <Popup
              trigger={
                <button className={`btn`}>
                  Add a link
                </button>
              }
              modal
              nested
            >
              {(close) => (
                <div className="link-popup text-align-center" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px' }}>
                  <h3>Add URL and Notes</h3>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <input
                        type="text"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="form-control mb-2"
                      />
                      <textarea
                        placeholder="Notes"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="form-control mb-2"
                      ></textarea>
                      <div className="text-center">
                        <button className="btn" onClick={handleSave}>Save</button>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center mt-3">
                    <div className="col-md-8 text-center">
                      <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} /></button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div></div>
        </div>
      </div>

      <nav>
        <ul className="nav nav-tabs tab-list">
          <li
            className={`nav-item tab-item ${selectedTab === 'tab1' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab1')}
          >
            
            <FontAwesomeIcon icon={faClock} className="rec nav-link" style={{ color: 'black', height: '18px',paddingLeft:'32px',paddingTop:'11px' }} />
          </li>
          <li
            className={`nav-item tab-item ${selectedTab === 'tab2' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab2')}
          >
            <FontAwesomeIcon icon={faExclamation} className="imp" style={{ color: 'black',height: '19px',paddingLeft:'38px',paddingTop:'11px'}} />
          </li>
          <li
            className={`nav-item tab-item ${selectedTab === 'tab3' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab3')}
          >
            <FontAwesomeIcon icon={faListSquares} className="all nav-link" style={{ color: 'black',paddingLeft:'32px',paddingTop:'11px' }} />
          </li>
          <li
            className={`nav-item tab-item ${selectedTab === 'tab4' ? 'active' : ''}`}
            onClick={() => handleTabClick('tab4')}
          >
            <FontAwesomeIcon icon={faBookmark} className="coll nav-link" style={{ color: 'black',paddingLeft:'35px',paddingTop:'11px' }} />
          </li>
        </ul>

      </nav>

      <div className="tab-content mt-3">
        <div className={`tab-content ${selectedTab === 'tab1' ? 'fade-in' : 'fade-out'}`}>
          {selectedTab === 'tab1' && (
            <div>
              <div className="d-flex">
                <div>
                  <p className="tab-titles">Recents</p>
                </div>
                <div>
                  <button className="btn mb-3 pr-4 mr-4" onClick={toggleSearchVisibility} style={{ marginLeft: '-30px', marginBottom: '10px' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div></div>
                <div style={{ margin: '0px' }} className={`col-md-9 search-container ${isSearchRecentVisible ? 'show' : 'hide'}`}>
                  <input
                    type="text"
                    className="form-control mb-3 navigation-input"
                    placeholder="Search by note"
                    value={searchRecentlink}
                    onChange={(e) => setSearchRecentLink(e.target.value)}
                  />
                </div>
                <div></div>

              </div>
              <div style={{
                marginTop: isSearchRecentVisible ? '0' : '-80px',
                transition: 'margin-top 0.3s ease-in-out' // Transition duration set to 0.5 seconds
              }}>
                {searchRecentlink === '' ? (
                  // If there's no search query, render all links
                  recentlinks.length > 0 ? (
                    recentlinks.map((link) => (
                      <div
                        key={link.id}
                        className="mb-3"
                        onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: true }))}
                        onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: false }))}
                      >
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />

                        {editMode && link.id === linkId ? (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="mb-2">
                            <input type="text" className="form-control mb-3" value={link.data.note} readOnly />
                          </div>
                        )}
                        <div className="input-group d-flex mb-3">
                          <input type="text" className="form-control" value={link.data.url} readOnly />
                          <div className="input-group-append pl-5">
                            <a
                              href={link.data.url}
                              className="btn btn-outline-secondary "
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                            </a>
                          </div>
                        </div>
                        <div className="button-container">
                          <div></div> {/* Added wrapper div */}
                          <div>

                            <button className="btn  me-2" title="Delete" onClick={() => handleDeleteFromAll(link.id)}>
                              <FontAwesomeIcon icon={faTrash} />

                            </button>
                            <button className="btn me-2" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            <button className="btn me-2" title="Edit" onClick={() => handleRecentUpdateClick(link.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            {link.data.collection_id != null ? (
                              <button
                                className="btn"
                                onClick={() => handleRemoveFromCollection(link.id, link.data.collection_id)}
                                title="Remove From Collection"
                              >    <FontAwesomeIcon icon={faBookmark} title="Remove From Collection" style={{ color: 'green' }} />
                              </button>
                            ) : (
                              <Popup trigger={
                                <button className={`btn`} onClick={(e) => e.preventDefault()}>
                                  <FontAwesomeIcon icon={faBookmark} title="Save To Collections" style={{ color: '' }} />
                                </button>
                              } modal>
                                {(close) => (
                                  <div className="link-popup">
                                    <h3>Select a Collection</h3>
                                    <ul className="list-unstyled">
                                      {collections.map((collection) => (
                                        <li key={collection.id} className="m-2">
                                          <button
                                            className="btn btn-outline"
                                            onClick={() => {
                                              handleAddToCollection(link.id);
                                              handleSelectCollection(collection.id, link.id);
                                              close(); // Close the popup after selecting a collection
                                            }}
                                            onMouseEnter={(e) => e.target.classList.add('border-black')}
                                            onMouseLeave={(e) => e.target.classList.remove('border-black')}
                                          >
                                            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                                              {collection.data.collection_title}
                                            </a>
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="row justify-content-center mt-3">
                                      <div className="col-md-8 text-center">
                                        <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>

                            )}
                            {editMode && link.id === linkId && (
                              <button className="btn" onClick={() => handleAllSaveUpdate(link.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div> {/* Added wrapper div */}
                        </div>
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />                    </div>

                    ))
                  ) : (
                    <div className="container mt-5">
                      <div className="row justify-content-center">
                        <div className="text-muted d-flex  align-items-center">
                          <h5 className="mt-3">No Recent Links</h5> &nbsp;&nbsp;&nbsp;&nbsp;
                          <FontAwesomeIcon icon={faBoxOpen} style={{ color: 'black', fontSize: '1.2rem' }} className='mt-2' />
                        </div>
                      </div>
                    </div>)

                ) : (
                  // If there is a search query, render only filtered links
                  filteredRecentLinks.length > 0 ? (
                    filteredRecentLinks.map((link) => (
                      <div
                        key={link.id}
                        className="mb-3"
                        onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: true }))}
                        onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: false }))}
                      >
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />

                        {editMode && link.id === linkId ? (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input type="text" className="form-control" value={link.data.note} readOnly />
                          </div>
                        )}
                        <div className="input-group d-flex mb-3">
                          <input type="text" className="form-control" value={link.data.url} readOnly />
                          <div className="input-group-append pl-5">
                            <a
                              href={link.data.url}
                              className="btn btn-outline-secondary "
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                            </a>
                          </div>
                        </div>
                        <div className="button-container">
                          <div></div>
                          <div>
                            <button className="btn  me-2" title="Delete" onClick={() => handleRecentDelete(link.id)}>
                              <FontAwesomeIcon icon={faTrash} />

                            </button>
                            <button className="btn me-2" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            <button className="btn me-2" title="Edit" onClick={() => handleRecentUpdateClick(link.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            {link.data.collection_id != null ? (
                              <button
                                className="btn"
                                onClick={() => handleRemoveFromCollection(link.id, link.data.collection_id)}
                                title="Remove From Collection"
                              >    <FontAwesomeIcon icon={faBookmark} title="Remove From Collection" style={{ color: 'green' }} />
                              </button>
                            ) : (
                              <Popup trigger={
                                <button className={`btn`} onClick={(e) => e.preventDefault()}>
                                  <FontAwesomeIcon icon={faBookmark} title="Save To Collections" style={{ color: '' }} />
                                </button>
                              } modal>
                                {(close) => (
                                  <div className="link-popup">
                                    <h3>Select a Collection</h3>
                                    <ul className="list-unstyled">
                                      {collections.map((collection) => (
                                        <li key={collection.id} className="m-2">
                                          <button
                                            className="btn btn-outline"
                                            style={{ textAlign: 'center' }}
                                            onClick={() => {
                                              handleAddToCollection(link.id);
                                              handleSelectCollection(collection.id, link.id);
                                              close(); // Close the popup after selecting a collection
                                            }}
                                            onMouseEnter={(e) => e.target.classList.add('border-black')}
                                            onMouseLeave={(e) => e.target.classList.remove('border-black')}
                                          >
                                            {collection.data.collection_title}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="row justify-content-center mt-3">
                                      <div className="col-md-8 text-center">
                                        <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            )}
                            {editMode && link.id === linkId && (
                              <button className="btn" onClick={() => handleAllSaveUpdate(link.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div>

                        </div>
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">Data not found.</div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div className={`tab-content ${selectedTab === 'tab2' ? 'fade-in' : 'fade-out'}`}>
          {selectedTab === 'tab2' && (
            <div>
              <div className="d-flex">
                <div>
                  <p className="tab-titles">Importants</p>
                </div>
                <div>
                  <button className="btn mb-3" onClick={toggleSearchVisibility}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div></div>

                <div style={{ margin: '0px' }} className={`col-md-9 search-container ${isSearchRecentVisible ? 'show' : 'hide'}`}>
                  <input
                    type="text"
                    className="form-control mb-3 navigation-input" // Add a class for styling
                    placeholder="Search by note"
                    value={searchImplink}
                    onChange={(e) => setImpSearchLink(e.target.value)}
                  />
                </div>
                <div></div>

              </div>
              <div style={{
                marginTop: isSearchRecentVisible ? '0' : '-80px',
                transition: 'margin-top 0.3s ease-in-out' // Transition duration set to 0.5 seconds
              }}>
                {searchImplink === '' ? (
                  // If there's no search query, render all links
                  importantlinks.length > 0 ? (
                    importantlinks.map((link) => (
                      <div
                        key={link.id}
                        className="mb-3 overflow-hidden"
                        onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: true }))}
                        onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: false }))}
                      >
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                        {editMode && link.id === linkId ? (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="mb-2">
                            <input type="text" className="form-control" value={link.data.note} readOnly />
                          </div>
                        )}
                        <div>
                          <div className="input-group d-flex mb-3">
                            <input type="text" className="form-control" value={link.data.url} readOnly />
                            <div className="input-group-append pl-5">
                              <a
                                href={link.data.url}
                                className="btn btn-outline-secondary "
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="button-container">
                          <div></div> {/* Added wrapper div */}
                          <div>
                            <button className="btn me-2" title="Remove From Importants" onClick={() => handleImportantDelete(link.id)}>
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <button className="btn  me-2" title="Edit note" onClick={() => handleUpdateClick(link.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button className="btn me-2" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            {link.data.collection_id != null ? (
                              <button
                                className="btn"
                                onClick={() => handleRemoveFromCollection(link.id, link.data.collection_id)}
                                title="Remove From Collection"
                              >    <FontAwesomeIcon icon={faBookmark} title="Remove From Collection" style={{ color: 'green' }} />
                              </button>
                            ) : (
                              <Popup trigger={
                                <button className={`btn`} onClick={(e) => e.preventDefault()}>
                                  <FontAwesomeIcon icon={faBookmark} title="Save To Collections" style={{ color: '' }} />
                                </button>
                              } modal>
                                {(close) => (
                                  <div className="link-popup">
                                    <h3>Select a Collection</h3>
                                    <ul className="list-unstyled">
                                      {collections.map((collection) => (
                                        <li key={collection.id} className="m-2">
                                          <button
                                            className="btn btn-outline"
                                            style={{ textAlign: 'center' }}
                                            onClick={() => {
                                              handleAddToCollection(link.id);
                                              handleSelectCollection(collection.id, link.id);
                                              close(); // Close the popup after selecting a collection
                                            }}
                                            onMouseEnter={(e) => e.target.classList.add('border-black')}
                                            onMouseLeave={(e) => e.target.classList.remove('border-black')}
                                          >
                                            {collection.data.collection_title}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="row justify-content-center mt-3">
                                      <div className="col-md-8 text-center">
                                        <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            )}
                            {editMode && link.id === linkId && (
                              <button className="btn" title="Save Changes" onClick={() => handleAllSaveUpdate(link.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div> {/* Added wrapper div */}

                        </div>
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                      </div>
                    ))
                  ) : (
                    <div className="container mt-5">
                      <div className="row justify-content-center">
                        <div className="text-muted d-flex  align-items-center">
                          <h5 className="mt-3">No Important Links</h5> &nbsp;&nbsp;&nbsp;&nbsp;
                          <FontAwesomeIcon icon={faBoxOpen} style={{ color: 'black', fontSize: '1.2rem' }} className='mt-2' />
                        </div>
                      </div>
                    </div>
                  )

                ) : (
                  filteredImportant.length > 0 ? (
                    filteredImportant.map((link) => (
                      <div
                        key={link.id}
                        className="mb-3"
                        onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: true }))}
                        onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: false }))}
                      >
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 10px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                        {editMode && link.id === linkId ? (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input type="text" className="form-control" value={link.data.note} readOnly />
                          </div>
                        )}
                        <div className="input-group d-flex mb-3">
                          <input type="text" className="form-control" value={link.data.url} readOnly />
                          <div className="input-group-append pl-5">
                            <a
                              href={link.data.url}
                              className="btn btn-outline-secondary "
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                            </a>
                          </div>
                        </div>
                        <div className="button-container">
                          <div></div> {/* Added wrapper div */}
                          <div>
                            <button className="btn me-2" title="Remove From Importants" onClick={() => handleImportantDelete(link.id)}>
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <button className="btn  me-2" title="Edit note" onClick={() => handleUpdateClick(link.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button className="btn me-2" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            <Popup trigger={
                              <button className={`btn`} onClick={(e) => e.preventDefault()}>
                                <FontAwesomeIcon icon={faBookmark} title="Save To Collections" style={{ color: '' }} />
                              </button>
                            } modal>
                              {(close) => (
                                <div className="link-popup">
                                  <h3>Select a Collection</h3>
                                  <ul className="list-unstyled">
                                    {collections.map((collection) => (
                                      <li key={collection.id} className="m-2">
                                        <button
                                          className="btn btn-outline"
                                          style={{ textAlign: 'center' }}
                                          onClick={() => {
                                            handleAddToCollection(link.id);
                                            handleSelectCollection(collection.id, link.id);
                                            close(); // Close the popup after selecting a collection
                                          }}
                                          onMouseEnter={(e) => e.target.classList.add('border-black')}
                                          onMouseLeave={(e) => e.target.classList.remove('border-black')}
                                        >
                                          {collection.data.collection_title}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="row justify-content-center mt-3">
                                    <div className="col-md-8 text-center">
                                      <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Popup>
                            {editMode && link.id === linkId && (
                              <button className="btn" title="Save Changes" onClick={() => handleAllSaveUpdate(link.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div> {/* Added wrapper div */}

                        </div>
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 10px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">Data not found.</div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div className={`tab-content ${selectedTab === 'tab3' ? 'fade-in' : 'fade-out'}`}>
          {selectedTab === 'tab3' && (
            <div>
              <div className="d-flex" style={{ position: 'sticky', top: '0', zIndex: 1, backgroundColor: 'white' }}>
                <div>
                  <p className="tab-titles" style={{ marginRight: '-65px' }}>ALL</p>
                </div>
                <div>
                  <button className="btn mb-3" onClick={toggleSearchVisibility} style={{ paddingRight: '10px' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div></div>
                <div style={{ margin: '0px', paddingBottom: '7px' }} className={`col-md-9 search-container ${isSearchRecentVisible ? 'show' : 'hide'}`}>
                  <input
                    type="text"
                    className="form-control mb-3 " // Add a class for styling
                    placeholder="Search by note"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                </div>
                <div></div>

              </div>
              <div style={{
                marginTop: isSearchRecentVisible ? '0' : '-80px',
                transition: 'margin-top 0.3s ease-in-out'
              }}>
                {searchQuery === '' ? (
                  // If there's no search query, render all links
                  recentlinks.length > 0 ? (
                    links.map((link) => (
                      <div
                        key={link.id}
                        className="mb-3"
                        onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: true }))}
                        onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: false }))}
                      >
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                        {editMode && link.id === linkId ? (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="mb-2">
                            <input type="text" style={{ textAlign: 'center' }} value={link.data.note} readOnly className="form-control" />
                          </div>
                        )}
                        <div>
                          <div className="input-group d-flex mb-3">
                            <input type="text" style={{ textAlign: 'center' }} className="form-control" value={link.data.url} readOnly />
                            <div className="input-group-append pl-5">
                              <a
                                href={link.data.url}
                                className="btn btn-outline-secondary "
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="button-container">
                          <div></div> {/* Added wrapper div */}
                          <div>
                            <button className="btn me-2" title="Delete Links" onClick={() => handleDeleteFromAll(link.id)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button className="btn me-2" title="Edit Note" onClick={() => handleAllUpdateClick(link.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            {link.data.boolImp != false ? (
                              <button className={`btn me-2`} title="Remove From Importants" onClick={() => handleImportantDelete(link.id)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            ) : (
                              <button className={`btn me-2`} title="Add To Importants" onClick={() => toggleImportant(link.id)}>
                                <FontAwesomeIcon icon={faExclamation} />
                              </button>
                            )}
                            <button className="btn me-2" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            {link.data.collection_id != null ? (
                              <button
                                className="btn"
                                onClick={() => handleRemoveFromCollection(link.id, link.data.collection_id)}
                                title="Remove From Collection"
                              >    <FontAwesomeIcon icon={faBookmark} title="Remove From Collection" style={{ color: 'green' }} />
                              </button>
                            ) : (
                              <Popup trigger={
                                <button className={`btn`} onClick={(e) => e.preventDefault()}>
                                  <FontAwesomeIcon icon={faBookmark} title="Save To Collections" style={{ color: '' }} />
                                </button>
                              } modal>
                                {(close) => (
                                  <div className="link-popup">
                                    <h3>Select a Collection</h3>
                                    <ul className="list-unstyled">
                                      {collections.map((collection) => (
                                        <li key={collection.id} className="m-2">
                                          <button
                                            className="btn btn-outline"
                                            style={{ textAlign: 'center' }}
                                            onClick={() => {
                                              handleAddToCollection(link.id);
                                              handleSelectCollection(collection.id, link.id);
                                              close(); // Close the popup after selecting a collection
                                            }}
                                            onMouseEnter={(e) => e.target.classList.add('border-black')}
                                            onMouseLeave={(e) => e.target.classList.remove('border-black')}
                                          >
                                            {collection.data.collection_title}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="row justify-content-center mt-3">
                                      <div className="col-md-8 text-center">
                                        <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            )}
                            {editMode && link.id === linkId && (
                              <button className="btn" onClick={() => handleAllSaveUpdate(link.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div> {/* Added wrapper div */}

                        </div>
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 30px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />

                      </div>
                    ))
                  ) : (
                    <div className="container mt-5">
                      <div className="row justify-content-center">
                        <div className="text-muted d-flex  align-items-center">
                          <h5 className="mt-3">No Links Found</h5>&nbsp;&nbsp;
                          <FontAwesomeIcon icon={faBoxOpen} style={{ color: 'black', fontSize: '1.2rem' }} className='mt-2' />

                        </div>
                        <div className="text-muted d-flex  align-items-center">
                          <h5 className="mt-3">Start Managing Your Links With Linker's Web</h5>
                        </div>
                      </div>
                    </div>
                  )

                ) : (
                  filteredLinks.length > 0 ? (
                    filteredLinks.map((link) => (
                      <div
                        key={link.id}
                        className="mb-3"
                        onMouseEnter={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: true }))}
                        onMouseLeave={() => setHoveredLinks(prevState => ({ ...prevState, [link.id]: false }))}
                      >
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 10px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                        {editMode && link.id === linkId ? (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input
                              type="text"
                              className="form-control"
                              value={editedNote}
                              onChange={(e) => setEditedNote(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="mb-2">
                            <label className="form-label"></label>
                            <input type="text" className="form-control" value={link.data.note} readOnly />
                          </div>
                        )}
                        <div className="input-group d-flex mb-3">
                          <input type="text" className="form-control" value={link.data.url} readOnly />
                          <div className="input-group-append pl-5">
                            <a
                              href={link.data.url}
                              className="btn btn-outline-secondary "
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                            </a>
                          </div>
                        </div>
                        <div className="button-container">
                          <div></div> {/* Added wrapper div */}
                          <div>
                            <button className="btn me-2" title="Delete Links" onClick={() => handleDeleteFromAll(link.id)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button className="btn me-2" title="Edit Note" onClick={() => handleAllUpdateClick(link.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            {link.data.boolImp != false ? (
                              <button className={`btn me-2`} title="Remove From Importants" onClick={() => handleImportantDelete(link.id)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            ) : (
                              <button className={`btn me-2`} title="Add To Importants" onClick={() => toggleImportant(link.id)}>
                                <FontAwesomeIcon icon={faExclamation} />
                              </button>
                            )}
                            <button className="btn me-2" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            {link.data.collection_id != null ? (
                              <button
                                className="btn"
                                onClick={() => handleRemoveFromCollection(link.id, link.data.collection_id)}
                                title="Remove From Collection"
                              >    <FontAwesomeIcon icon={faBookmark} title="Remove From Collection" style={{ color: 'green' }} />
                              </button>
                            ) : (
                              <Popup trigger={
                                <button className={`btn`} onClick={(e) => e.preventDefault()}>
                                  <FontAwesomeIcon icon={faBookmark} title="Save To Collections" style={{ color: '' }} />
                                </button>
                              } modal>
                                {(close) => (
                                  <div className="link-popup">
                                    <h3>Select a Collection</h3>
                                    <ul className="list-unstyled">
                                      {collections.map((collection) => (
                                        <li key={collection.id} className="m-2">
                                          <button
                                            className="btn btn-outline"
                                            style={{ textAlign: 'center' }}
                                            onClick={() => {
                                              handleAddToCollection(link.id);
                                              handleSelectCollection(collection.id, link.id);
                                              close(); // Close the popup after selecting a collection
                                            }}
                                            onMouseEnter={(e) => e.target.classList.add('border-black')}
                                            onMouseLeave={(e) => e.target.classList.remove('border-black')}
                                          >
                                            {collection.data.collection_title}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="row justify-content-center mt-3">
                                      <div className="col-md-8 text-center">
                                        <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Popup>
                            )}
                            {editMode && link.id === linkId && (
                              <button className="btn" onClick={() => handleAllSaveUpdate(link.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div> {/* Added wrapper div */}

                        </div>
                        <hr
                          style={{
                            width: '100px',
                            margin: '20px auto 10px auto',
                            height: hoveredLinks[link.id] ? '4px' : '0px', /* Set desired thickness */
                            backgroundColor: hoveredLinks[link.id] ? 'black' : 'black', /* Set color of the line */
                            transition: 'height 0.3s ease' /* Add transition for height property */

                          }} />
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">Data not found.</div>
                  )
                )}
              </div>

            </div>
          )}
        </div>
        <div className={`tab-content ${selectedTab === 'tab4' ? 'fade-in' : 'fade-out'}`}>
          {selectedTab === 'tab4' && (
            <div>
              <div className="d-flex justify-content-center">
                <div className="text-center">
                  <p className="tab-titles">Collections</p>
                </div>
                <div>
                  <button
                    className="btn me-2 mb-3"
                    onClick={() => setShowAddCollection(!showAddCollection)}
                  >
                    {showAddCollection ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                  </button>
                </div>
              </div>

              <div className={`tab-content ${showAddCollection ? 'fade-in' : 'fade-out'}`}>
                {showAddCollection && (
                  <div className="mb-3 d-flex justify-content-between">
                    <div></div>
                    <div className='d-flex'>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New Collection's Name"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                      />
                      <button
                        className="btn"
                        onClick={handleAddCollectionTitle}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <div></div>
                  </div>
                )}
              </div>

              {
                collections.length > 0 ? (
                  collections.map((collection) => (
                    <div key={collection.id} className="mb-3">
                      {/* Collection Title */}
                      <div className='showflex d-flex'>
                        <div className="col-md-9 mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={collection.data.collection_title}
                            readOnly
                          />
                        </div>
                        {/* Button to Show/Hide Links */}
                        <div>
                          <button
                            className="btn mb-2 ml-2"
                            onClick={() => handleShowLinks(collection.id)}
                          >
                            {showLinksForCollection === collection.id ? 'Close' : 'Show'}
                          </button>
                        </div>
                      </div>
                      {/* Buttons for Editing, Deleting, and Sharing Collection */}
                      <div className='d-flex justify-content-between'>
                        <div></div>
                        <div className='button-container'>
                          <div></div>
                          <div>
                            <button className="btn" onClick={() => handlEditCollectionClick(collection.id)}>
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button
                              className="btn" title="Delete Collection"
                              onClick={() => handleDeleteCollection(collection.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button className="btn" title="Share Collection" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedCollectionPage/${collection.id}`)}>
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                            {editingCollectionId === collection.id && (
                              // Render the "Check" button only when in edit mode
                              <button
                                className="btn  me-2"
                                onClick={() => handleUpdateCollectionTitle(collection.id)}
                                title="Save Changes"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            )}
                          </div>
                          <div></div>
                        </div>
                        <div></div>
                      </div>
                      <div className={`tab-content ${showLinksForCollection === collection.id ? 'fade-in' : 'fade-out'}`}>
                        {showLinksForCollection === collection.id && (
                          <div>
                            {tlinks.length > 0 ? (
                              tlinks.map((link) => (
                                <div key={link.id} className="mb-2">
                                  <div className="mb-2">
                                    <label className="form-label"></label>
                                    <input type="text" className="form-control" value={link.data.note} readOnly />
                                  </div>
                                  <div className="input-group d-flex mb-3">
                                    <input type="text" className="form-control" value={link.data.url} readOnly />
                                    <div className="input-group-append pl-5">
                                      <a
                                        href={link.data.url}
                                        className="btn btn-outline-secondary "
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: 'black' }} />
                                      </a>
                                    </div>
                                  </div>
                                  <div className='button-container'>
                                    <div></div>
                                    <div>
                                      <button
                                        className="btn"
                                        onClick={() => handleRemoveFromCollection(link.id, collection.id)}
                                        title="Remove From Collection"
                                      >
                                        <FontAwesomeIcon icon={faTimes} />
                                      </button>
                                      <button className="btn" title="Share Link" onClick={() => copyToClipboard(`https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`)}>
                                        <FontAwesomeIcon icon={faShare} />
                                      </button>
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="container">
                                <div className="row justify-content-center">
                                  <div className="text-muted d-flex align-items-center">
                                    <h5 className="mb-5">No Links in the collection.</h5> &nbsp;&nbsp;&nbsp;&nbsp;
                                  </div>
                                </div>
                              </div>)}

                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="container mt-5">
                    <div className="row justify-content-center">
                      <div className="text-muted d-flex align-items-center">
                        <h5 className="mt-3">No Collections</h5> &nbsp;&nbsp;&nbsp;&nbsp;
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
