import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.title }, "ガクチカログ"),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});
