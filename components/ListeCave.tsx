// components/ListeCave.tsx

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ScrollView, Alert as RNAlert, Dimensions } from "react-native";
import {
  Box, Text, VStack, HStack, Input, Select, CheckIcon, Divider, Button,
  Modal, FormControl, NativeBaseProvider, Icon, AlertDialog, 
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "./Navbar";
import styles from "../styles/ListeCaveStyles";

const API_URL = "https://cave-vin-back.onrender.com/api/bottles";
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

const initialFilters = {
  searchText: "",
  selectedType: "",
  selectedColor: "",
  selectedCave: "",
  selectedYear: "",
  consumeFilter: "all"
};
type FilterKey = keyof typeof initialFilters;

const { width } = Dimensions.get("window");

const ListeCave: React.FC = () => {
  const [bottles, setBottles] = useState<any[]>([]);
  const [filters, setFilters] = useState<typeof initialFilters>(initialFilters);
  const [showModal, setShowModal] = useState(false);
  const [currentBottle, setCurrentBottle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [bottleToDelete, setBottleToDelete] = useState<string | null>(null);
  const cancelRef = useRef(null);

  const normalize = useCallback((text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), []);

  const isUrgent = useCallback((b: any) =>
    b.consommerAvant && parseInt(b.consommerAvant) <= new Date().getFullYear(), []);

  const years = useMemo(() =>
    [...new Set(bottles.map(b => b.annee))].filter(Boolean).sort(), [bottles]);

  const filteredBottles = useMemo(() => bottles.filter(b => {
    const match = normalize(b.nom).includes(normalize(filters.searchText)) || b.annee?.includes(filters.searchText);
    return match &&
      (!filters.selectedType || b.type === filters.selectedType) &&
      (!filters.selectedColor || b.couleur === filters.selectedColor) &&
      (!filters.selectedCave || b.cave === filters.selectedCave) &&
      (!filters.selectedYear || b.annee === filters.selectedYear) &&
      (filters.consumeFilter === "all" || isUrgent(b));
  }), [bottles, filters, normalize, isUrgent]);

  const updateFilter = (k: FilterKey, v: string) => setFilters(prev => ({ ...prev, [k]: v }));
  const resetFilters = () => setFilters(initialFilters);

  const fetchBottles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setBottles(await res.json());
    } catch {
      setError("Impossible de charger les bouteilles");
    } finally {
      setIsLoading(false);
    }
  };

  const saveBottle = async () => {
    if (!currentBottle) return;
    try {
      const res = await fetch(`${API_URL}/${currentBottle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBottle),
      });
      if (res.ok) {
        RNAlert.alert("Succès", "Bouteille mise à jour");
        fetchBottles();
        closeModal();
      } else RNAlert.alert("Erreur", "Mise à jour échouée");
    } catch {
      RNAlert.alert("Erreur", "Problème de connexion");
    }
  };

  const deleteBottle = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) setBottles(prev => prev.filter(b => b._id !== id));
    } finally {
      setShowDeleteAlert(false);
      setBottleToDelete(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentBottle(null);
  };

  useEffect(() => {
    fetchBottles();
  }, []);

  const selectedCave = CAVES.find(c => c.name === currentBottle?.cave);
  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 40 }}>
         <Box
  style={[
    styles.welcomeBox,
    {
      alignSelf: "center",
      width: width > 500 ? 500 : "90%",
      minWidth: 250,
      maxWidth: 500,
    },
  ]}
>
  <Text style={styles.welcomeTitle}>Ma Cave à Vin</Text>
  <Text style={styles.welcomeSubtitle}>
    Retrouvez, triez et gérez facilement toutes vos bouteilles 🍷
  </Text>
</Box>



          <Input
            placeholder="Rechercher..."
            value={filters.searchText}
            onChangeText={t => updateFilter("searchText", t)}
            bg="#fffaf0"
            borderRadius="xl"
            mb={4}
          />

          <VStack bg="#fffaf0" borderRadius="xl" shadow={2} p={3} mb={4} space={3}>
            {["selectedType", "selectedColor", "selectedCave", "selectedYear"].map((key) => (
              <Select
                key={key}
                selectedValue={filters[key as FilterKey]}
                placeholder={
                  key === "selectedType" ? "Type" :
                  key === "selectedColor" ? "Couleur" :
                  key === "selectedCave" ? "Cave" : "Année"
                }
                borderWidth={1}
                borderColor="#ccc"
                borderRadius="xl"
                px={3}
                py={2}
                bg="#fff"
                _item={{ _pressed: { bg: "#f3e8d3" }, _text: { color: "#6e3b3b" } }}
                onValueChange={(value) => updateFilter(key as FilterKey, value)}
              >
                {(key === "selectedType"
                  ? BOTTLE_TYPES
                  : key === "selectedColor"
                  ? WINE_COLORS
                  : key === "selectedCave"
                  ? CAVES.map(c => c.name)
                  : years
                ).map((value) => (
                  <Select.Item key={value} label={value} value={value} />
                ))}
              </Select>
            ))}

            <Select
              selectedValue={filters.consumeFilter}
              placeholder="À consommer"
              borderWidth={1}
              borderColor="#ccc"
              borderRadius="xl"
              px={3}
              py={2}
              bg="#fff"
              _item={{ _pressed: { bg: "#f3e8d3" }, _text: { color: "#6e3b3b" } }}
              onValueChange={(v) => updateFilter("consumeFilter", v)}
            >
              <Select.Item label="Toutes" value="all" />
              <Select.Item label="À consommer rapidement" value="urgent" />
            </Select>

            <HStack space={2}>
              <Button flex={1} onPress={resetFilters} colorScheme="gray">Réinitialiser</Button>
              <Button
            flex={1}
            bg="#6e3b3b"
            _pressed={{ bg: "#a05252" }}
            _text={{ color: "#fffaf0", fontWeight: "bold" }}
             onPress={fetchBottles}
            >
            Actualiser
            </Button>

            </HStack>
          </VStack>

          {error && <Text style={{ color: "red", textAlign: "center", marginBottom: 8 }}>{error}</Text>}

          {isLoading ? (
            <Text style={{ textAlign: "center", color: "#999" }}>Chargement...</Text>
          ) : filteredBottles.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#999" }}>Aucune bouteille trouvée.</Text>
          ) : (
            <VStack space={4}>
              {filteredBottles.map((bottle) => (
                <Box key={bottle._id} style={styles.card}>
                  <HStack justifyContent="space-between">
                    <VStack flexShrink={1} space={1}>
                      <HStack alignItems="center">
                        <Icon as={Ionicons} name="wine-outline" mr={1} />
                        <Text style={styles.bottleName}>{bottle.nom}</Text>
                        {isUrgent(bottle) && <Icon as={Ionicons} name="warning" color="red.500" ml={2} />}
                      </HStack>
                      <Text style={styles.details}>{bottle.annee} • {bottle.type} • {bottle.couleur}</Text>
                      {[bottle.appellation, bottle.region].filter(Boolean).length > 0 && (
                        <Text style={styles.details}><Icon as={Ionicons} name="ribbon-outline" mr={1} />{[bottle.appellation, bottle.region].filter(Boolean).join(" • ")}</Text>
                      )}
                      {[bottle.producteur, bottle.pays].filter(Boolean).length > 0 && (
                        <Text style={styles.details}><Icon as={Ionicons} name="person-outline" mr={1} />{[bottle.producteur, bottle.pays].filter(Boolean).join(" • ")}</Text>
                      )}
                      <Text style={styles.details}><Icon as={Ionicons} name="cube-outline" mr={1} />{bottle.quantite} bouteille{bottle.quantite > 1 ? "s" : ""} {bottle.prixAchat ? ` • ${bottle.prixAchat} €` : ""}</Text>
                      <Text style={styles.details}><Icon as={Ionicons} name="location-outline" mr={1} />{bottle.cave} - {bottle.emplacement}</Text>
                      {bottle.consommerAvant && (
                        <Text style={[styles.details, isUrgent(bottle) && { color: "red" }]}>
                          <Icon as={Ionicons} name="alarm-outline" mr={1} />À consommer avant : {bottle.consommerAvant}
                        </Text>
                      )}
                    </VStack>
                    <VStack space={2}>
                      <Button size="sm" colorScheme="blue" onPress={() => { setCurrentBottle(bottle); setShowModal(true); }}>✏️</Button>
                      <Button size="sm" colorScheme="red" onPress={() => { setBottleToDelete(bottle._id); setShowDeleteAlert(true); }}>🗑️</Button>
                    </VStack>
                  </HStack>
                  <Divider my={2} />
                </Box>
              ))}
            </VStack>
          )}

          {/* MODAL : modification bouteille */}
<Modal isOpen={showModal} onClose={closeModal}>
  <Modal.Content bg="#fffaf0" borderRadius="xl">
    <Modal.CloseButton />
    <Modal.Header bg="#6e3b3b" borderTopRadius="xl">
      <Text color="#fffaf0" fontWeight="bold">Modifier la Bouteille</Text>
    </Modal.Header>
    <Modal.Body>
      <VStack space={3}>
        <Input
          placeholder="Nom du vin"
          bg="#fff"
          borderRadius="xl"
          value={currentBottle?.nom}
          onChangeText={t => setCurrentBottle({ ...currentBottle, nom: t })}
        />
        <Input
          placeholder="Producteur"
          bg="#fff"
          borderRadius="xl"
          value={currentBottle?.producteur}
          onChangeText={t => setCurrentBottle({ ...currentBottle, producteur: t })}
        />
        <Select
          placeholder="Région"
          bg="#fff"
          borderRadius="xl"
          selectedValue={currentBottle?.region}
          onValueChange={v => setCurrentBottle({ ...currentBottle, region: v })}
        >
          {REGIONS.map(r => (
            <Select.Item key={r} label={r} value={r} _text={{ color: "#6e3b3b" }} />
          ))}
        </Select>
        <Select
          placeholder="Appellation"
          bg="#fff"
          borderRadius="xl"
          selectedValue={currentBottle?.appellation}
          onValueChange={v => setCurrentBottle({ ...currentBottle, appellation: v })}
        >
          {APPELLATIONS.map(a => (
            <Select.Item key={a} label={a} value={a} _text={{ color: "#6e3b3b" }} />
          ))}
        </Select>
        <Input
          placeholder="Année"
          bg="#fff"
          borderRadius="xl"
          keyboardType="numeric"
          value={currentBottle?.annee}
          onChangeText={t => setCurrentBottle({ ...currentBottle, annee: t })}
        />
        <Input
          placeholder="Quantité"
          bg="#fff"
          borderRadius="xl"
          keyboardType="numeric"
          value={currentBottle?.quantite?.toString()}
          onChangeText={t => setCurrentBottle({ ...currentBottle, quantite: Number(t) })}
        />
        <Select
          placeholder="Type"
          bg="#fff"
          borderRadius="xl"
          selectedValue={currentBottle?.type}
          onValueChange={v => setCurrentBottle({ ...currentBottle, type: v })}
        >
          {BOTTLE_TYPES.map(t => (
            <Select.Item key={t} label={t} value={t} _text={{ color: "#6e3b3b" }} />
          ))}
        </Select>
        <Select
          placeholder="Couleur"
          bg="#fff"
          borderRadius="xl"
          selectedValue={currentBottle?.couleur}
          onValueChange={v => setCurrentBottle({ ...currentBottle, couleur: v })}
        >
          {WINE_COLORS.map(c => (
            <Select.Item key={c} label={c} value={c} _text={{ color: "#6e3b3b" }} />
          ))}
        </Select>
        <Select
          placeholder="Pays"
          bg="#fff"
          borderRadius="xl"
          selectedValue={currentBottle?.pays}
          onValueChange={v => setCurrentBottle({ ...currentBottle, pays: v })}
        >
          {COUNTRIES.map(c => (
            <Select.Item key={c} label={c} value={c} _text={{ color: "#6e3b3b" }} />
          ))}
        </Select>
        <Input
          placeholder="Prix d'achat (€)"
          bg="#fff"
          borderRadius="xl"
          keyboardType="decimal-pad"
          value={currentBottle?.prixAchat?.toString()}
          onChangeText={t => setCurrentBottle({ ...currentBottle, prixAchat: parseFloat(t) })}
        />
        <Input
          placeholder="À consommer avant"
          bg="#fff"
          borderRadius="xl"
          value={currentBottle?.consommerAvant}
          onChangeText={t => setCurrentBottle({ ...currentBottle, consommerAvant: t })}
        />
        <Select
          placeholder="Cave"
          bg="#fff"
          borderRadius="xl"
          selectedValue={CAVES.find(c => c.name === currentBottle?.cave)?.id.toString()}
          onValueChange={(val) => {
            const cave = CAVES.find(c => c.id.toString() === val);
            setCurrentBottle({ ...currentBottle, cave: cave?.name || "", emplacement: "" });
          }}
        >
          {CAVES.map(c => (
            <Select.Item key={c.id} label={c.name} value={c.id.toString()} _text={{ color: "#6e3b3b" }} />
          ))}
        </Select>
        {selectedCave && (
          <Select
            placeholder="Emplacement"
            bg="#fff"
            borderRadius="xl"
            selectedValue={currentBottle?.emplacement}
            onValueChange={v => setCurrentBottle({ ...currentBottle, emplacement: v })}
          >
            {selectedCave.emplacements.map(e => (
              <Select.Item key={e} label={e} value={e} _text={{ color: "#6e3b3b" }} />
            ))}
          </Select>
        )}
      </VStack>
    </Modal.Body>
    <Modal.Footer bg="#fffaf0" borderBottomRadius="xl">
      <Button.Group space={2}>
        <Button
          bg="#6e3b3b"
          _pressed={{ bg: "#a05252" }}
          _text={{ color: "#fffaf0", fontWeight: "bold" }}
          onPress={saveBottle}
        >
          Sauvegarder
        </Button>
        <Button variant="ghost" _text={{ color: "#6e3b3b" }} onPress={closeModal}>
          Annuler
        </Button>
      </Button.Group>
    </Modal.Footer>
  </Modal.Content>
</Modal>


          {/* ALERT DIALOG SUPPRESSION */}
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={showDeleteAlert}
            onClose={() => setShowDeleteAlert(false)}
          >
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>Supprimer la bouteille</AlertDialog.Header>
              <AlertDialog.Body>
                Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette bouteille ?
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button variant="ghost" ref={cancelRef} onPress={() => setShowDeleteAlert(false)}>Annuler</Button>
                  <Button colorScheme="red" onPress={() => { if (bottleToDelete) deleteBottle(bottleToDelete); }}>Supprimer</Button>
                </Button.Group>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </ScrollView>
        <Navbar />
      </Box>
    </NativeBaseProvider>
  );
};

export default ListeCave;
