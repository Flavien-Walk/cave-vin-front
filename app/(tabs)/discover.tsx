import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../src/constants';
import { bottlesApi, wishlistApi } from '../../src/api';
import { useWishlistStore } from '../../src/stores';
import { WineBadge, EmptyState, Button } from '../../src/components/ui';
import type { Bottle, WishlistItem } from '../../src/types';

type Tab = 'recommandations' | 'accords' | 'wishlist';

export default function DiscoverScreen() {
  const [tab, setTab] = useState<Tab>('recommandations');
  const [recommendations, setRecommendations] = useState<Bottle[]>([]);
  const [suggestions, setSuggestions] = useState<Bottle[]>([]);
  const [platInput, setPlatInput] = useState('');
  const [loadingReco, setLoadingReco] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [showAddWishlist, setShowAddWishlist] = useState(false);
  const [wishlistNom, setWishlistNom] = useState('');

  const { items: wishlistItems, fetchItems, addItem, deleteItem, markPurchased, isLoading } = useWishlistStore();

  useEffect(() => {
    loadRecommendations();
    fetchItems();
  }, []);

  const loadRecommendations = async () => {
    setLoadingReco(true);
    try {
      const res = await bottlesApi.getRecommendations();
      setRecommendations(res.data.recommandations);
    } catch {}
    setLoadingReco(false);
  };

  const handleSuggest = async () => {
    if (!platInput.trim()) return;
    setLoadingSuggest(true);
    setSuggestions([]);
    try {
      const res = await bottlesApi.suggestWine(platInput.trim());
      setSuggestions(res.data.suggestions);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        Alert.alert('Aucun résultat', e.response.data.message || 'Aucun vin trouvé pour ce plat.');
      }
    }
    setLoadingSuggest(false);
  };

  const handleAddToWishlist = async () => {
    if (!wishlistNom.trim()) return Alert.alert('', 'Entrez un nom de vin.');
    try {
      await addItem({ nom: wishlistNom.trim(), priorite: 'normale' });
      setWishlistNom('');
      setShowAddWishlist(false);
    } catch { Alert.alert('Erreur', 'Impossible d\'ajouter.'); }
  };

  const confirmDelete = (id: string, nom: string) => {
    Alert.alert('Supprimer', `Retirer "${nom}" de la wishlist ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteItem(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Tabs */}
      <View style={styles.header}>
        <Text style={styles.title}>Découvrir</Text>
      </View>
      <View style={styles.tabs}>
        {(['recommandations', 'accords', 'wishlist'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'recommandations' ? 'Pour vous' : t === 'accords' ? 'Accords' : 'Wishlist'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* RECOMMANDATIONS */}
        {tab === 'recommandations' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vins à découvrir</Text>
              <TouchableOpacity onPress={loadRecommendations}>
                <Ionicons name="refresh-outline" size={18} color={Colors.lieDeVin} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSub}>Basées sur vos préférences et vos notes</Text>

            {loadingReco && <ActivityIndicator color={Colors.lieDeVin} style={{ marginTop: 40 }} />}
            {!loadingReco && recommendations.length === 0 && (
              <EmptyState
                icon="compass-outline"
                title="Pas encore de recommandations"
                subtitle="Notez vos vins pour obtenir des suggestions personnalisées."
              />
            )}
            {recommendations.map((b) => (
              <BottleMiniCard key={b._id} bottle={b} onPress={() => router.push({ pathname: '/bottle/[id]', params: { id: b._id } })} />
            ))}
          </View>
        )}

        {/* ACCORDS */}
        {tab === 'accords' && (
          <View>
            <Text style={styles.sectionTitle}>Accord mets-vins</Text>
            <Text style={styles.sectionSub}>Entrez un plat pour trouver les vins idéaux dans votre cave</Text>

            <View style={styles.searchRow}>
              <TextInput
                style={styles.platInput}
                placeholder="ex : poulet rôti, saumon, risotto…"
                placeholderTextColor={Colors.brunClair}
                value={platInput}
                onChangeText={setPlatInput}
                onSubmitEditing={handleSuggest}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSuggest} disabled={loadingSuggest}>
                {loadingSuggest
                  ? <ActivityIndicator size="small" color={Colors.white} />
                  : <Ionicons name="search" size={18} color={Colors.white} />
                }
              </TouchableOpacity>
            </View>

            {suggestions.length > 0 && (
              <View style={{ marginTop: Spacing.lg }}>
                <Text style={styles.sectionTitle}>{suggestions.length} vin{suggestions.length > 1 ? 's' : ''} pour votre plat</Text>
                {suggestions.map((b) => (
                  <BottleMiniCard key={b._id} bottle={b} onPress={() => router.push({ pathname: '/bottle/[id]', params: { id: b._id } })} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* WISHLIST */}
        {tab === 'wishlist' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ma Wishlist</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddWishlist(true)}>
                <Ionicons name="add" size={16} color={Colors.white} />
                <Text style={styles.addBtnText}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            {isLoading && <ActivityIndicator color={Colors.lieDeVin} />}
            {!isLoading && wishlistItems.length === 0 && (
              <EmptyState
                icon="bookmark-outline"
                title="Votre wishlist est vide"
                subtitle="Notez les vins qui vous font envie pour ne pas les oublier."
                actionLabel="Ajouter un vin"
                onAction={() => setShowAddWishlist(true)}
              />
            )}
            {wishlistItems.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                onDelete={() => confirmDelete(item._id, item.nom)}
                onPurchase={() => markPurchased(item._id)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal wishlist */}
      <Modal visible={showAddWishlist} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Ajouter à la wishlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nom du vin…"
              placeholderTextColor={Colors.brunClair}
              value={wishlistNom}
              onChangeText={setWishlistNom}
            />
            <Button label="Ajouter" onPress={handleAddToWishlist} fullWidth />
            <Button label="Annuler" onPress={() => setShowAddWishlist(false)} variant="ghost" fullWidth />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const BottleMiniCard = ({ bottle, onPress }: { bottle: Bottle; onPress: () => void }) => (
  <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={[cardStyles.colorDot, { backgroundColor: Colors[bottle.couleur === 'rouge' ? 'rougeVin' : bottle.couleur === 'blanc' ? 'blancDore' : bottle.couleur === 'rosé' ? 'rosePale' : 'effervescent'] || Colors.brunMoyen }]} />
    <View style={{ flex: 1 }}>
      <Text style={cardStyles.name} numberOfLines={1}>{bottle.nom}</Text>
      <Text style={cardStyles.sub} numberOfLines={1}>
        {[bottle.producteur, bottle.region, bottle.annee].filter(Boolean).join(' · ')}
      </Text>
    </View>
    {bottle.couleur && <WineBadge label={bottle.couleur} couleur={bottle.couleur} small />}
    <Ionicons name="chevron-forward" size={16} color={Colors.brunClair} style={{ marginLeft: 4 }} />
  </TouchableOpacity>
);

const WishlistCard = ({ item, onDelete, onPurchase }: { item: WishlistItem; onDelete: () => void; onPurchase: () => void }) => (
  <View style={[cardStyles.card, item.isPurchased && { opacity: 0.5 }]}>
    <Ionicons name={item.isPurchased ? 'checkmark-circle' : 'bookmark-outline'} size={18} color={item.isPurchased ? Colors.vertSauge : Colors.lieDeVin} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={[cardStyles.name, item.isPurchased && { textDecorationLine: 'line-through' }]}>{item.nom}</Text>
      {item.priorite !== 'normale' && (
        <Text style={{ fontSize: 11, color: item.priorite === 'haute' ? Colors.rougeAlerte : Colors.brunClair, marginTop: 2 }}>
          {item.priorite === 'haute' ? 'Priorité haute' : 'Priorité basse'}
        </Text>
      )}
    </View>
    {!item.isPurchased && (
      <TouchableOpacity onPress={onPurchase} style={{ padding: 4 }}>
        <Ionicons name="checkmark-circle-outline" size={20} color={Colors.vertSauge} />
      </TouchableOpacity>
    )}
    <TouchableOpacity onPress={onDelete} style={{ padding: 4 }}>
      <Ionicons name="trash-outline" size={18} color={Colors.rougeAlerte} />
    </TouchableOpacity>
  </View>
);

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.champagne,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  name: { ...Typography.h4 },
  sub: { ...Typography.caption, marginTop: 2 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cremeIvoire },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { ...Typography.h1 },

  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.champagne },
  tabActive: { backgroundColor: Colors.lieDeVin },
  tabText: { fontSize: 13, fontWeight: '500', color: Colors.brunMoyen },
  tabTextActive: { color: Colors.white },

  content: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { ...Typography.h3, marginBottom: 4 },
  sectionSub: { ...Typography.caption, color: Colors.brunMoyen, marginBottom: Spacing.md },

  searchRow: { flexDirection: 'row', gap: 8, marginTop: Spacing.md },
  platInput: {
    flex: 1,
    height: 46,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.parchemin,
    paddingHorizontal: Spacing.md,
    ...Typography.body,
    color: Colors.brunMoka,
  },
  searchBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    backgroundColor: Colors.lieDeVin,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.lieDeVin,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  addBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.cremeIvoire,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.section,
    gap: Spacing.md,
  },
  modalTitle: { ...Typography.h3, textAlign: 'center', marginBottom: Spacing.sm },
  modalInput: {
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.parchemin,
    paddingHorizontal: Spacing.md,
    ...Typography.body,
    color: Colors.brunMoka,
  },
});
