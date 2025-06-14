import React, { useState, useEffect } from "react";
import { View, Button, ActivityIndicator } from "react-native";
import { Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import anecdotesVin from "../data/anecdotes";
import styles from "../styles/AnecdoteVinStyles";
import * as Linking from "expo-linking";

const CURRENT_APP_VERSION = "1.0.0";
const LATEST_JSON_URL = "https://cave-vin-back.onrender.com/latest.json";

const AnecdoteVin: React.FC = () => {
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(LATEST_JSON_URL)
      .then(res => res.json())
      .then(data => {
        if (data.version && data.version !== CURRENT_APP_VERSION) {
          setUpdateUrl(data.apkUrl);
        }
        setLoading(false);
      })
      .catch(() => {
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
    return (
      <View style={styles.container}>
        <Text style={{ color: "#af7d5d", fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Version courante : {CURRENT_APP_VERSION}
        </Text>
        <View style={[styles.alertBox, { backgroundColor: "#fff3cd", borderColor: "#ffeeba" }]}>
          <View style={styles.row}>
            <Ionicons name="alert-circle-outline" size={22} color="#af7d5d" style={styles.icon} />
            <Text style={[styles.text, { color: "#af7d5d", fontWeight: "bold", flex: 1, flexShrink: 1 }]}>
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

  // Anecdote aléatoire
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
          <Text
            style={[styles.text, { flex: 1, flexShrink: 1 }]} // Ajoute ça pour wrap
            // numberOfLines={5} // <-- Décommente si tu veux tronquer à 5 lignes
          >
            {anecdote}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AnecdoteVin;
