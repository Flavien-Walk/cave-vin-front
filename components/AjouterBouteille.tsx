// components/AjouterBouteille.tsx

import React, { useState } from "react";
import { ScrollView, Alert as RNAlert } from "react-native";
import {
  Box,
  Text,
  Input,
  Select,
  CheckIcon,
  Button,
  VStack,
  NativeBaseProvider,
} from "native-base";
import styles from "../styles/AjouterBouteilleStyles";
import Navbar from "./Navbar";

const bottleTypes = ["Bouteille", "Demi-bouteille", "Magnum"];
const wineColors = ["Rouge", "Blanc", "Rosé"];
const countries = [
  "France", "Italie", "Espagne", "Argentine", "Australie", "Chili",
  "Afrique du Sud", "États-Unis", "Nouvelle-Zélande", "Allemagne", "Portugal",
  "Suisse", "Grèce", "Autres pays...",
];
const regions = [
  "Bordeaux", "Bourgogne", "Champagne", "Vallée du Rhône", "Alsace",
  "Languedoc", "Provence", "Loire", "Jura", "Corse", "Sud-Ouest", "Autre",
];
const appellations = [
  "Saint-Julien", "Margaux", "Pauillac", "Châteauneuf-du-Pape",
  "Sancerre", "Côte-Rôtie", "Volnay", "Pommard", "Autre",
];

const caves = [
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

  const selectedCave = caves.find((c) => c.id === caveId);

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
      cave: caveId ? caves.find((c) => c.id === caveId)?.name : "",
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

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>Ajouter une Bouteille</Text>
          <VStack space={4}>
            <Box><Text style={styles.label}>Nom du vin :</Text><Input placeholder="ex: Château Margaux" value={nom} onChangeText={setNom} backgroundColor="#fff8f0" /></Box>
            <Box><Text style={styles.label}>Producteur :</Text><Input placeholder="ex: Domaine Dupont" value={producteur} onChangeText={setProducteur} backgroundColor="#fff8f0" /></Box>
            <Box><Text style={styles.label}>Région :</Text><Select selectedValue={region} placeholder="Sélectionner la région" backgroundColor="#fff8f0" onValueChange={setRegion} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{regions.map((r) => <Select.Item key={r} label={r} value={r} />)}</Select></Box>
            <Box><Text style={styles.label}>Appellation :</Text><Select selectedValue={appellation} placeholder="Sélectionner l'appellation" backgroundColor="#fff8f0" onValueChange={setAppellation} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{appellations.map((a) => <Select.Item key={a} label={a} value={a} />)}</Select></Box>
            <Box><Text style={styles.label}>Année :</Text><Input placeholder="ex: 2015" keyboardType="numeric" value={annee} onChangeText={setAnnee} backgroundColor="#fff8f0" /></Box>
            <Box><Text style={styles.label}>Quantité :</Text><Input placeholder="ex: 12" keyboardType="numeric" value={quantite} onChangeText={setQuantite} backgroundColor="#fff8f0" /></Box>
            <Box><Text style={styles.label}>Type :</Text><Select selectedValue={type} placeholder="Sélectionner le type" backgroundColor="#fff8f0" onValueChange={setType} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{bottleTypes.map((bt) => <Select.Item key={bt} label={bt} value={bt} />)}</Select></Box>
            <Box><Text style={styles.label}>Couleur du vin :</Text><Select selectedValue={couleur} placeholder="Sélectionner la couleur" backgroundColor="#fff8f0" onValueChange={setCouleur} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{wineColors.map((c) => <Select.Item key={c} label={c} value={c} />)}</Select></Box>
            <Box><Text style={styles.label}>Pays :</Text><Select selectedValue={pays} placeholder="Sélectionner le pays" backgroundColor="#fff8f0" onValueChange={setPays} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{countries.map((p) => <Select.Item key={p} label={p} value={p} />)}</Select></Box>
            <Box><Text style={styles.label}>Prix d'achat (€) :</Text><Input placeholder="ex: 32.50" keyboardType="decimal-pad" value={prixAchat} onChangeText={setPrixAchat} backgroundColor="#fff8f0" /></Box>
            <Box><Text style={styles.label}>À consommer avant :</Text><Input placeholder="ex: 2030" value={consommerAvant} onChangeText={setConsommerAvant} backgroundColor="#fff8f0" /></Box>
            <Box><Text style={styles.label}>Cave :</Text><Select selectedValue={caveId?.toString()} placeholder="Sélectionner la cave" backgroundColor="#fff8f0" onValueChange={(val) => { setCaveId(Number(val)); setEmplacement(""); }} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{caves.map((c) => <Select.Item key={c.id} label={c.name} value={c.id.toString()} />)}</Select></Box>
            {selectedCave && <Box><Text style={styles.label}>Emplacement :</Text><Select selectedValue={emplacement} placeholder="Sélectionner l'emplacement" backgroundColor="#fff8f0" onValueChange={setEmplacement} _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{selectedCave.emplacements.map((e, i) => <Select.Item key={i} label={e} value={e} />)}</Select></Box>}
            <Button mt={4} colorScheme="red" borderRadius="xl" onPress={handleSubmit} isLoading={loading} isLoadingText="Ajout...">Ajouter la Bouteille</Button>
          </VStack>
        </ScrollView>
        <Navbar />
      </Box>
    </NativeBaseProvider>
  );
};

export default AjouterBouteille;
