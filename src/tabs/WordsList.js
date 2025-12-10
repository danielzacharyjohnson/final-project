// src/tabs/WordsList.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function WordsList() {
  const { user } = useAuth();
  const [word, setWord] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "words"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [user?.uid]);

  const addOrSave = async () => {
    const trimmed = word.trim();
    if (!trimmed || !user) return;
    if (editingId) {
      await updateDoc(doc(db, "words", editingId), { text: trimmed });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "words"), {
        text: trimmed,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
    setWord("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setWord(item.text);
  };
  const remove = async (id) => {
    await deleteDoc(doc(db, "words", id));
    if (editingId === id) {
      setEditingId(null);
      setWord("");
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Your Words</Text>
      <View style={s.row}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="one word"
          value={word}
          onChangeText={setWord}
          autoCapitalize="none"
        />
        <View style={{ width: 8 }} />
        <Button title={editingId ? "Save" : "Add"} onPress={addOrSave} />
      </View>

      <FlatList
        style={{ marginTop: 16 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.word}>{item.text}</Text>
            <View style={s.cardButtons}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={s.link}>Edit</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 8 }}>|</Text>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Text style={[s.link, { color: "#c00" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={s.subtle}>No words yet. Add one ↑</Text>
        }
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  subtle: { color: "#666", marginTop: 8 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  word: { fontSize: 18, fontWeight: "600" },
  cardButtons: { flexDirection: "row", alignItems: "center" },
  link: { fontSize: 16, color: "#06c" },
});
