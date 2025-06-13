import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f1e4", // beige doux
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6e3b3b", // bordeaux foncé
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4b3832", // brun profond
    marginBottom: 6,
  },

  // 🔽 MODALS
  modalContainer: {
    backgroundColor: "#fffaf5", // fond doux crème
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6e3b3b",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#4b3832",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#a65f4a", // rouge-brun chaleureux
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  welcomeBox: {
  backgroundColor: "#6e3b3b",
  borderRadius: 24,
  paddingVertical: 28,
  paddingHorizontal: 18,
  marginTop: 28,
  marginBottom: 18,
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

export default styles;
