// import { Stack } from "expo-router";
// import { AuthProvider, useAuth } from "../src/auth/AuthContext";
// import { View, ActivityIndicator } from "react-native";
// import { StatusBar } from "expo-status-bar";

// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerTitle: "Meme Generator",
//         headerStyle: { backgroundColor: "#f4511e" },
//         headerTitleStyle: { color: "#fff" },
//         headerTintColor: "#000000",
//         contentStyle: { backgroundColor: "#1A1A1F" },
//       }}
//     />
//   );
// }

// app/_layout.js

import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/auth/AuthContext';
import { View, ActivityIndicator } from 'react-native';

function Gate({ children }) {
  const { loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate>
        <Stack screenOptions={{ headerShown: false }} />
      </Gate>
    </AuthProvider>
  );
}
