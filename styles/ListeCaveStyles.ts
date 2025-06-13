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
  modalContent: {
    backgroundColor: "#fffaf0",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeaderBox: {
    backgroundColor: "#f8f1e4",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6e3b3b",
    textAlign: "center",
  },
  modalLabel: {
    fontWeight: "600",
    color: "#6e3b3b",
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  modalFooter: {
    backgroundColor: "#f8f1e4",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  saveButton: {
    backgroundColor: "#6e3b3b",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#6e3b3b",
    fontWeight: "600",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#6e3b3b",
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