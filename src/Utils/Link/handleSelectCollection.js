export function  useHandleSelectCollection (){
    const handleSelectCollection = (collectionId, linkId) => {
        // Set the selected collection ID and close the popup
        // setSelectedCollectionId(collectionId);
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
            // setLinks((prevLinks) =>
            //   prevLinks.map((link) =>
            //     link.id === linkId ? { ...link, data: { ...link.data, collection_id: linkId } } : link
            //   )
            // );
            // recentsetLinks((prevRecentLinks) =>
            //   prevRecentLinks.map((recentLink) =>
            //     recentLink.id === linkId ? { ...recentLink, data: { ...recentLink.data, collection_id: linkId } } : recentLink
            //   )
            // );
            // importntsetLinks((prevImportantLinks) =>
            //   prevImportantLinks.map((importantLink) =>
            //     importantLink.id === linkId
            //       ? { ...importantLink, data: { ...importantLink.data, collection_id: linkId } }
            //       : importantLink
            //   )
            // );
          } catch (error) {
            alert('Error updating links:', error);
          }
        };
    
        updateLinks();
      };
      return handleSelectCollection;
}