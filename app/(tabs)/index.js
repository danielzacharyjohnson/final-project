import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { loadList, saveList } from "../../src/storage";

export default function ContactsScreen() {
  const router = useRouter();

  const [nameInput, setNameInput] = useState("");
  const [numberInput, setNumberInput] = useState("");

  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const initial = await loadList();
      setList(initial);
    })();
  }, []);

  useEffect(() => {
    saveList(list);
  }, [list]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      (async () => {
        const refreshed = await loadList();
        if (mounted) setList(refreshed);
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const addItem = () => {
    const name = (nameInput || "").trim();
    const number = (numberInput || "").trim();
    if (!name && !number) return;

    setList((prev) => [...prev, { id: Date.now().toString(), name, number }]);

    setNameInput("");
    setNumberInput("");
  };

  const removeItem = (id) => {
    setList((prev) => prev.filter((g) => g.id !== id));
  };

  const goToEdit = (item) => {
    router.push({
      pathname: "/edit/[id]",
      params: { id: item.id, name: item.name, number: item.number },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>

      {/* Add form */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Name"
          value={nameInput}
          onChangeText={setNameInput}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Number"
          value={numberInput}
          onChangeText={setNumberInput}
          keyboardType="number-pad"
          onSubmitEditing={addItem}
        />
        <Button title="Add" onPress={addItem} />
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(g) => g.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.itemText}>
                <Text style={styles.label}>Name: </Text>
                {item.name || "-"}
              </Text>
              <Text style={styles.itemText}>
                <Text style={styles.label}>Number: </Text>
                {item.number || "-"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable
                onPress={() => goToEdit(item)}
                style={{ marginRight: 12 }}
              >
                <Feather name="edit" size={22} color="#4444ff" />
              </Pressable>
              <Pressable onPress={() => removeItem(item.id)}>
                <Feather name="trash-2" size={22} color="#ff4444" />
              </Pressable>
            </View>
          </View>
        )}
      />
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
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 18,
    height: 48,
    width: "80%",

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
});
