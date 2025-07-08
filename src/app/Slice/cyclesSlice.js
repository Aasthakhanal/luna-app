import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCycleId: null,
  creating: false,
};

const cyclesSlice = createSlice({
  name: "cycles",
  initialState,
  reducers: {
    setCurrentCycleId: (state, action) => {
      state.currentCycleId = action.payload;
    },
    setCreating: (state, action) => {
      state.creating = action.payload;
    },
  },
});

export const { setCurrentCycleId, setCreating } = cyclesSlice.actions;

export default cyclesSlice.reducer;
