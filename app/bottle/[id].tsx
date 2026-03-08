import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../src/constants';
import { useBottleStore } from '../../src/stores';
import { StarRating, WineBadge, QuantityBadge, Button } from '../../src/components/ui';
import { getWineGradient, getAverageNote, formatPrice, isUrgent, isNearUrgent } from '../../src/utils/bottle.utils';
import { bottlesApi } from '../../src/api';
import type { ConsumptionEntry } from '../../src/types';

export default function BottleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottles, toggleFavorite, drinkBottle, deleteBottle, addNote: _ } = useBottleStore();
  const bottle = bottles.find((b) => b._id === id);

  const [history, setHistory] = useState<ConsumptionEntry[]>([]);
  const [drinkModal, setDrinkModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [drinkComment, setDrinkComment] = useState('');
  const [drinkNote, setDrinkNote] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [noteValue, setNoteValue] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadHistory();
  }, [id]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await bottlesApi.getHistory(id);
      setHistory(res.data);
    } catch {}
    setLoadingHistory(false);
  };

  const handleDrink = async () => {
    if (!bottle) return;
    setSaving(true);
    try {
      await drinkBottle(id, 1, drinkComment, drinkNote || undefined);
      await loadHistory();
      setDrinkModal(false);
      setDrinkComment('');
      setDrinkNote(0);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer.');
    }
    setSaving(false);
  };

  const handleAddNote = async () => {
    if (!noteValue) return Alert.alert('', 'Veuillez donner une note.');
    setSaving(true);
    try {
      await bottlesApi.addNote(id, { note: noteValue, texte: noteText });
      router.back();
    } catch {}
    setSaving(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer',
      `Supprimer "${bottle?.nom}" de votre cave ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteBottle(id);
            router.back();
          },
        },
      ]
    );
  };

  if (!bottle) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.brunMoka} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.lieDeVin} />
        </View>
      </SafeAreaView>
    );
  }

  const gradient = getWineGradient(bottle.couleur);
  const avgNote = getAverageNote(bottle);
  const urgent = isUrgent(bottle);
  const nearUrgent = isNearUrgent(bottle);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header gradient */}
      <LinearGradient colors={gradient} style={styles.heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavorite(bottle._id)} style={styles.favoriteBtn}>
          <Ionicons
            name={bottle.isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={bottle.isFavorite ? '#FF6B6B' : Colors.white}
          />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Text style={styles.heroName}>{bottle.nom}</Text>
          {bottle.producteur && <Text style={styles.heroProducer}>{bottle.producteur}</Text>}
          {bottle.annee && <Text style={styles.heroYear}>{bottle.annee}</Text>}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Badges */}
        <View style={styles.badgesRow}>
          {bottle.couleur && (
            <WineBadge
              label={bottle.couleur.charAt(0).toUpperCase() + bottle.couleur.slice(1)}
              couleur={bottle.couleur}
            />
          )}
          {bottle.type && bottle.type !== 'bouteille' && (
            <WineBadge label={bottle.type.charAt(0).toUpperCase() + bottle.type.slice(1)} />
          )}
          {bottle.appellation && <WineBadge label={bottle.appellation} />}
          {avgNote !== null && (
            <View style={styles.noteInline}>
              <StarRating value={Math.round(avgNote)} size={14} readonly />
              <Text style={styles.noteInlineText}>{avgNote.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Infos */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Identité</Text>
          <InfoRow icon="location-outline" label="Région" value={[bottle.region, bottle.pays].filter(Boolean).join(' · ')} />
          <InfoRow icon="ribbon-outline" label="Appellation" value={bottle.appellation} />
          <InfoRow icon="storefront-outline" label="Producteur" value={bottle.producteur} />
          <InfoRow icon="calendar-outline" label="Millésime" value={bottle.annee ? String(bottle.annee) : undefined} />
        </View>

        {/* Cave */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Cave</Text>
          <InfoRow icon="cube-outline" label="Emplacement" value={[bottle.cave, bottle.emplacement].filter(Boolean).join(' — ')} />
          <InfoRow icon="layers-outline" label="Quantité" value={`${bottle.quantite} bouteille${bottle.quantite > 1 ? 's' : ''}`} />
          {bottle.prixAchat && <InfoRow icon="pricetag-outline" label="Prix d'achat" value={formatPrice(bottle.prixAchat)} />}
          {bottle.consommerAvant && (
            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color={urgent ? Colors.rougeAlerte : Colors.brunMoyen} style={styles.rowIcon} />
              <Text style={styles.rowLabel}>Consommer avant</Text>
              <Text style={[styles.rowValue, urgent && { color: Colors.rougeAlerte, fontWeight: '600' }]}>
                {bottle.consommerAvant}{urgent ? ' ⚠️' : nearUrgent ? ' ⏳' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {(bottle.notes.length > 0 || bottle.notePerso) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Dégustations</Text>
            {bottle.notePerso && (
              <View style={styles.tastingEntry}>
                <StarRating value={bottle.notePerso.note} size={16} readonly />
                {bottle.notePerso.texte && <Text style={styles.tastingText}>{bottle.notePerso.texte}</Text>}
              </View>
            )}
            {bottle.notes.map((n) => (
              <View key={n._id} style={styles.tastingEntry}>
                <View style={styles.tastingHeader}>
                  <StarRating value={n.note} size={16} readonly />
                  <Text style={styles.tastingDate}>{new Date(n.date).toLocaleDateString('fr-FR')}</Text>
                </View>
                {n.texte && <Text style={styles.tastingText}>{n.texte}</Text>}
                {n.occasion && <Text style={styles.tastingOccasion}>{n.occasion}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Historique */}
        {history.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Historique de consommation</Text>
            {history.slice(0, 5).map((e) => (
              <View key={e._id} style={styles.historyEntry}>
                <View style={styles.historyDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyDate}>{new Date(e.date).toLocaleDateString('fr-FR')}</Text>
                  <Text style={styles.historyDetail}>
                    {e.quantity} bouteille{e.quantity > 1 ? 's' : ''}{e.comment ? ` · ${e.comment}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Actions sticky */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionSecondary} onPress={() => setNoteModal(true)}>
          <Ionicons name="star-outline" size={18} color={Colors.lieDeVin} />
          <Text style={styles.actionSecondaryText}>Noter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionPrimary, bottle.quantite === 0 && { opacity: 0.4 }]}
          onPress={() => bottle.quantite > 0 && setDrinkModal(true)}
          disabled={bottle.quantite === 0}
        >
          <Ionicons name="wine-outline" size={18} color={Colors.white} />
          <Text style={styles.actionPrimaryText}>J'en bois une</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionSecondary} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={Colors.rougeAlerte} />
        </TouchableOpacity>
      </View>

      {/* Modal — Boire */}
      <Modal visible={drinkModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Boire une bouteille</Text>
            <Text style={styles.modalSub}>{bottle.nom}</Text>
            <StarRating value={drinkNote} onChange={setDrinkNote} size={28} />
            <TextInput
              style={styles.modalInput}
              placeholder="Commentaire (optionnel)"
              placeholderTextColor={Colors.brunClair}
              value={drinkComment}
              onChangeText={setDrinkComment}
              multiline
            />
            <Button label="Enregistrer" onPress={handleDrink} loading={saving} fullWidth />
            <Button label="Annuler" onPress={() => setDrinkModal(false)} variant="ghost" fullWidth />
          </View>
        </View>
      </Modal>

      {/* Modal — Note */}
      <Modal visible={noteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ajouter une note</Text>
            <StarRating value={noteValue} onChange={setNoteValue} size={28} />
            <TextInput
              style={styles.modalInput}
              placeholder="Commentaire de dégustation…"
              placeholderTextColor={Colors.brunClair}
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />
            <Button label="Enregistrer" onPress={handleAddNote} loading={saving} fullWidth />
            <Button label="Annuler" onPress={() => setNoteModal(false)} variant="ghost" fullWidth />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value?: string }) => {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Ionicons name={icon as any} size={16} color={Colors.brunMoyen} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cremeIvoire },
  heroGradient: { height: 200, paddingTop: Spacing.sm, paddingHorizontal: Spacing.lg, justifyContent: 'flex-end', paddingBottom: Spacing.xl },
  backBtn: { position: 'absolute', top: Spacing.lg, left: Spacing.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  favoriteBtn: { position: 'absolute', top: Spacing.lg, right: Spacing.lg, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroContent: { marginTop: 40 },
  heroName: { fontSize: 22, fontWeight: '700', color: Colors.white },
  heroProducer: { fontSize: 13, color: Colors.white, opacity: 0.85, marginTop: 2 },
  heroYear: { fontSize: 16, color: Colors.white, opacity: 0.9, marginTop: 4, fontWeight: '600' },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  noteInline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  noteInlineText: { ...Typography.bodySmall, color: Colors.ambreChaud, fontWeight: '600' },

  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.champagne,
  },
  cardTitle: { ...Typography.label, marginBottom: Spacing.md, color: Colors.brunMoyen },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  rowIcon: { marginRight: 10 },
  rowLabel: { flex: 1, ...Typography.bodySmall, color: Colors.brunMoyen },
  rowValue: { ...Typography.bodySmall, fontWeight: '500', color: Colors.brunMoka, textAlign: 'right', maxWidth: '55%' },

  tastingEntry: { paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.champagne },
  tastingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tastingDate: { ...Typography.caption, color: Colors.brunClair },
  tastingText: { ...Typography.body, color: Colors.brunMoka, marginTop: 4, fontStyle: 'italic' },
  tastingOccasion: { ...Typography.caption, color: Colors.brunMoyen, marginTop: 2 },

  historyEntry: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, gap: 10 },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.lieDeVin, marginTop: 5 },
  historyDate: { ...Typography.caption, color: Colors.brunMoyen, fontWeight: '600' },
  historyDetail: { ...Typography.caption, color: Colors.brunClair },

  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: 10,
    ...Shadow.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.champagne,
  },
  actionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.champagne,
    gap: 6,
  },
  actionSecondaryText: { ...Typography.buttonText, color: Colors.lieDeVin },
  actionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.lieDeVin,
    gap: 8,
  },
  actionPrimaryText: { ...Typography.buttonText, color: Colors.white },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.cremeIvoire,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.section,
    gap: Spacing.md,
  },
  modalTitle: { ...Typography.h3, textAlign: 'center' },
  modalSub: { ...Typography.bodySmall, textAlign: 'center', color: Colors.brunMoyen },
  modalInput: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.parchemin,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.brunMoka,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
