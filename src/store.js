import { configureStore } from "@reduxjs/toolkit";
import NavbarReducer from "./features/Navbar/NavbarSlice.js"
import showlinkcollection from "./features/Link/ShowLinksForCollectionSlice";
import toggleSearchBar from "./features/toggleSearchBar/toggleSearchBarSlice.js";
import linksReducer from "./features/Link/linksSlice"
export const store = configureStore({
    reducer: {
        nav : NavbarReducer,
        showlinkcollection : showlinkcollection,
        isSearchBarVisible : toggleSearchBar,
        linksState : linksReducer


    },
})