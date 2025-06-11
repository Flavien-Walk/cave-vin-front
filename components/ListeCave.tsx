// components/ListeCave.tsx

import React, { useState, useEffect } from "react";
import { ScrollView, Alert as RNAlert } from "react-native";
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Input,
  Select,
  CheckIcon,
  Divider,
  Button,
  Modal,
  FormControl,
  NativeBaseProvider,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import styles from "../styles/ListeCaveStyles";

const API_URL = "https://cave-vin-back.onrender.com/api/bottles";
const bottleTypes = ["Bouteille", "Demi-bouteille", "Magnum"];
const wineColors = ["Rouge", "Blanc", "Rosé"];
const caves = ["Cave 1", "Cave 2", "Cave 3", "Cave 4"];

interface Bottle {
  _id: string;
  nom: string;
  annee: string;
  type: string;
  couleur: string;
  cave: string;
  emplacement: string;
  quantite: number;
}

const ListeCave: React.FC = () => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCave, setSelectedCave] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [currentBottle, setCurrentBottle] = useState<Bottle | null>(null);

  useEffect(() => {
    fetchBottles();
  }, []);

  const fetchBottles = async () => {
    try {
      const response = await fetch(API_URL);
      const data: Bottle[] = await response.json();
      setBottles(data);

      const uniqueYears = Array.from(
        new Set(data.map((b: Bottle) => b.annee))
      ).filter(Boolean) as string[];

      setYears(uniqueYears.sort());
    } catch (error) {
      console.error("Erreur lors du chargement des bouteilles :", error);
    }
  };

  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredBottles = bottles.filter((bottle) => {
    const nameNormalized = normalize(bottle.nom);
    const searchNormalized = normalize(searchText);

    return (
      (nameNormalized.includes(searchNormalized) ||
        (bottle.annee && bottle.annee.includes(searchText))) &&
      (!selectedType || bottle.type === selectedType) &&
      (!selectedColor || bottle.couleur === selectedColor) &&
      (!selectedCave || bottle.cave === selectedCave) &&
      (!selectedYear || bottle.annee === selectedYear)
    );
  });

  const resetFilters = () => {
    setSearchText("");
    setSelectedType("");
    setSelectedColor("");
    setSelectedCave("");
    setSelectedYear("");
  };

  const handleEditBottle = (bottle: Bottle) => {
    setCurrentBottle(bottle);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (!currentBottle) return;
    try {
      const response = await fetch(`${API_URL}/${currentBottle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBottle),
      });
      if (response.ok) {
        RNAlert.alert("Succès", "Bouteille mise à jour !");
        fetchBottles();
        setShowModal(false);
      } else {
        RNAlert.alert("Erreur", "Impossible de mettre à jour la bouteille.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      RNAlert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  const handleDeleteBottle = async (bottleId: string) => {
    try {
      const response = await fetch(`${API_URL}/${bottleId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        RNAlert.alert("Succès", "Bouteille supprimée.");
        setBottles(bottles.filter((b) => b._id !== bottleId));
      } else {
        RNAlert.alert("Erreur", "Impossible de supprimer la bouteille.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      RNAlert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>🍷 Ma Cave à Vin</Text>

          {/* Barre de recherche */}
          <Input
            placeholder="🔍 Rechercher une bouteille..."
            value={searchText}
            onChangeText={setSearchText}
            backgroundColor="#fffaf0"
            borderRadius="xl"
            mb={4}
          />

          {/* Filtres */}
          <Box mb={4} p={3} bg="#fffaf0" borderRadius="xl" shadow={2}>
            <VStack space={3}>
              {/* Type et Couleur */}
              <HStack space={3} justifyContent="space-between">
                <Select
                  selectedValue={selectedType}
                  placeholder="Type"
                  flex={1}
                  backgroundColor="#ffffff"
                  borderRadius="md"
                  _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}
                  onValueChange={setSelectedType}
                >
                  {bottleTypes.map((type) => (
                    <Select.Item key={type} label={type} value={type} />
                  ))}
                </Select>
                <Select
                  selectedValue={selectedColor}
                  placeholder="Couleur"
                  flex={1}
                  backgroundColor="#ffffff"
                  borderRadius="md"
                  _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}
                  onValueChange={setSelectedColor}
                >
                  {wineColors.map((color) => (
                    <Select.Item key={color} label={color} value={color} />
                  ))}
                </Select>
              </HStack>

              {/* Cave et Année */}
              <HStack space={3} justifyContent="space-between">
                <Select
                  selectedValue={selectedCave}
                  placeholder="Cave"
                  flex={1}
                  backgroundColor="#ffffff"
                  borderRadius="md"
                  _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}
                  onValueChange={setSelectedCave}
                >
                  {caves.map((cave) => (
                    <Select.Item key={cave} label={cave} value={cave} />
                  ))}
                </Select>
                <Select
                  selectedValue={selectedYear}
                  placeholder="Année"
                  flex={1}
                  backgroundColor="#ffffff"
                  borderRadius="md"
                  _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}
                  onValueChange={setSelectedYear}
                >
                  {years.map((year) => (
                    <Select.Item key={year} label={year} value={year} />
                  ))}
                </Select>
              </HStack>

              <Button onPress={resetFilters} mt={2} colorScheme="gray" borderRadius="md">
                🔄 Réinitialiser les filtres
              </Button>
            </VStack>
          </Box>

          {/* Liste des bouteilles */}
          <VStack space={4}>
            {filteredBottles.map((bottle) => (
              <Box key={bottle._id} style={styles.card}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack space={1} flexShrink={1}>
                    <Text style={styles.bottleName}>🍇 {bottle.nom}</Text>
                    <Text style={styles.details}>
                      {bottle.annee} • {bottle.type} • {bottle.couleur}
                    </Text>
                    <Text style={styles.details}>
                      📍 {bottle.cave} - {bottle.emplacement}
                    </Text>
                    <Text style={styles.details}>
                      📦 Quantité : {bottle.quantite}
                    </Text>
                  </VStack>
                  <HStack space={2}>
                    <Button size="sm" colorScheme="blue" onPress={() => handleEditBottle(bottle)}>
                      ✏️
                    </Button>
                    <Button size="sm" colorScheme="red" onPress={() => handleDeleteBottle(bottle._id)}>
                      🗑️
                    </Button>
                  </HStack>
                </HStack>
                <Divider my={2} bg="gray.300" />
              </Box>
            ))}

            {filteredBottles.length === 0 && (
              <Text textAlign="center" mt={10} fontStyle="italic" color="gray.500">
                Aucune bouteille trouvée.
              </Text>
            )}
          </VStack>
        </ScrollView>
        <Navbar />

        {/* Modal d'édition */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Modifier la Bouteille</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Nom</FormControl.Label>
                <Input
                  value={currentBottle?.nom}
                  onChangeText={(text) =>
                    setCurrentBottle({ ...currentBottle!, nom: text })
                  }
                />
              </FormControl>
              <FormControl mt={2}>
                <FormControl.Label>Année</FormControl.Label>
                <Input
                  value={currentBottle?.annee}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setCurrentBottle({ ...currentBottle!, annee: text })
                  }
                />
              </FormControl>
              <FormControl mt={2}>
                <FormControl.Label>Quantité</FormControl.Label>
                <Input
                  value={currentBottle?.quantite?.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setCurrentBottle({
                      ...currentBottle!,
                      quantite: parseInt(text) || 0,
                    })
                  }
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button colorScheme="blue" onPress={handleSaveEdit}>
                  Sauvegarder
                </Button>
                <Button variant="ghost" colorScheme="coolGray" onPress={() => setShowModal(false)}>
                  Annuler
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
};

export default ListeCave;
