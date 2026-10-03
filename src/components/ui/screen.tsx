import { Children, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
};

export function Screen({
  children,
  scroll = true,
  keyboardAvoiding = false,
}: ScreenProps) {
  const theme = useTheme();
  const childArray = Children.toArray(children);

  const content = scroll ? (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {childArray.length > 1 ? (
        <View
          style={[styles.fixedHeader, { backgroundColor: theme.background }]}
        >
          <View style={styles.inner}>{childArray[0]}</View>
        </View>
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {childArray
          .slice(childArray.length > 1 ? 1 : 0)
          .map((child, index, contentChildren) => (
            <View
              key={index}
              style={[
                styles.inner,
                index === contentChildren.length - 1 && styles.lastChild,
              ]}
            >
              {child}
            </View>
          ))}
      </ScrollView>
    </View>
  ) : (
    <View style={[styles.staticContent, { backgroundColor: theme.background }]}>
      {children}
    </View>
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoiding}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      {wrappedContent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.five,
  },
  fixedHeader: {
    flexShrink: 0,
  },
  lastChild: {
    paddingBottom: Spacing.eight,
  },
});
