
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@contacts:list";

export async function loadList() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn("Failed to load list:", e);
    return [];
  }
}

export async function saveList(list) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Failed to save list:", e);
  }
}
