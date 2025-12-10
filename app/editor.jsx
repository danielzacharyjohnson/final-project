import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditorScreen() {
  const router = useRouter();
  const { imageUrl, templateName } = useLocalSearchParams();

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  function hanlePreview() {
    router.push({
      pathname: "/result",
      params: {
        imageUrl,
        templateName,
        topText,
        bottomText,
      },
    });
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={100}
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.header}>Editing: {templateName}</Text>
          <Image
            source={{ uri: imageUrl }}
            style={styles.previewImage}
            resizeMode="contain"
          />

          <View style={styles.form}>
            <Text style={styles.label}>Top Text:</Text>
            <TextInput
              style={styles.input}
              value={topText}
              onChangeText={setTopText}
              placeholder="When you write code..."
              placeholderTextColor={"#888"}
            />

            <Text style={styles.label}>Bottom Text:</Text>
            <TextInput
              style={styles.input}
              value={bottomText}
              onChangeText={setBottomText}
              placeholder="...and it works!"
              placeholderTextColor={"#888"}
            />
            <TouchableOpacity style={styles.button} onPress={hanlePreview}>
              <Text style={styles.buttonText}>Preview Meme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#fff",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 220,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#2C2C2E",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#f4511e",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
