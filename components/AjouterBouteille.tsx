// components/AjouterBouteille.tsx

import React, { useState } from "react";
import { ScrollView, Alert as RNAlert } from "react-native";
import {
  Box, Text, Input, Select, CheckIcon, Button, VStack, HStack, Icon, NativeBaseProvider
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/AjouterBouteilleStyles";
import Navbar from "./Navbar";

const BOTTLE_TYPES = ["Bouteille", "Demi-bouteille", "Magnum"];
const WINE_COLORS = ["Rouge", "Blanc", "Rosé"];
const COUNTRIES = [
  "France", "Italie", "Espagne", "Argentine", "Australie", "Chili",
  "Afrique du Sud", "États-Unis", "Nouvelle-Zélande", "Allemagne", "Portugal",
  "Suisse", "Grèce", "Autres pays...",
];
const REGIONS = [
  "Bordeaux", "Bourgogne", "Champagne", "Vallée du Rhône", "Alsace",
  "Languedoc", "Provence", "Loire", "Jura", "Corse", "Sud-Ouest", "Autre",
];
const APPELLATIONS = [
  "Saint-Julien", "Margaux", "Pauillac", "Châteauneuf-du-Pape",
  "Sancerre", "Côte-Rôtie", "Volnay", "Pommard", "Autre",
];
const CAVES = [
  { id: 1, name: "Cave 1", emplacements: ["Haut Derrière", "Haut Devant", "1ère Clayette", "2ème Clayette", "3ème Clayette", "Milieu Derrière", "Milieu Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
  { id: 2, name: "Cave 2", emplacements: ["Haut Derrière", "Haut Devant", "1ère Clayette", "2ème Clayette", "3ème Clayette", "Milieu Derrière", "Milieu Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
  { id: 3, name: "Cave 3", emplacements: ["Haut Derrière", "Haut Devant", "1ère Clayette", "2ème Clayette", "3ème Clayette", "Milieu Derrière", "Milieu Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
  { id: 4, name: "Cave 4", emplacements: ["Haut Derrière", "Haut Devant", "Milieu Haut Derrière", "Milieu Haut Devant", "Milieu Bas Derrière", "Milieu Bas Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
];

const AjouterBouteille: React.FC = () => {
  const [nom, setNom] = useState("");
  const [producteur, setProducteur] = useState("");
  const [region, setRegion] = useState("");
  const [appellation, setAppellation] = useState("");
  const [annee, setAnnee] = useState("");
  const [quantite, setQuantite] = useState("");
  const [type, setType] = useState("");
  const [couleur, setCouleur] = useState("");
  const [pays, setPays] = useState("");
  const [prixAchat, setPrixAchat] = useState("");
  const [consommerAvant, setConsommerAvant] = useState("");
  const [caveId, setCaveId] = useState<number | undefined>(undefined);
  const [emplacement, setEmplacement] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCave = CAVES.find(c => c.id === caveId);

  const handleSubmit = async () => {
    const bottleData = {
      nom,
      producteur,
      region,
      appellation,
      annee,
      quantite: Number(quantite),
      type,
      couleur,
      pays,
      prixAchat: parseFloat(prixAchat),
      consommerAvant,
      cave: caveId ? CAVES.find(c => c.id === caveId)?.name : "",
      emplacement,
    };

    try {
      setLoading(true);
      const response = await fetch("https://cave-vin-back.onrender.com/api/bottles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bottleData),
      });

      if (response.ok) {
        RNAlert.alert("Succès", "Bouteille ajoutée avec succès !");
        setNom(""); setProducteur(""); setRegion(""); setAppellation(""); setAnnee("");
        setQuantite(""); setType(""); setCouleur(""); setPays(""); setPrixAchat("");
        setConsommerAvant(""); setCaveId(undefined); setEmplacement("");
      } else {
        RNAlert.alert("Erreur", "Erreur lors de l'ajout de la bouteille.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      RNAlert.alert("Erreur", "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const renderLabel = (icon: string, label: string) => (
    <HStack alignItems="center" space={2} mb={1}>
      <Icon as={Ionicons} name={icon} size="sm" color="gray.600" />
      <Text style={styles.label}>{label}</Text>
    </HStack>
  );

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>Ajouter une Bouteille</Text>
          <VStack space={4}>
            <Box>{renderLabel("wine-outline", "Nom du vin :")}<Input value={nom} onChangeText={setNom} backgroundColor="#fff8f0" placeholder="ex: Château Margaux" /></Box>
            <Box>{renderLabel("person-outline", "Producteur :")}<Input value={producteur} onChangeText={setProducteur} backgroundColor="#fff8f0" placeholder="ex: Domaine Dupont" /></Box>
            <Box>{renderLabel("map-outline", "Région :")}<Select selectedValue={region} onValueChange={setRegion} placeholder="Sélectionner la région" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{REGIONS.map(r => <Select.Item key={r} label={r} value={r} />)}</Select></Box>
            <Box>{renderLabel("ribbon-outline", "Appellation :")}<Select selectedValue={appellation} onValueChange={setAppellation} placeholder="Sélectionner l'appellation" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{APPELLATIONS.map(a => <Select.Item key={a} label={a} value={a} />)}</Select></Box>
            <Box>{renderLabel("calendar-outline", "Année :")}<Input keyboardType="numeric" value={annee} onChangeText={setAnnee} backgroundColor="#fff8f0" placeholder="ex: 2015" /></Box>
            <Box>{renderLabel("cube-outline", "Quantité :")}<Input keyboardType="numeric" value={quantite} onChangeText={setQuantite} backgroundColor="#fff8f0" placeholder="ex: 12" /></Box>
            <Box>{renderLabel("cube", "Type :")}<Select selectedValue={type} onValueChange={setType} placeholder="Sélectionner le type" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{BOTTLE_TYPES.map(bt => <Select.Item key={bt} label={bt} value={bt} />)}</Select></Box>
            <Box>{renderLabel("color-palette-outline", "Couleur du vin :")}<Select selectedValue={couleur} onValueChange={setCouleur} placeholder="Sélectionner la couleur" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{WINE_COLORS.map(c => <Select.Item key={c} label={c} value={c} />)}</Select></Box>
            <Box>{renderLabel("flag-outline", "Pays :")}<Select selectedValue={pays} onValueChange={setPays} placeholder="Sélectionner le pays" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{COUNTRIES.map(p => <Select.Item key={p} label={p} value={p} />)}</Select></Box>
            <Box>{renderLabel("cash-outline", "Prix d'achat (€) :")}<Input keyboardType="decimal-pad" value={prixAchat} onChangeText={setPrixAchat} backgroundColor="#fff8f0" placeholder="ex: 32.50" /></Box>
            <Box>{renderLabel("time-outline", "À consommer avant :")}<Input value={consommerAvant} onChangeText={setConsommerAvant} backgroundColor="#fff8f0" placeholder="ex: 2030" /></Box>
            <Box>{renderLabel("home-outline", "Cave :")}<Select selectedValue={caveId?.toString()} onValueChange={val => { setCaveId(Number(val)); setEmplacement(""); }} placeholder="Sélectionner la cave" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{CAVES.map(c => <Select.Item key={c.id} label={c.name} value={c.id.toString()} />)}</Select></Box>
            {selectedCave && <Box>{renderLabel("location-outline", "Emplacement :")}<Select selectedValue={emplacement} onValueChange={setEmplacement} placeholder="Sélectionner l'emplacement" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{selectedCave.emplacements.map((e, i) => <Select.Item key={i} label={e} value={e} />)}</Select></Box>}
            <Button mt={4} colorScheme="red" borderRadius="xl" onPress={handleSubmit} isLoading={loading} isLoadingText="Ajout...">Ajouter la Bouteille</Button>
          </VStack>
        </ScrollView>
        <Navbar />
      </Box>
    </NativeBaseProvider>
  );
};

export default AjouterBouteille;
