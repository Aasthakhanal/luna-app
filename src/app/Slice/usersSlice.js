import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,
  search: "",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
  },
});

export const { setPage, setSearch, setLimit } = usersSlice.actions;

export default usersSlice.reducer;
