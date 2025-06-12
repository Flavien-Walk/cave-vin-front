// styles.ts

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4", // couleur douce type cave à vin (identique à AjouterBouteilleStyles)
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
    color: "#6e3b3b", // couleur du titre (identique à AjouterBouteilleStyles)
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    color: "#4b3832", // couleur du texte (identique à AjouterBouteilleStyles)
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a65f4a", // couleur légèrement plus vive pour les titres de section
    marginBottom: 10,
  },
  alertBox: {
    backgroundColor: "#f9e6e1", // fond clair pour alerte
    padding: 10,
    borderRadius: 10,
  },
  alertText: {
    color: "#b00020", // rouge d’alerte
    fontSize: 14,
  },
  statBox: {
    backgroundColor: "#e0d4c0", // fond doux pour statistiques
    padding: 10,
    borderRadius: 10,
  },
  statText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#4b3832", // cohérent avec le texte standard
  },
  quickAccess: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickButton: {
    backgroundColor: "#a65f4a", // couleur chaude pour boutons d’accès rapide
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

  winePatternBackground: {
  backgroundColor: "#f8f1e4",
  flex: 1,
  padding: 20,
},

welcomeBox: {
  backgroundColor: "#fffaf0",
  paddingVertical: 20,
  paddingHorizontal: 16,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
  marginBottom: 20,
  alignItems: "center",
},

welcomeTitle: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#6e3b3b",
  textAlign: "center",
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 6,
},

welcomeSubtitle: {
  fontSize: 15,
  color: "#4b3832",
  textAlign: "center",
  fontStyle: "italic",
},


});

export default styles;
