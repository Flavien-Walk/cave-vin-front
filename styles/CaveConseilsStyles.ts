// styles/CaveConseilsStyles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0EA",        // Fond doux ivoire
    padding: 16,
  },
  bloc: {
    marginBottom: 36,
    backgroundColor: "#fffaf0",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#6e3b3b",           // Ombre couleur bordeaux foncé
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  titre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6e3b3b",                 // Bordeaux profond
    marginBottom: 20,
    letterSpacing: 1,
  },
  sousTitre: {
    fontSize: 18,
    fontWeight: "600",
    color: "#a05252",                 // Chocolat clair
    marginBottom: 8,
  },
  card: {
    padding: 14,
    marginVertical: 9,
    backgroundColor: "#fffaf0",       // Fond chaud (ivoire clair)
    borderRadius: 14,
    shadowColor: "#a05252",
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#f3e8d3",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#6e3b3b",
    borderWidth: 1,
    paddingLeft: 12,
    color: "#6e3b3b",
  },
  button: {
    backgroundColor: "#6e3b3b",
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  buttonText: {
    color: "#fffaf0",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  spinner: {
    marginTop: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#a05252",
    fontStyle: "italic",
    marginTop: 24,
    fontSize: 15,
  },
  errorText: {
    color: "#d7263d",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  welcomeBox: {
  backgroundColor: "#6e3b3b",
  borderRadius: 24,
  paddingVertical: 28,
  paddingHorizontal: 18,
  marginTop: 28,
  marginBottom: 20,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
},

welcomeTitle: {
  color: "white",
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 7,
  letterSpacing: 0.5,
},

welcomeSubtitle: {
  color: "#f2e4e4",
  fontSize: 14,
  textAlign: "center",
  fontStyle: "italic",
  opacity: 0.92,
},

});
