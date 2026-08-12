import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

import { BottomTabInset, Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const tabRouteMap = {
  index: { label: "ホーム", icon: "home-outline" },
  "activities/index": { label: "活動", icon: "document-text-outline" },
  "gakuchika/index": { label: "ガクチカ", icon: "sparkles-outline" },
  "es/index": { label: "探す", icon: "search-outline" },
};

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const key = String(route.name);
        const routeMeta = tabRouteMap[key as keyof typeof tabRouteMap] ?? {
          label: key,
          icon: "ellipse-outline",
        };

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textTertiary,
          tabBarStyle: {
            height: 68 + BottomTabInset,
            paddingTop: 8,
            paddingBottom: 10 + BottomTabInset,
            borderTopColor: Colors.light.border,
            backgroundColor: theme.surface,
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={routeMeta.icon as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: 11,
                fontWeight: "600",
                marginTop: 4,
              }}
            >
              {routeMeta.label}
            </Text>
          ),
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: "ホーム" }} />
      <Tabs.Screen name="activities/index" options={{ title: "活動" }} />
      <Tabs.Screen name="gakuchika/index" options={{ title: "ガクチカ" }} />
      <Tabs.Screen name="es/index" options={{ title: "探す" }} />
    </Tabs>
  );
}
