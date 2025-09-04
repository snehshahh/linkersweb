import { db, collection } from "../../db/firebaseConfig";
import { setShowLinksForCollection } from "../../features/Link/ShowLinksForCollectionSlice";
import { useDispatch } from "react-redux";


export function useHandleRemoveFromCollection(){
  const dispatch  = useDispatch();

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
            setShowLinksForCollection(null);
          }
          console.log(`Update clicked for ID: ${linkId}`);
        } catch (error) {
          alert('Error updating links:', error);
        }
      };
      updateLinks();
    }
    return handleRemoveFromCollection;
  }