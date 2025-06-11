// styles.ts

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4", // couleur douce type cave à vin
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#6e3b3b",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#4b3832",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a65f4a",
    marginBottom: 10,
  },
  alertBox: {
    backgroundColor: "#f9e6e1",
    padding: 10,
    borderRadius: 10,
  },
  alertText: {
    color: "#b00020",
    fontSize: 14,
  },
  statBox: {
    backgroundColor: "#e0d4c0",
    padding: 10,
    borderRadius: 10,
  },
  statText: {
    fontSize: 14,
    marginBottom: 5,
  },
  quickAccess: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickButton: {
    backgroundColor: "#a65f4a",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "45%",
  },
  quickLabel: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
});

export default styles;
