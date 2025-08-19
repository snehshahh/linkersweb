import { useDispatch } from "react-redux";
import { toggleNav, setSelectedTab } from "../../features/Navbar/NavbarSlice";
import { setShowLinksForCollection } from "../../features/showLinksForCollection/ShowLinksForCollectionSlice";

export function useHandleTabClick() {
    const dispatch = useDispatch();
  
    // return the handler function
    const handleTabClick = (tab) => {
      if (tab === "tab4") {
        dispatch(setShowLinksForCollection(false));
      }
      dispatch(setSelectedTab(tab));
      dispatch(toggleNav(false));
    };
  
    return handleTabClick;
  }