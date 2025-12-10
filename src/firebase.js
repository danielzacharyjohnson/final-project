
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const app = initializeApp({ /* your config */ });

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
