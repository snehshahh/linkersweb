export const handleSaveLink = async (userId, url, note) => {
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