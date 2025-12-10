// app/(tabs)/settings.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
export default function Settings(){
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={{ marginBottom:12 }}>Signed in as {user?.email}</Text>
      <Button style={styles.button} title="Sign Out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "collumn",
    marginBottom: 15,
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#eee",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    width: "100%",
  },
  itemText: { fontSize: 16, marginBottom: 4 },
  label: { fontWeight: "600", color: "#333" },
  button: {
    marginTop: 20,
    width: '60%',

  },
});
