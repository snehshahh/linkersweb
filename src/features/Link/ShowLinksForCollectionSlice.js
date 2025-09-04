import { createSlice } from "@reduxjs/toolkit"

const ShowLinksForCollectionSlice = createSlice({
    name: 'showlinkcollection',
    initialState: {Collectionids : [],
    },
    reducers:{
        setShowLinksForCollection : (state, action) => {(action.payload)?(state.Collectionids =  state.Collectionids.push(action.payload)):state.Collectionid = []}
    }
});

export const {setShowLinksForCollection} = ShowLinksForCollectionSlice.actions;

export default ShowLinksForCollectionSlice.reducer;