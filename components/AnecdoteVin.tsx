import React, { useState, useEffect } from "react";
import { View, Button, ActivityIndicator, Alert } from "react-native";
import { Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import anecdotesVin from "../data/anecdotes";
import styles from "../styles/AnecdoteVinStyles";
import * as Linking from "expo-linking";

const CURRENT_APP_VERSION = "1.0.0"; // À mettre à jour à chaque release
const LATEST_JSON_URL = "https://cave-vin-back.onrender.com/latest.json";

const AnecdoteVin: React.FC = () => {
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Affiche la version courante au lancement
    Alert.alert("DEBUG", `Version courante: ${CURRENT_APP_VERSION}`);

    fetch(LATEST_JSON_URL)
      .then(res => res.json())
      .then(data => {
        // Debug : afficher la version reçue et la version courante
        Alert.alert("DEBUG", `Reçu: version=${data.version} | courante=${CURRENT_APP_VERSION}`);
        if (data.version && data.version !== CURRENT_APP_VERSION) {
          setUpdateUrl(data.apkUrl);
        }
        setLoading(false);
      })
      .catch((err) => {
        Alert.alert("DEBUG ERROR", err.message || "erreur fetch");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6e3b3b" />
        <Text style={{ marginTop: 16, color: "#6e3b3b" }}>
          Version courante : {CURRENT_APP_VERSION}
        </Text>
      </View>
    );
  }

  if (updateUrl) {
    // Affiche l'alerte mise à jour à la place de l'anecdote
    return (
      <View style={styles.container}>
        <Text style={{ color: "#af7d5d", fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Version courante : {CURRENT_APP_VERSION}
        </Text>
        <View style={[styles.alertBox, { backgroundColor: "#fff3cd", borderColor: "#ffeeba" }]}>
          <View style={styles.row}>
            <Ionicons name="alert-circle-outline" size={22} color="#af7d5d" style={styles.icon} />
            <Text style={[styles.text, { color: "#af7d5d", fontWeight: "bold" }]}>
              Nouvelle version disponible !
            </Text>
          </View>
          <Button
            title="Télécharger la mise à jour"
            color="#6e3b3b"
            onPress={() => Linking.openURL(updateUrl)}
          />
          <Text style={{ color: "#af7d5d", marginTop: 8, fontSize: 13, textAlign: "center" }}>
            Installe la nouvelle version pour profiter des dernières fonctionnalités.
          </Text>
        </View>
      </View>
    );
  }

  // Sinon, affiche une anecdote aléatoire comme d’habitude
  const randomIndex = Math.floor(Math.random() * anecdotesVin.length);
  const anecdote = anecdotesVin[randomIndex];

  return (
    <View style={styles.container}>
      <Text style={{ color: "#6e3b3b", fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
        Version courante : {CURRENT_APP_VERSION}
      </Text>
      <View style={styles.alertBox}>
        <View style={styles.row}>
          <Ionicons name="information-circle-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>{anecdote}</Text>
        </View>
      </View>
    </View>
  );
};

export default AnecdoteVin;
