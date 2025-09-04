import { createSlice } from "@reduxjs/toolkit"

const toggleSearchBarSlice = createSlice({
    name: 'toggleSearch',
    initialState: {isSearchBarVisible : false,
        searchBarText : ""
    },
    reducers:{
        toggleSearchBar : (state) => {state.toggleSearch = !state.toggleSearch},
        setSearchBarText : (state,action) => {state.searchBarText = action.payload}

    }
});

export const {toggleSearchBar,setSearchBarText} = toggleSearchBarSlice.actions;

export default toggleSearchBarSlice.reducer;