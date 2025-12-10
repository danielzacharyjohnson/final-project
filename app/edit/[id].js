
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { loadList, saveList } from "../../src/storage";

export default function EditContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, name: nameParam, number: numberParam } = params;

  const [name, setName] = useState(nameParam ? String(nameParam) : "");
  const [number, setNumber] = useState(numberParam ? String(numberParam) : "");

  // Optional: re-load from storage by id (in case user deep-linked here)
  useEffect(() => {
    (async () => {
      if (!id) return;
      const list = await loadList();
      const found = list.find((x) => x.id === id);
      if (found) {
        setName(found.name || "");
        setNumber(found.number || "");
      }
    })();
  }, [id]);

  const save = async () => {
    if (!id) {
      Alert.alert("Missing id", "Cannot save without an id.");
      return;
    }
    const list = await loadList();
    const updated = list.map((x) =>
      x.id === id ? { ...x, name: (name || "").trim(), number: (number || "").trim() } : x
    );
    await saveList(updated);
    router.back(); // return to contacts list
  };

  const cancel = () => router.back();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TextInput
        style={styles.input}
        placeholder="Number"
        value={number}
        onChangeText={setNumber}
        keyboardType="number-pad"
      />

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <Button title="Save" onPress={save} />
        <Button title="Cancel" color="#888" onPress={cancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    padding: 20, paddingTop: 60,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#ccc",
    padding: 8, borderRadius: 5, backgroundColor: "#f9f9f9",
    marginBottom: 10, width: "100%",
  },
});
