import { configureStore } from "@reduxjs/toolkit";
import NavbarReducer from "./features/Navbar/NavbarSlice.js"
import showlinkcollection from "./features/showLinksForCollection/ShowLinksForCollectionSlice.js"

export const store = configureStore({
    reducer: {
        nav : NavbarReducer,
        showlinkcollection : showlinkcollection,

    },
})