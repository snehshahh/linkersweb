import { useDispatch } from "react-redux";
import { setLinks, setLoading } from "../../features/Link/linksSlice";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/firebaseConfig";

export const useFetchLinks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback(async (userId) => {
    if (!userId) {
      navigate("../LoginSignUp");
      return;
    }

    dispatch(setLoading(true));

    try {
      const q = query(
        collection(db, "tlinks"),
        where("user_id", "==", userId),
        orderBy("createDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      const linksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      dispatch(setLinks(linksData));
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [db, dispatch, navigate]);

  return { fetchData };
};
