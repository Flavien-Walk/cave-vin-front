// components/AjouterBouteille.tsx

import React, { useState } from "react";
import { ScrollView, Alert as RNAlert } from "react-native";
import {
  Box, Text, Input, Select, CheckIcon, Button, VStack, HStack, Icon, NativeBaseProvider
} from "native-base";
import { Dimensions } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/AjouterBouteilleStyles";
import Navbar from "./Navbar";

const BOTTLE_TYPES = ["Bouteille", "Demi-bouteille", "Magnum"];
const WINE_COLORS = ["Rouge", "Blanc", "Rosé"];
const COUNTRIES = [
  // Principaux
  "France",
  "Italie",
  "Argentine",
  "Espagne",
  "--- Autres ---",
  // Autres pays, par ordre alphabétique
  "Afrique du Sud",
  "Allemagne",
  "Angleterre",
  "Arménie",
  "Australie",
  "Autriche",
  "Brésil",
  "Bulgarie",
  "Canada",
  "Chili",
  "Chine",
  "Croatie",
  "États-Unis",
  "Géorgie",
  "Grèce",
  "Hongrie",
  "Inde",
  "Israël",
  "Japon",
  "Liban",
  "Luxembourg",
  "Macédoine",
  "Maroc",
  "Mexique",
  "Moldavie",
  "Nouvelle-Zélande",
  "Pays-Bas",
  "Portugal",
  "République Tchèque",
  "Roumanie",
  "Serbie",
  "Slovaquie",
  "Slovénie",
  "Suisse",
  "Thaïlande",
  "Tunisie",
  "Turquie",
  "Uruguay",
  "Autre"
];

const REGIONS = [
  // Grandes régions françaises (ordre classique + Côtes du Rhône en plus)
  "Bordeaux",
  "Bourgogne",
  "Champagne",
  "Vallée du Rhône",
  "Côtes du Rhône",
  "Alsace",
  "Languedoc",
  "Provence",
  "Loire",
  "Jura",
  "Savoie",
  "Corse",
  "Sud-Ouest",
  "--- Autres ---",
  // Autres régions en ordre alphabétique
  "Ain",
  "Allier",
  "Ardèche",
  "Auvergne",
  "Aveyron",
  "Bas-Rhin",
  "Beaujolais",
  "Bugey",
  "Cabardès",
  "Calvados",
  "Cantal",
  "Charentes",
  "Chinonais",
  "Côte Chalonnaise",
  "Côte de Beaune",
  "Côte de Nuits",
  "Côte Roannaise",
  "Côteaux d’Auvergne",
  "Coteaux du Lyonnais",
  "Coteaux du Quercy",
  "Coteaux du Verdon",
  "Côtes de Blaye",
  "Côtes de Bordeaux",
  "Côtes de Bourg",
  "Côtes de Duras",
  "Côtes de Gascogne",
  "Côtes du Forez",
  "Côtes du Marmandais",
  "Côtes du Ventoux",
  "Côtes du Vivarais",
  "Drôme",
  "Franche-Comté",
  "Gard",
  "Gers",
  "Haute-Garonne",
  "Hautes-Alpes",
  "Haute-Saône",
  "Hérault",
  "Landes",
  "Limoux",
  "Lorraine",
  "Lot",
  "Lot-et-Garonne",
  "Maconnais",
  "Malepère",
  "Marcillac",
  "Moselle",
  "Pays Nantais",
  "Pyrénées-Atlantiques",
  "Pyrénées-Orientales",
  "Roussillon",
  "Tarn",
  "Val de Loire",
  "Vendée",
  "Vin de Savoie",
  "Autre"
];


const APPELLATIONS = [
  // Chapeau : les principales grandes appellations françaises (ordre classique)
  "Saint-Julien",
  "Margaux",
  "Pauillac",
  "Saint-Estèphe",
  "Saint-Emilion",
  "Pomerol",
  "Graves",
  "Châteauneuf-du-Pape",
  "Hermitage",
  "Côte-Rôtie",
  "Côtes-du-Rhône",
  "Sancerre",
  "Pouilly-Fumé",
  "Chablis",
  "Meursault",
  "Volnay",
  "Pommard",
  "Gevrey-Chambertin",
  "Chambolle-Musigny",
  "Vosne-Romanée",
  "Corton",
  "Champagne",
  "--- Autres ---",
  // Autres appellations en ordre alphabétique
  "Ajaccio",
  "Aloxe-Corton",
  "Anjou",
  "Anjou-Villages",
  "Arbois",
  "Bandol",
  "Barsac",
  "Beaumes-de-Venise",
  "Beaune",
  "Bellet",
  "Bergerac",
  "Blanquette de Limoux",
  "Bordeaux",
  "Bourgogne Aligoté",
  "Bourgogne Passe-Tout-Grains",
  "Bugey",
  "Cabardès",
  "Cadillac",
  "Calvi",
  "Cahors",
  "Canon-Fronsac",
  "Cassís",
  "Chablis Grand Cru",
  "Chablis Premier Cru",
  "Chassagne-Montrachet",
  "Chasselas",
  "Châteaumeillant",
  "Chinon",
  "Clairette de Die",
  "Clos de Vougeot",
  "Collioure",
  "Condrieu",
  "Corbières",
  "Cornas",
  "Coteaux Champenois",
  "Coteaux d’Ancenis",
  "Coteaux de Bourg",
  "Coteaux de Gascogne",
  "Coteaux du Languedoc",
  "Coteaux du Lyonnais",
  "Coteaux du Quercy",
  "Coteaux du Tricastin",
  "Coteaux du Vendômois",
  "Côte Chalonnaise",
  "Côte de Beaune",
  "Côte de Nuits",
  "Côte Roannaise",
  "Côtes de Bergerac",
  "Côtes de Blaye",
  "Côtes de Bordeaux",
  "Côtes de Bourg",
  "Côtes de Duras",
  "Côtes de Gascogne",
  "Côtes de Marmandais",
  "Côtes de Millau",
  "Côtes du Forez",
  "Côtes du Jura",
  "Côtes du Marmandais",
  "Côtes du Ventoux",
  "Côtes du Vivarais",
  "Crémant d’Alsace",
  "Crémant de Bordeaux",
  "Crémant de Bourgogne",
  "Crémant de Die",
  "Crémant de Limoux",
  "Crémant de Loire",
  "Crémant du Jura",
  "Crozes-Hermitage",
  "Échezeaux",
  "Entre-Deux-Mers",
  "Faugères",
  "Figari",
  "Fitou",
  "Fontainebleau",
  "Fronton",
  "Gaillac",
  "Gascogne",
  "Gevrey-Chambertin",
  "Gigondas",
  "Graves Supérieures",
  "Grignan-les-Adhémar",
  "Haut-Médoc",
  "Irouléguy",
  "Jurançon",
  "Lalande-de-Pomerol",
  "La Clape",
  "Languedoc",
  "Languedoc Pic Saint-Loup",
  "Languedoc Grés de Montpellier",
  "Languedoc La Clape",
  "Languedoc Terrasses du Larzac",
  "Languedoc Minervois",
  "Lirac",
  "Listrac-Médoc",
  "Loupiac",
  "Maconnais",
  "Madiran",
  "Malepère",
  "Margaux",
  "Marsannay",
  "Maury",
  "Médoc",
  "Menetou-Salon",
  "Mercurey",
  "Minervois",
  "Monbazillac",
  "Montagne-Saint-Émilion",
  "Montlouis-sur-Loire",
  "Morey-Saint-Denis",
  "Moulis-en-Médoc",
  "Muscadet",
  "Muscadet Sèvre-et-Maine",
  "Muscat de Beaumes-de-Venise",
  "Muscat de Frontignan",
  "Muscat de Lunel",
  "Muscat de Mireval",
  "Muscat de Rivesaltes",
  "Muscat de Saint-Jean-de-Minervois",
  "Nuits-Saint-Georges",
  "Patrimonio",
  "Pauillac",
  "Pécharmant",
  "Picpoul de Pinet",
  "Pomerol",
  "Pouilly-Fuissé",
  "Pouilly-Fumé",
  "Pouilly-Loché",
  "Pouilly-sur-Loire",
  "Pouilly-Vinzelles",
  "Premier Cru",
  "Quarts-de-Chaume",
  "Quincy",
  "Rasteau",
  "Reuilly",
  "Riesling",
  "Rivesaltes",
  "Romanée-Conti",
  "Rosé des Riceys",
  "Roussette de Savoie",
  "Rully",
  "Saint-Amour",
  "Saint-Bris",
  "Saint-Chinian",
  "Saint-Émilion Grand Cru",
  "Saint-Estèphe",
  "Saint-Joseph",
  "Saint-Julien",
  "Saint-Nicolas-de-Bourgueil",
  "Saint-Péray",
  "Saint-Pourçain",
  "Saint-Véran",
  "Sancerre",
  "Santenay",
  "Saumur",
  "Saumur-Champigny",
  "Savennières",
  "Sauternes",
  "Seyssel",
  "Tavel",
  "Tursan",
  "Vacqueyras",
  "Vouvray",
  "Volnay",
  "Vosne-Romanée",
  "Autre"
];


const CAVES = [
  { id: 1, name: "Cave 1", emplacements: ["Haut Derrière", "Haut Devant", "1ère Clayette", "2ème Clayette", "3ème Clayette", "Milieu Derrière", "Milieu Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
  { id: 2, name: "Cave 2", emplacements: ["Haut Derrière", "Haut Devant", "1ère Clayette", "2ème Clayette", "3ème Clayette", "Milieu Derrière", "Milieu Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
  { id: 3, name: "Cave 3", emplacements: ["Haut Derrière", "Haut Devant", "1ère Clayette", "2ème Clayette", "3ème Clayette", "Milieu Derrière", "Milieu Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
  { id: 4, name: "Cave 4", emplacements: ["Haut Derrière", "Haut Devant", "Milieu Haut Derrière", "Milieu Haut Devant", "Milieu Bas Derrière", "Milieu Bas Devant", "Bas Derrière", "Bas Devant", "Très Bas"] },
];

const { width } = Dimensions.get("window");

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedCave = CAVES.find(c => c.id === caveId);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nom.trim()) newErrors.nom = "Nom du vin obligatoire";
    if (!producteur.trim()) newErrors.producteur = "Producteur obligatoire";
    if (!region) newErrors.region = "Région obligatoire";
    if (!appellation) newErrors.appellation = "Appellation obligatoire";
    if (!annee) newErrors.annee = "Année obligatoire";
    if (!quantite) newErrors.quantite = "Quantité obligatoire";
    if (!type) newErrors.type = "Type obligatoire";
    if (!couleur) newErrors.couleur = "Couleur obligatoire";
    if (!pays) newErrors.pays = "Pays obligatoire";
    if (!caveId) newErrors.cave = "Cave obligatoire";
    if (!emplacement) newErrors.emplacement = "Emplacement obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      RNAlert.alert("Champs manquants", "Merci de remplir tous les champs obligatoires.");
      return;
    }

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
      prixAchat: prixAchat ? parseFloat(prixAchat) : undefined,
      consommerAvant,
      cave: CAVES.find(c => c.id === caveId)?.name || "",
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
        setConsommerAvant(""); setCaveId(undefined); setEmplacement(""); setErrors({});
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

  const renderError = (field: string) =>
    errors[field] ? <Text style={{ color: "red", fontSize: 12 }}>{errors[field]}</Text> : null;

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
  <Text style={styles.welcomeTitle}>Ajouter une Bouteille</Text>
  <Text style={styles.welcomeSubtitle}>Complétez les champs pour enrichir votre cave</Text>
</Box>


          <VStack space={4}>
            <Box>{renderLabel("wine-outline", "Nom du vin :")}<Input value={nom} onChangeText={setNom} backgroundColor="#fff8f0" placeholder="ex: Château Margaux" />{renderError("nom")}</Box>
            <Box>{renderLabel("person-outline", "Producteur :")}<Input value={producteur} onChangeText={setProducteur} backgroundColor="#fff8f0" placeholder="ex: Domaine Dupont" />{renderError("producteur")}</Box>
            <Box>{renderLabel("map-outline", "Région :")}<Select selectedValue={region} onValueChange={setRegion} placeholder="Sélectionner la région" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{REGIONS.map(r => <Select.Item key={r} label={r} value={r} />)}</Select>{renderError("region")}</Box>
            <Box>{renderLabel("ribbon-outline", "Appellation :")}<Select selectedValue={appellation} onValueChange={setAppellation} placeholder="Sélectionner l'appellation" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{APPELLATIONS.map(a => <Select.Item key={a} label={a} value={a} />)}</Select>{renderError("appellation")}</Box>
            <Box>{renderLabel("calendar-outline", "Année :")}<Input keyboardType="numeric" value={annee} onChangeText={setAnnee} backgroundColor="#fff8f0" placeholder="ex: 2015" />{renderError("annee")}</Box>
            <Box>{renderLabel("cube-outline", "Quantité :")}<Input keyboardType="numeric" value={quantite} onChangeText={setQuantite} backgroundColor="#fff8f0" placeholder="ex: 12" />{renderError("quantite")}</Box>
            <Box>{renderLabel("cube", "Type :")}<Select selectedValue={type} onValueChange={setType} placeholder="Sélectionner le type" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{BOTTLE_TYPES.map(bt => <Select.Item key={bt} label={bt} value={bt} />)}</Select>{renderError("type")}</Box>
            <Box>{renderLabel("color-palette-outline", "Couleur du vin :")}<Select selectedValue={couleur} onValueChange={setCouleur} placeholder="Sélectionner la couleur" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{WINE_COLORS.map(c => <Select.Item key={c} label={c} value={c} />)}</Select>{renderError("couleur")}</Box>
            <Box>{renderLabel("flag-outline", "Pays :")}<Select selectedValue={pays} onValueChange={setPays} placeholder="Sélectionner le pays" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{COUNTRIES.map(p => <Select.Item key={p} label={p} value={p} />)}</Select>{renderError("pays")}</Box>
            <Box>{renderLabel("cash-outline", "Prix d'achat (€) :")}<Input keyboardType="decimal-pad" value={prixAchat} onChangeText={setPrixAchat} backgroundColor="#fff8f0" placeholder="ex: 32.50" /></Box>
            <Box>{renderLabel("time-outline", "À consommer avant :")}<Input value={consommerAvant} onChangeText={setConsommerAvant} backgroundColor="#fff8f0" placeholder="ex: 2030" /></Box>
            <Box>{renderLabel("home-outline", "Cave :")}<Select selectedValue={caveId?.toString()} onValueChange={val => { setCaveId(Number(val)); setEmplacement(""); }} placeholder="Sélectionner la cave" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{CAVES.map(c => <Select.Item key={c.id} label={c.name} value={c.id.toString()} />)}</Select>{renderError("cave")}</Box>
            {selectedCave && <Box>{renderLabel("location-outline", "Emplacement :")}<Select selectedValue={emplacement} onValueChange={setEmplacement} placeholder="Sélectionner l'emplacement" backgroundColor="#fff8f0" _selectedItem={{ bg: "gray.200", endIcon: <CheckIcon size="5" /> }}>{selectedCave.emplacements.map((e, i) => <Select.Item key={i} label={e} value={e} />)}</Select>{renderError("emplacement")}</Box>}
            <Button mt={4} colorScheme="red" borderRadius="xl" onPress={handleSubmit} isLoading={loading} isLoadingText="Ajout...">Ajouter la Bouteille</Button>
          </VStack>
        </ScrollView>
        <Navbar />
      </Box>
    </NativeBaseProvider>
  );
};

export default AjouterBouteille;
