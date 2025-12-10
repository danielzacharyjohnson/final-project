import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/(auth)/sign-in" />;
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen name="index" options={{headerShown: false}} />

      <Tabs.Screen name="settings" options={{headerShown: false}} />
    </Tabs>
  );
}
