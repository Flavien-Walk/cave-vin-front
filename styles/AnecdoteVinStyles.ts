import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  alertBox: {
    borderLeftWidth: 5,
    borderLeftColor: "#6e3b3b",
    backgroundColor: "#fff9f3",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: "100%", // Ajouté pour garantir pas de débordement
  },
  text: {
    color: "#4b3832",
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
    flexShrink: 1, // Ajoute flexShrink ici aussi pour forcer le wrap
  },
  icon: {
    marginRight: 8,
    color: "#a65f4a",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Ajoute flex: 1 pour forcer le wrap sur toute la ligne
  },
});

export default styles;
