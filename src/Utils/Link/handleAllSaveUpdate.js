import { db } from "../../db/firebaseConfig";
export const handleAllSaveUpdate = (linkId, editedNote) => {
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
}