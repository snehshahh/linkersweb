import { createSlice } from "@reduxjs/toolkit";

const linksSlice = createSlice({
    name: "links",
    initialState: {
      links: [],
      loading: false,
    },
    reducers: {
      setLinks: (state, action) => {
        state.links = action.payload;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
    },
  });
  
  export const { setLinks, setLoading } = linksSlice.actions;
  export default linksSlice.reducer;