import React from "react";
import { View } from "react-native";
import { Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import anecdotesVin from "../data/anecdotes";
import styles from "../styles/AnecdoteVinStyles";

const AnecdoteVin: React.FC = () => {
  const randomIndex = Math.floor(Math.random() * anecdotesVin.length);
  const anecdote = anecdotesVin[randomIndex];

  return (
    <View style={styles.container}>
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
