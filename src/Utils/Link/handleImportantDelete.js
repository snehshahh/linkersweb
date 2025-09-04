import { db } from "../../db/firebaseConfig";
export const handleImportantDelete = async (id) => {
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
      }
      updateLinks();

    } catch (error) {
      // Handle errors, e.g., log them or show a notification to the user
      alert("Error deleting document:", error);
    }
  };