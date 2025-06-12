// styles/AnecdoteVinStyles.ts

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  alertBox: {
    borderLeftWidth: 5,
    borderLeftColor: "#6e3b3b", // bordeaux doux
    backgroundColor: "#fff9f3", // beige clair
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    color: "#4b3832",
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  icon: {
    marginRight: 8,
    color: "#a65f4a",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;
