import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
   auth: persistReducer({
      storage,
      stateReconciler: autoMergeLevel2,
      key: 'auth',
      whitelist: ['isLoggedIn', 'token', 'refresh_token']
   }, authReducer as any),
});

export const store = configureStore({
   reducer: rootReducer,
   middleware: [thunk],
});

export const persistor = persistStore(store);
