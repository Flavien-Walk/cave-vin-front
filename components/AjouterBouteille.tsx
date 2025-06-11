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

const caves = [
  {
    id: 1,
    name: "Cave 1",
    emplacements: [
      "Haut Derrière",
      "Haut Devant",
      "1ère Clayette",
      "2ème Clayette",
      "3ème Clayette",
      "Milieu Derrière",
      "Milieu Devant",
      "Bas Derrière",
      "Bas Devant",
      "Très Bas",
    ],
  },
  {
    id: 2,
    name: "Cave 2",
    emplacements: [
      "Haut Derrière",
      "Haut Devant",
      "1ère Clayette",
      "2ème Clayette",
      "3ème Clayette",
      "Milieu Derrière",
      "Milieu Devant",
      "Bas Derrière",
      "Bas Devant",
      "Très Bas",
    ],
  },
  {
    id: 3,
    name: "Cave 3",
    emplacements: [
      "Haut Derrière",
      "Haut Devant",
      "1ère Clayette",
      "2ème Clayette",
      "3ème Clayette",
      "Milieu Derrière",
      "Milieu Devant",
      "Bas Derrière",
      "Bas Devant",
      "Très Bas",
    ],
  },
  {
    id: 4,
    name: "Cave 4",
    emplacements: [
      "Haut Derrière",
      "Haut Devant",
      "Milieu Haut Derrière",
      "Milieu Haut Devant",
      "Milieu Bas Derrière",
      "Milieu Bas Devant",
      "Bas Derrière",
      "Bas Devant",
      "Très Bas",
    ],
  },
];

const bottleTypes = ["Bouteille", "Demi-bouteille", "Magnum"];
const wineColors = ["Rouge", "Blanc", "Rosé"];
const countries = [
  "France",
  "Italie",
  "Espagne",
  "Argentine",
  "Australie",
  "Chili",
  "Afrique du Sud",
  "États-Unis",
  "Nouvelle-Zélande",
  "Allemagne",
  "Portugal",
  "Suisse",
  "Grèce",
  "Autres pays...",
];

const AjouterBouteille: React.FC = () => {
  const [nom, setNom] = useState("");
  const [annee, setAnnee] = useState("");
  const [quantite, setQuantite] = useState("");
  const [type, setType] = useState("");
  const [couleur, setCouleur] = useState("");
  const [pays, setPays] = useState("");
  const [caveId, setCaveId] = useState<number | undefined>(undefined);
  const [emplacement, setEmplacement] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const bottleData = {
      nom,
      annee,
      quantite: Number(quantite),
      type,
      couleur,
      pays,
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
        setNom("");
        setAnnee("");
        setQuantite("");
        setType("");
        setCouleur("");
        setPays("");
        setCaveId(undefined);
        setEmplacement("");
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

  const selectedCave = caves.find((c) => c.id === caveId);

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>Ajouter une Bouteille</Text>

          <VStack space={4}>
            <Box>
              <Text style={styles.label}>Nom de la bouteille :</Text>
              <Input
                placeholder="ex: Château Margaux"
                value={nom}
                onChangeText={setNom}
                backgroundColor="#fff8f0"
              />
            </Box>

            <Box>
              <Text style={styles.label}>Année :</Text>
              <Input
                placeholder="ex: 2015"
                keyboardType="numeric"
                value={annee}
                onChangeText={setAnnee}
                backgroundColor="#fff8f0"
              />
            </Box>

            <Box>
              <Text style={styles.label}>Quantité :</Text>
              <Input
                placeholder="ex: 12"
                keyboardType="numeric"
                value={quantite}
                onChangeText={setQuantite}
                backgroundColor="#fff8f0"
              />
            </Box>

            <Box>
              <Text style={styles.label}>Type :</Text>
              <Select
                selectedValue={type}
                minWidth="200"
                placeholder="Sélectionner le type"
                backgroundColor="#fff8f0"
                _selectedItem={{
                  bg: "gray.200",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={setType}
              >
                {bottleTypes.map((bt, index) => (
                  <Select.Item key={index} label={bt} value={bt} />
                ))}
              </Select>
            </Box>

            <Box>
              <Text style={styles.label}>Couleur du vin :</Text>
              <Select
                selectedValue={couleur}
                minWidth="200"
                placeholder="Sélectionner la couleur"
                backgroundColor="#fff8f0"
                _selectedItem={{
                  bg: "gray.200",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={setCouleur}
              >
                {wineColors.map((color, index) => (
                  <Select.Item key={index} label={color} value={color} />
                ))}
              </Select>
            </Box>

            <Box>
              <Text style={styles.label}>Pays :</Text>
              <Select
                selectedValue={pays}
                minWidth="200"
                placeholder="Sélectionner le pays"
                backgroundColor="#fff8f0"
                _selectedItem={{
                  bg: "gray.200",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={setPays}
              >
                {countries.map((country, index) => (
                  <Select.Item key={index} label={country} value={country} />
                ))}
              </Select>
            </Box>

            <Box>
              <Text style={styles.label}>Cave :</Text>
              <Select
                selectedValue={caveId !== undefined ? String(caveId) : ""}
                minWidth="200"
                placeholder="Sélectionner la cave"
                backgroundColor="#fff8f0"
                _selectedItem={{
                  bg: "gray.200",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={(itemValue) => {
                  if (itemValue) {
                    setCaveId(Number(itemValue));
                    setEmplacement("");
                  } else {
                    setCaveId(undefined);
                  }
                }}
              >
                {caves.map((cave) => (
                  <Select.Item
                    key={cave.id}
                    label={cave.name}
                    value={String(cave.id)}
                  />
                ))}
              </Select>
            </Box>

            {selectedCave && (
              <Box>
                <Text style={styles.label}>Emplacement :</Text>
                <Select
                  selectedValue={emplacement}
                  minWidth="200"
                  placeholder="Sélectionner l'emplacement"
                  backgroundColor="#fff8f0"
                  _selectedItem={{
                    bg: "gray.200",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  onValueChange={setEmplacement}
                >
                  {selectedCave.emplacements.map((emp, index) => (
                    <Select.Item key={index} label={emp} value={emp} />
                  ))}
                </Select>
              </Box>
            )}

            <Button
              mt={4}
              colorScheme="red"
              borderRadius="xl"
              onPress={handleSubmit}
              isLoading={loading}
              isLoadingText="Ajout..."
            >
              Ajouter la Bouteille
            </Button>
          </VStack>
        </ScrollView>
        <Navbar />
      </Box>
    </NativeBaseProvider>
  );
};

export default AjouterBouteille;
