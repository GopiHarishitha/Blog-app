import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// make http request using redux thunk middleware
export const userAuthorLoginThunk = createAsyncThunk(
  "user-author-login",
  async (userCredObj, thunkapi) => {
    try {
      if (userCredObj.userType === "user") {
        let res = await axios.post(
          "http://localhost:4000/user-api/login",
          userCredObj
        );
        console.log("user response in slice", res);
        if (res.data.message === "login success") {
          // store token in local/session storage
          localStorage.setItem("token", res.data.token);
          //return data
        } else {
          return thunkapi.rejectWithValue(res.data.message);
        }
        return res.data;
      }
      if (userCredObj.userType === "author") {
        let res = await axios.post(
          "http://localhost:4000/author-api/login",
          userCredObj
        );
        console.log(res);
        if (res.data.message === "login success") {
          //store data in local/session storage
          localStorage.setItem("token", res.data.token);

          //return data
        } else {
          return thunkapi.rejectWithValue(res.data.message);
        }
        return res.data;
      }
    } catch (err) {
      return thunkapi.rejectWithValue(err);
    }
  }
);

export const userAuthorSlice = createSlice({
  name: "userObj",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccured: false,
    errMsg: "",
  },
  reducers: {
    // used to deal with local state
    resetState: (state, action) => {
      state.isPending = false;
      state.loginUserStatus = false;
      state.currentUser = {};
      state.errorOccured = false;
      state.errMsg = "";
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(userAuthorLoginThunk.pending, (state, action) => {
        state.isPending = true;
        state.errorOccured = false;
      })
      .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.loginUserStatus = true;
        state.isPending = false;
        state.errMsg = "";
        state.errorOccured = false;
      })
      .addCase(userAuthorLoginThunk.rejected, (state, action) => {
        state.currentUser = {};
        state.loginUserStatus = false;
        state.isPending = false;
        state.errMsg = action.payload;
        state.errorOccured = true;
      }),
  // used to deal with external state
});

//export root reducer of this silce
export default userAuthorSlice.reducer;

// action creator functions
export const { resetState } = userAuthorSlice.actions;
