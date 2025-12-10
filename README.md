
# Contacts App (Expo + Firebase)

A simple React Native app built with **Expo Router** that provides:

- **Authentication**: Sign in & Sign out (Firebase Auth, persistent on device)
- **Contacts**: Full **CRUD** (Create, Read, Update, Delete) per-user
- **Routing**: Bottom tabs (`Contacts`, `Settings`), with a hidden `Edit` screen
- **Persistence**: Firestore (per-user collection) with offline caching; Auth state persists via AsyncStorage
- **Security**: Firestore Security Rules ensure users can only access **their** own contacts

---

## 🚀 Features

- **Sign In / Sign Out**
  - Uses Firebase Authentication
  - Auth state persists across app restarts on native (AsyncStorage)
- **Per-user contacts**
  - Data stored under `users/{uid}/contacts/{contactId}`
  - Real-time updates to the contacts list (Firestore `onSnapshot`)
- **Bottom Tabs**
  - `Contacts` tab: lists contacts and navigates to `Edit`
  - `Settings` tab: sign out
  - `Edit` screen is **not** in the tab bar (pushed from `Contacts`)
- **Offline Support**
  - Firestore local cache (mobile on by default; web uses persistent local cache)
- **Secure by default**
  - Firestore Security Rules restrict access to authenticated user’s subtree

---

## 🧰 Tech Stack

- **Expo** (SDK 53+)
- **Expo Router** (file-based routing)
- **Firebase JS SDK** (Auth + Firestore)
- **AsyncStorage** for RN auth persistence
- **React Native** UI components

---

## 📁 Project Structure

```
app/
 ├─ _layout.js              # Root Stack (hosts tabs + hidden edit screen)
 ├─ edit/
 │   └─ [id].js             # Edit screen (hidden from tabs)
 └─ (tabs)/
     ├─ _layout.js          # Bottom tab bar
     ├─ contacts.js         # Contacts tab (list + add + delete + navigate to edit)
     └─ settings.js         # Settings tab (sign out)
src/
 ├─ firebase.js             # Firebase init (Auth + Firestore + persistence)
 └─ contacts.service.js     # Firestore CRUD + subscription helpers
.env                        # Firebase config (EXPO_PUBLIC_*)
```

---

## 🛠️ Prerequisites

- Node.js 18+
- An Expo project (created via `npx create-expo-app`)
- A Firebase project with **Authentication** and **Firestore** enabled
- For iOS/Android native testing: Xcode / Android Studio (or use Expo Go / Dev Client)

---

## 🔧 Setup

1. **Install dependencies**
   ```bash
   npm install
   npx expo install firebase @react-native-async-storage/async-storage
   ```

2. **Environment variables**  
   Create a `.env` file (only keys prefixed with `EXPO_PUBLIC_` are available at runtime in web builds):

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Start the app**
   ```bash
   npx expo start
   # press 'i' for iOS simulator, 'a' for Android emulator, or open on web
   ```

> If you change native modules or Firebase versions, clear the cache:
```bash
npx expo start --clear
```

---

## 🔐 Firebase Initialization

**`src/firebase.js`** handles:

- **Auth persistence** (device): `initializeAuth(... getReactNativePersistence(AsyncStorage))`
- **Firestore local caching** (web): `initializeFirestore(... persistentLocalCache)`

This ensures users stay signed in and lists refresh reliably as you navigate.

---

## 📦 Data Model

- **Contacts path**: `users/{uid}/contacts/{contactId}`
- **Contact fields**:
  ```json
  {
    "id": "string",
    "name": "string",
    "number": "string",
    "createdAt": 1712345678901
  }
  ```

---

## 🧭 Routing

- `app/_layout.js` → Root `Stack`:
  - `name="(tabs)"` (header hidden)
  - `name="edit/[id]"` → visible only when navigated to

- `app/(tabs)/_layout.js` → Bottom `Tabs`:
  - `contacts` and `settings` tabs

- `Contacts` navigates to `Edit` with:
  ```js
  router.push({ pathname: "/edit/[id]", params: { id, name, number } });
  ```

---

## ✍️ CRUD

All Firestore operations are abstracted in **`src/contacts.service.js`**:

- `addContact(uid, { name, number })`
- `updateContact(uid, id, { name, number })`
- `removeContact(uid, id)`
- `subscribeContacts(uid, cb)` → real-time listener
- `loadContacts(uid)` → one-time load

The **Contacts screen** subscribes to `subscribeContacts(uid, setList)` after Auth state is ready. This provides immediate UI updates on create/update/delete and when returning from `Edit`.

---

## 👤 Authentication

- Auth state is observed via:
  ```js
  import { onAuthStateChanged } from "firebase/auth";
  onAuthStateChanged(auth, (user) => { ... })
  ```
- Sign out:
  ```js
  import { signOut } from "firebase/auth";
  await signOut(auth);
  router.replace("/"); // e.g., to a login screen (if you have one)
  ```

---

## 🛡️ Firestore Security Rules

Paste into **Firebase Console → Firestore → Rules** to lock each user’s data to themselves:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // User-private subtree
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /contacts/{contactId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        // Optional: enforce stable IDs
        allow create, update: if request.resource.data.id == contactId;
      }
    }
  }
}
```

---

## 🧪 Testing Tips

- **Auth**: Verify you remain signed in across app restarts (native) thanks to AsyncStorage.
- **CRUD**: Add, edit, delete contacts; changes should reflect instantly (real-time listener).
- **Tabs & Edit**: Contacts pushes to Edit; Edit saves and navigates back; list should refresh automatically.
- **Security**: Attempt to access another user’s path—reads/writes should be denied by rules.

---

## 🧰 Scripts

Common scripts you can add to `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "web": "expo start --web",
    "clear": "expo start --clear"
  }
}
```

---

## ❓ Troubleshooting

- **AsyncStorage not found** → Install with:
  ```bash
  npx expo install @react-native-async-storage/async-storage
  ```
- **Web bundling errors (react-dom/client not found)** → Ensure:
  ```bash
  npx expo install react-native-web react-dom @expo/metro-runtime
  ```
- **Data not refreshing after Edit** → Confirm you’re using the Firestore **subscription** (`onSnapshot`) in the Contacts screen, not just a one-time load.
- **“Missing/insufficient permissions”** → Check Security Rules and verify you’re writing under `users/{uid}/contacts/*` with a signed-in user whose `uid` matches the path.

---

## 📄 License

MIT (or your chosen license)

---

## ❤️ Acknowledgments

- Built with **Expo** and **Expo Router**
- Backend by **Firebase** (Auth + Firestore)
- AsyncStorage for persistent Auth state on device

---

## 📌 Notes

- Keep your Firebase config keys in `.env` with `EXPO_PUBLIC_*` prefixes for web build compatibility.
- If you move to EAS Dev Client for native builds, ensure proper Firebase iOS/Android configs (GoogleService files) and rerun `npx expo prebuild` when changing native plugins.

