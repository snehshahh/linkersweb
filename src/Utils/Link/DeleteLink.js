import { db } from "../../db/firebaseConfig";
import { deleteDoc } from "firebase/firestore";
export async function handleDeleteFromAll(id) {
  try {
    await deleteDoc(doc(db, "tlinks", id));
  } catch (error) {
    alert("Error deleting link:", error);
  }
}
