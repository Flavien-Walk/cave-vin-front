import React, { useEffect, useState } from "react";
import { ScrollView, FlatList, Dimensions } from "react-native";
import { Box, Text, VStack, Spinner, Button, Input } from "native-base";
import styles from "../styles/CaveConseilsStyles";
import Navbar from "../components/Navbar";

const API_URL = "https://cave-vin-back.onrender.com/api/bottles";

interface Bottle {
  _id: string;
  nom: string;
  annee?: string;
  region?: string;
  appellation?: string;
  type?: string;
  couleur?: string;
  producteur?: string;
}

const { width } = Dimensions.get("window");

const CaveConseils: React.FC = () => {
  const [recommandations, setRecommandations] = useState<Bottle[]>([]);
  const [loadingReco, setLoadingReco] = useState(false);
  const [recoError, setRecoError] = useState("");

  const [plat, setPlat] = useState("");
  const [suggestions, setSuggestions] = useState<Bottle[]>([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const [sugError, setSugError] = useState("");

  const fetchRecommandations = async () => {
    setLoadingReco(true);
    setRecoError("");
    try {
      const response = await fetch(`${API_URL}/recommend`);
      const data = await response.json();
      if (response.ok) {
        setRecommandations(data.recommandations);
      } else {
        setRecoError(data.message || "Erreur inconnue.");
      }
    } catch (err) {
      setRecoError("Erreur lors de la récupération des recommandations.");
    }
    setLoadingReco(false);
  };

  const fetchSuggestions = async () => {
    setLoadingSug(true);
    setSugError("");
    setSuggestions([]);
    try {
      const response = await fetch(`${API_URL}/suggest-wine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plat }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.suggestions);
      } else {
        setSugError(data.message || "Erreur inconnue.");
      }
    } catch (err) {
      setSugError("Erreur lors de la suggestion.");
    }
    setLoadingSug(false);
  };

  useEffect(() => {
    fetchRecommandations();
  }, []);

  // Calcul width responsive pour le welcomeBox (max 500px, min 250px, sinon 90%)
  const getWelcomeBoxWidth = () => {
    if (width > 500) return 500;
    if (width < 300) return 250;
    return "90%";
  };

  return (
    <Box style={styles.container} flex={1}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- ENCADRÉ DE TITRE RESPONSIVE --- */}
        <Box
          style={[
            styles.welcomeBox,
            {
              alignSelf: "center",
              width: getWelcomeBoxWidth(),
              minWidth: 250,
              maxWidth: 500,
            },
          ]}
        >
          <Text style={styles.welcomeTitle}>Découvrir et marier vos vins 🍷</Text>
          <Text style={styles.welcomeSubtitle}>
            Suggestions personnalisées & accords mets-vins pour sublimer votre cave
          </Text>
        </Box>
        {/* ------------------------ */}

        {/* Bloc Recommandations */}
        <Box style={styles.bloc}>
          <Text style={styles.sousTitre}>Suggestions à découvrir</Text>
          {loadingReco && <Spinner style={styles.spinner} />}
          {recoError ? <Text style={styles.errorText}>{recoError}</Text> : null}
          <FlatList
            data={recommandations}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <Box style={styles.card}>
                <Text style={{ fontWeight: "bold", color: "#6e3b3b" }}>
                  {item.nom} {item.annee && `(${item.annee})`}
                </Text>
                <Text style={{ color: "#a05252" }}>{item.region} - {item.appellation}</Text>
                <Text>{item.type} | {item.couleur}</Text>
                <Text style={{ fontStyle: "italic" }}>Producteur : {item.producteur}</Text>
              </Box>
            )}
            ListEmptyComponent={() =>
              !loadingReco ? <Text style={styles.emptyText}>Aucune recommandation pour l’instant.</Text> : null
            }
            scrollEnabled={false}
          />
          <Button style={styles.button} mt={4} onPress={fetchRecommandations}>
            <Text style={styles.buttonText}>Rafraîchir les suggestions</Text>
          </Button>
        </Box>

        {/* Bloc Accord mets-vin */}
        <Box style={styles.bloc}>
          <Text style={styles.sousTitre}>Accord mets-vin</Text>
          <VStack space={3}>
            <Input
              placeholder="Votre plat (ex : poisson, poulet, barbecue...)"
              value={plat}
              onChangeText={setPlat}
              style={styles.input}
            />
            <Button style={styles.button} onPress={fetchSuggestions} isDisabled={!plat || loadingSug}>
              <Text style={styles.buttonText}>Trouver un vin</Text>
            </Button>
          </VStack>
          {loadingSug && <Spinner style={styles.spinner} />}
          {sugError ? <Text style={styles.errorText}>{sugError}</Text> : null}
          <FlatList
            data={suggestions}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <Box style={styles.card}>
                <Text style={{ fontWeight: "bold", color: "#6e3b3b" }}>
                  {item.nom} {item.annee && `(${item.annee})`}
                </Text>
                <Text style={{ color: "#a05252" }}>{item.region} - {item.appellation}</Text>
                <Text>{item.type} | {item.couleur}</Text>
                <Text style={{ fontStyle: "italic" }}>Producteur : {item.producteur}</Text>
              </Box>
            )}
            ListEmptyComponent={() =>
              (!loadingSug && suggestions.length === 0 && !sugError)
                ? <Text style={styles.emptyText}>Aucun vin adapté pour ce plat dans votre cave.</Text>
                : null
            }
            scrollEnabled={false}
          />
        </Box>
      </ScrollView>
      <Navbar />
    </Box>
  );
};

export default CaveConseils;
