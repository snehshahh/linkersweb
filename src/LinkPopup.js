import React from 'react';
import './LinkPopup.css'; 

const LinkPopup = ({ collections, onSelectCollection, onClose }) => {
  return (
    <div className="link-popup">
      <h3>Select a Collection</h3>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id} onClick={() => onSelectCollection(collection.id)}>
            {collection.data.collection_title}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LinkPopup;
