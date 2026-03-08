import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../src/constants';
import { useBottleStore } from '../../src/stores';
import { Input, Button } from '../../src/components/ui';

const COULEURS = ['rouge', 'blanc', 'rosé', 'effervescent', 'moelleux', 'autre'];
const TYPES = ['bouteille', 'demi', 'magnum', 'jéroboam', 'autre'];
const PAYS = ['France', 'Italie', 'Espagne', 'Portugal', 'Allemagne', 'Autriche', 'Argentine', 'Chili', 'États-Unis', 'Australie', 'Afrique du Sud', 'Nouvelle-Zélande', 'Géorgie', 'Grèce', 'Hongrie', 'Autre'];
const CAVES = ['Cave 1', 'Cave 2', 'Cave 3', 'Cave 4'];
const EMPLACEMENTS = Array.from({ length: 10 }, (_, i) => `Emplacement ${i + 1}`);

const STEP_LABELS = ['Essentiel', 'Détails', 'Rangement'];

export default function AddScreen() {
  const addBottle = useBottleStore((s) => s.addBottle);
  const [step, setStep] = useState(0);
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1
  const [nom, setNom] = useState('');
  const [producteur, setProducteur] = useState('');
  const [annee, setAnnee] = useState('');
  const [couleur, setCouleur] = useState('rouge');
  const [quantite, setQuantite] = useState('1');

  // Step 2
  const [region, setRegion] = useState('');
  const [appellation, setAppellation] = useState('');
  const [pays, setPays] = useState('France');
  const [type, setType] = useState('bouteille');
  const [prixAchat, setPrixAchat] = useState('');
  const [consommerAvant, setConsommerAvant] = useState('');

  // Step 3
  const [cave, setCave] = useState('Cave 1');
  const [emplacement, setEmplacement] = useState('Emplacement 1');

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!nom.trim()) newErrors.nom = 'Le nom est obligatoire.';
      if (!quantite || isNaN(Number(quantite)) || Number(quantite) < 1) newErrors.quantite = 'Quantité invalide.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  const handleSave = async () => {
    if (!validateStep()) return;
    setSaving(true);
    try {
      await addBottle({
        nom: nom.trim(),
        producteur: producteur.trim() || undefined,
        annee: annee ? Number(annee) : undefined,
        couleur: couleur as any,
        quantite: Number(quantite),
        region: region.trim() || undefined,
        appellation: appellation.trim() || undefined,
        pays: pays || undefined,
        type: type as any,
        prixAchat: prixAchat ? Number(prixAchat) : undefined,
        consommerAvant: consommerAvant ? Number(consommerAvant) : undefined,
        cave,
        emplacement,
        source: 'manual',
      });
      Alert.alert('Bouteille ajoutée !', `"${nom}" a été ajoutée à votre cave.`, [
        { text: 'Voir ma cave', onPress: () => router.push('/(tabs)/cave') },
        { text: 'Ajouter une autre', onPress: () => resetForm() },
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible d\'ajouter la bouteille.');
    }
    setSaving(false);
  };

  const resetForm = () => {
    setNom(''); setProducteur(''); setAnnee(''); setCouleur('rouge'); setQuantite('1');
    setRegion(''); setAppellation(''); setPays('France'); setType('bouteille');
    setPrixAchat(''); setConsommerAvant('');
    setCave('Cave 1'); setEmplacement('Emplacement 1');
    setStep(0); setErrors({});
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ajouter une bouteille</Text>
        </View>

        {/* Stepper */}
        <View style={styles.stepper}>
          {STEP_LABELS.map((label, i) => (
            <TouchableOpacity key={i} style={styles.stepItem} onPress={() => i < step && setStep(i)}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                {i < step
                  ? <Ionicons name="checkmark" size={12} color={Colors.white} />
                  : <Text style={[styles.stepNum, i <= step && { color: Colors.white }]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.stepLine} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* ÉTAPE 1 */}
          {step === 0 && (
            <View>
              <Text style={styles.stepTitle}>Informations essentielles</Text>

              <Input label="Nom du vin" placeholder="ex : Château Margaux" value={nom} onChangeText={setNom} error={errors.nom} required />
              <Input label="Producteur / Domaine" placeholder="ex : Domaine de la Romanée-Conti" value={producteur} onChangeText={setProducteur} />
              <Input label="Millésime" placeholder="ex : 2019" value={annee} onChangeText={setAnnee} keyboardType="numeric" maxLength={4} />
              <Input label="Quantité" placeholder="1" value={quantite} onChangeText={setQuantite} keyboardType="numeric" error={errors.quantite} required />

              <Text style={styles.pickerLabel}>Couleur *</Text>
              <View style={styles.colorPicker}>
                {COULEURS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorOption, couleur === c && styles.colorOptionActive]}
                    onPress={() => setCouleur(c)}
                  >
                    <Text style={[styles.colorText, couleur === c && styles.colorTextActive]}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ÉTAPE 2 */}
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>Détails</Text>
              <Input label="Région" placeholder="ex : Bordeaux, Bourgogne…" value={region} onChangeText={setRegion} />
              <Input label="Appellation" placeholder="ex : Saint-Émilion Grand Cru" value={appellation} onChangeText={setAppellation} />

              <Text style={styles.pickerLabel}>Pays</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={pays} onValueChange={setPays} style={styles.picker}>
                  {PAYS.map((p) => <Picker.Item key={p} label={p} value={p} />)}
                </Picker>
              </View>

              <Text style={styles.pickerLabel}>Type de flacon</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={type} onValueChange={setType} style={styles.picker}>
                  {TYPES.map((t) => <Picker.Item key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={t} />)}
                </Picker>
              </View>

              <Input label="Prix d'achat (€)" placeholder="ex : 24.50" value={prixAchat} onChangeText={setPrixAchat} keyboardType="decimal-pad" />
              <Input label="Consommer avant (année)" placeholder="ex : 2030" value={consommerAvant} onChangeText={setConsommerAvant} keyboardType="numeric" maxLength={4} />
            </View>
          )}

          {/* ÉTAPE 3 */}
          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Rangement</Text>

              <Text style={styles.pickerLabel}>Cave</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={cave} onValueChange={setCave} style={styles.picker}>
                  {CAVES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>

              <Text style={styles.pickerLabel}>Emplacement</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={emplacement} onValueChange={setEmplacement} style={styles.picker}>
                  {EMPLACEMENTS.map((e) => <Picker.Item key={e} label={e} value={e} />)}
                </Picker>
              </View>

              {/* Récap */}
              <View style={styles.recap}>
                <Text style={styles.recapTitle}>Récapitulatif</Text>
                <RecapRow label="Nom" value={nom} />
                <RecapRow label="Producteur" value={producteur} />
                <RecapRow label="Millésime" value={annee} />
                <RecapRow label="Couleur" value={couleur} />
                <RecapRow label="Quantité" value={quantite} />
                <RecapRow label="Région" value={region} />
                <RecapRow label="Prix" value={prixAchat ? `${prixAchat} €` : undefined} />
                <RecapRow label="Cave" value={`${cave} — ${emplacement}`} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navRow}>
          {step > 0 && (
            <Button label="Retour" onPress={() => setStep(s => s - 1)} variant="secondary" style={{ flex: 1 }} />
          )}
          {step < 2 ? (
            <Button label="Suivant" onPress={handleNext} style={{ flex: 2 }} />
          ) : (
            <Button label="Ajouter à ma cave" onPress={handleSave} loading={loading} style={{ flex: 2 }} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const RecapRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
      <Text style={{ ...Typography.caption, color: Colors.brunMoyen }}>{label}</Text>
      <Text style={{ ...Typography.bodySmall, fontWeight: '500', color: Colors.brunMoka }}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cremeIvoire },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { ...Typography.h2 },

  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    top: 14,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.parchemin,
    zIndex: 0,
  },
  stepItem: { alignItems: 'center', gap: 4, zIndex: 1 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.champagne,
    borderWidth: 2,
    borderColor: Colors.parchemin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.lieDeVin, borderColor: Colors.lieDeVin },
  stepDotDone: { backgroundColor: Colors.vertSauge, borderColor: Colors.vertSauge },
  stepNum: { fontSize: 12, fontWeight: '600', color: Colors.brunMoyen },
  stepLabel: { ...Typography.caption, color: Colors.brunClair },
  stepLabelActive: { color: Colors.lieDeVin, fontWeight: '600' },

  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  stepTitle: { ...Typography.h3, marginBottom: Spacing.lg, color: Colors.brunMoka },

  colorPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  colorOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.champagne,
    borderWidth: 1.5,
    borderColor: Colors.parchemin,
  },
  colorOptionActive: { backgroundColor: Colors.lieDeVin, borderColor: Colors.lieDeVin },
  colorText: { fontSize: 13, fontWeight: '500', color: Colors.brunMoyen },
  colorTextActive: { color: Colors.white },

  pickerLabel: { ...Typography.bodySmall, fontWeight: '500', color: Colors.brunMoyen, marginBottom: Spacing.xs },
  pickerWrapper: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.parchemin,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  picker: { height: 44, color: Colors.brunMoka },

  recap: {
    backgroundColor: Colors.champagne,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  recapTitle: { ...Typography.h4, marginBottom: Spacing.md },

  navRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.cremeIvoire,
    borderTopWidth: 1,
    borderTopColor: Colors.champagne,
  },
});
