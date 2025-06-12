// components/Navbar.tsx

import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NavbarProps {
  title?: string;
}

type ValidRoute = "/" | "/liste-cave" | "/ajouter-bouteille";

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const router = useRouter();

  const buttons: {
    route: ValidRoute;
    icon: any;
    label: string;
  }[] = [
    { route: "/", icon: "home-outline", label: "Accueil" },
    { route: "/ajouter-bouteille", icon: "add-circle-outline", label: "Ajouter" },
    { route: "/liste-cave", icon: "wine-outline", label: "Ma Cave" },
  ];

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.route}
          style={styles.button}
          onPress={() => router.push({ pathname: btn.route })}
        >
          <Ionicons name={btn.icon} size={24} color="#fff" />
          <Text style={styles.label}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#6e3b3b",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    top: -30,
    textAlign: "center",
    width: "100%",
  },
  button: {
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
});

export default Navbar;
