const addToImportant = (id) => {
    const linkers = doc(db, "tlinks", id);

    const endOfToday = new Date();
    endOfToday.setUTCHours(0, 0, 0, 0);
    const updateLinks = async () => {
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(linkers, {
          boolImp: true
        });
        

        console.log(`Update clicked for ID: ${linkId}`);
      } catch (error) {
        alert('Error updating links:', error);
      }
    };

    updateLinks();

  };