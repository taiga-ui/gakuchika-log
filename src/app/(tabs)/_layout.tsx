import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { BottomTabInset, Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          height: 66 + BottomTabInset,
          paddingTop: 8,
          paddingBottom: 10 + BottomTabInset,
          borderTopColor: Colors.light.border,
          backgroundColor: theme.surface,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: "home-outline",
            activities: "document-text-outline",
            calendar: "calendar-outline",
            albums: "images-outline",
            profile: "person-outline",
          };

          return (
            <Ionicons
              name={iconMap[route.name] ?? "ellipse-outline"}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "ホーム" }} />
      <Tabs.Screen name="activities" options={{ title: "活動" }} />
      <Tabs.Screen name="calendar" options={{ title: "カレンダー" }} />
      <Tabs.Screen name="albums" options={{ title: "アルバム" }} />
      <Tabs.Screen name="profile" options={{ title: "マイページ" }} />
    </Tabs>
  );
}
