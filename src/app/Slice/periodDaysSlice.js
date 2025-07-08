import { createSlice } from "@reduxjs/toolkit";

const periodDaysSlice = createSlice({
  name: "periodDays",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeriodDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeriodDays.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchPeriodDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default periodDaysSlice.reducer;
