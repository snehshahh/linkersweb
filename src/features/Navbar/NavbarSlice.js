import { createSlice } from "@reduxjs/toolkit"

const NavbarSlice = createSlice({
    name: 'nav',
    initialState: {isNavOpen : false,
        selectedTab: 'tab1'
    },
    reducers:{
        toggleNav : (state,action) => {state.isNavOpen = action.payload},
        setSelectedTab : (state, action) => {state.selectedTab = action.payload}
    }
});

export const {toggleNav, setSelectedTab} = NavbarSlice.actions;

export default NavbarSlice.reducer;