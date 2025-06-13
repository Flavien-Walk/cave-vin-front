import React, { useEffect, useState,  } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/NotesStyles";
import Navbar from "../components/Navbar";

interface NotePerso {
  texte: string;
  note: number;
  date?: string;
}

interface Bottle {
  _id: string;
  nom: string;
  annee?: string;
  producteur?: string;
  couleur?: string;
  type?: string;
  region?: string;
  appellation?: string;
  pays?: string;
  prixAchat?: number;
  consommerAvant?: string;
  notePerso?: NotePerso; // <--- une seule note/avis par vin
}

const API_URL = "https://cave-vin-back.onrender.com/api/bottles";

const couleurs = ["Rouge", "Blanc", "Rosé"];
const formats = ["Bouteille", "Demi-bouteille", "Magnum"];
const notes = [3, 4, 5];

type FiltreType = { type: "couleur" | "format" | "note"; value: string | number } | null;

const Notes: React.FC = () => {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<FiltreType>(null);

  // Modal
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [noteEtoile, setNoteEtoile] = useState(0);
  const [avis, setAvis] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer la liste des bouteilles
  const fetchBottles = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setBottles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBottles();
  }, []);

  // Filtres/search appliqués
  const filteredBottles = bottles.filter((bottle) => {
    const matchNom = bottle.nom?.toLowerCase().includes(search.toLowerCase());
    let matchFiltre = true;
    if (filtre) {
      if (filtre.type === "couleur") {
        matchFiltre = bottle.couleur === filtre.value;
      } else if (filtre.type === "format") {
        matchFiltre = bottle.type === filtre.value;
      } else if (filtre.type === "note") {
        const note = bottle.notePerso?.note ?? 0;
        matchFiltre = note >= (filtre.value as number);
      }
    }
    return matchNom && matchFiltre;
  });

  // PUT vers /api/bottles/:id/note
  const handleAddNote = async () => {
    if (!selectedBottle) return;
    if (!noteEtoile || !avis.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/${selectedBottle._id}/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texte: avis.trim(),
          note: noteEtoile
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout/modification de la note");
      setModalVisible(false);
      setNoteEtoile(0);
      setAvis("");
      fetchBottles();
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'enregistrer la note. Réessaie plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion filtre unique
  const handleFiltre = (type: "couleur" | "format" | "note", value: string | number) => {
    if (filtre && filtre.type === type && filtre.value === value) {
      setFiltre(null); // Désactive si déjà actif
    } else {
      setFiltre({ type, value });
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View
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
  <Text style={styles.welcomeTitle}>Tous les vins notés</Text>
  <Text style={styles.welcomeSubtitle}>
    Découvre les bouteilles ajoutées par les utilisateurs.
  </Text>
</View>



      {/* Barre de recherche */}
      <View style={styles.filterRow}>
        <Ionicons name="search-outline" size={18} color="#7a5c5c" />
        <TextInput
          placeholder="Recherche un vin..."
          style={styles.searchBar}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#ad9797"
        />
      </View>

      {/* Barre de filtres juste en dessous */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Couleurs */}
          <TouchableOpacity onPress={() => setFiltre(null)} style={[styles.filterBtn, !filtre && styles.filterBtnActive]}>
            <Text style={[styles.filterText, !filtre && styles.filterTextActive]}>Tous</Text>
          </TouchableOpacity>
          {couleurs.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => handleFiltre("couleur", c)}
              style={[styles.filterBtn, filtre?.type === "couleur" && filtre.value === c && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filtre?.type === "couleur" && filtre.value === c && styles.filterTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
          {/* Formats */}
          {formats.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => handleFiltre("format", f)}
              style={[styles.filterBtn, filtre?.type === "format" && filtre.value === f && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filtre?.type === "format" && filtre.value === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
          {/* Notes */}
          {notes.map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => handleFiltre("note", n)}
              style={[styles.filterBtn, filtre?.type === "note" && filtre.value === n && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filtre?.type === "note" && filtre.value === n && styles.filterTextActive]}>
                {n} ⭐ +
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bloc principal qui occupe tout l'espace restant */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#6e3b3b" style={{ marginTop: 30 }} />
        ) : filteredBottles.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#ad9797", fontSize: 15, textAlign: "center" }}>
              Aucun vin trouvé...
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.cardsWrapper}
            keyboardShouldPersistTaps="handled"
          >
            {filteredBottles.map((bottle) => (
              <TouchableOpacity
                key={bottle._id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedBottle(bottle);
                  setModalVisible(true);
                  setNoteEtoile(bottle.notePerso?.note || 0);
                  setAvis(bottle.notePerso?.texte || "");
                }}
              >
                <Text style={styles.cardTitle}>{bottle.nom}</Text>
                <Text style={styles.cardDetails}>
                  {bottle.annee ? `Année : ${bottle.annee}` : "Année inconnue"}
                </Text>
                <Text style={styles.cardDetails}>
                  {bottle.producteur ? `Producteur : ${bottle.producteur}` : "Producteur inconnu"}
                </Text>
                <Text style={styles.cardTag}>{bottle.couleur ? `Couleur : ${bottle.couleur}` : "Couleur inconnue"}</Text>
                <Text style={styles.cardTag}>{bottle.type ? `Format : ${bottle.type}` : "Format classique"}</Text>
                {bottle.notePerso ? (
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons key={i} name={i < (bottle.notePerso?.note || 0) ? "star" : "star-outline"} size={16} color="#D7B440" />
                    ))}
                    <Text style={{ marginLeft: 6, color: "#7a5c5c", fontWeight: "bold" }}>
                      {bottle.notePerso.note}/5
                    </Text>
                  </View>
                ) : (
                  <Text style={{ color: "#ad9797", fontSize: 12, marginTop: 4 }}>Pas encore noté</Text>
                )}
                {bottle.notePerso?.texte ? (
                  <Text style={{ color: "#9e7550", marginTop: 5, fontStyle: "italic", fontSize: 13, textAlign: "center" }} numberOfLines={2}>
                    “{bottle.notePerso.texte}”
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* MODAL pour ajouter/modifier note */}
      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalBg}>
    <View
      style={[
        styles.modalContent,
        {
          alignSelf: "center",
          width: width > 500 ? 430 : "92%",
          minWidth: 250,
          maxWidth: 500,
        },
      ]}
    >
      <Text style={styles.modalTitle}>Ajouter ou modifier ta note</Text>
      <Text style={styles.modalWineName}>{selectedBottle?.nom}</Text>
      <Text style={styles.modalLabel}>Note (étoiles)</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setNoteEtoile(i)}>
            <Ionicons name={i <= noteEtoile ? "star" : "star-outline"} size={32} color="#D7B440" />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.modalLabel}>Ton avis</Text>
      <TextInput
        style={styles.modalInput}
        placeholder="Ex : Magnifique bouteille, tannins élégants..."
        value={avis}
        onChangeText={setAvis}
        multiline
      />
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 14 }}>
        <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
          <Text style={styles.modalBtnTextCancel}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalBtn}
          onPress={handleAddNote}
          disabled={isSubmitting || !noteEtoile || !avis.trim()}
        >
          <Text style={styles.modalBtnText}>{isSubmitting ? "Envoi..." : "Enregistrer"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      <Navbar />
    </View>
  );
};

export default Notes;
