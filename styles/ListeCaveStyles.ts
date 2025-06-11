// styles/ListeCaveStyles.ts

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6e3b3b",
  },
  card: {
    backgroundColor: "#fffaf0",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bottleName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6e3b3b",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
});

export default styles;
