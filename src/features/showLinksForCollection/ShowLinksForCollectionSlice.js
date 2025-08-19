import { createSlice } from "@reduxjs/toolkit"

const ShowLinksForCollectionSlice = createSlice({
    name: 'showlinkcollection',
    initialState: {Collectionid : null,
    },
    reducers:{
        setShowLinksForCollection : (state, action) => {state.Collectionid = action.payload}
    }
});

export const {setShowLinksForCollection} = ShowLinksForCollectionSlice.actions;

export default ShowLinksForCollectionSlice.reducer;