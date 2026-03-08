import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../src/constants';
import { useBottleStore, useUIStore } from '../../src/stores';
import { BottleCard } from '../../src/components/bottle/BottleCard';
import { EmptyState } from '../../src/components/ui';
import { filterAndSortBottles } from '../../src/utils/bottle.utils';

const COULEURS = ['rouge', 'blanc', 'rosé', 'effervescent', 'moelleux'];
const SORTS = [
  { key: 'createdAt', label: 'Récent' },
  { key: 'annee', label: 'Millésime' },
  { key: 'nom', label: 'Nom' },
  { key: 'note', label: 'Note' },
  { key: 'prix', label: 'Prix' },
] as const;

export default function CaveScreen() {
  const { bottles, isLoading, fetchBottles } = useBottleStore();
  const { caveView, activeFilters, searchQuery, sortBy, setCaveView, setFilter, clearFilters, setSearchQuery, setSortBy } = useUIStore();

  useEffect(() => { fetchBottles(); }, []);

  const filtered = useMemo(
    () => filterAndSortBottles(bottles, searchQuery, activeFilters, sortBy),
    [bottles, searchQuery, activeFilters, sortBy]
  );

  const hasFilters = searchQuery || Object.values(activeFilters).some(Boolean);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ma Cave</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.viewToggle, caveView === 'list' && styles.viewToggleActive]}
            onPress={() => setCaveView('list')}
          >
            <Ionicons name="list-outline" size={18} color={caveView === 'list' ? Colors.white : Colors.brunMoyen} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggle, caveView === 'grid' && styles.viewToggleActive]}
            onPress={() => setCaveView('grid')}
          >
            <Ionicons name="grid-outline" size={18} color={caveView === 'grid' ? Colors.white : Colors.brunMoyen} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.brunClair} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un vin, domaine, région…"
          placeholderTextColor={Colors.brunClair}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.brunClair} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {/* Favs */}
        <TouchableOpacity
          style={[styles.chip, activeFilters.favoritesOnly && styles.chipActive]}
          onPress={() => setFilter('favoritesOnly', activeFilters.favoritesOnly ? undefined : true)}
        >
          <Ionicons
            name={activeFilters.favoritesOnly ? 'heart' : 'heart-outline'}
            size={13}
            color={activeFilters.favoritesOnly ? Colors.white : Colors.brunMoyen}
          />
          <Text style={[styles.chipText, activeFilters.favoritesOnly && styles.chipTextActive]}>Favoris</Text>
        </TouchableOpacity>

        {/* Urgent */}
        <TouchableOpacity
          style={[styles.chip, activeFilters.urgentOnly && styles.chipActive, activeFilters.urgentOnly && { backgroundColor: Colors.rougeAlerte }]}
          onPress={() => setFilter('urgentOnly', activeFilters.urgentOnly ? undefined : true)}
        >
          <Ionicons name="time-outline" size={13} color={activeFilters.urgentOnly ? Colors.white : Colors.brunMoyen} />
          <Text style={[styles.chipText, activeFilters.urgentOnly && styles.chipTextActive]}>À boire</Text>
        </TouchableOpacity>

        {/* Couleurs */}
        {COULEURS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, activeFilters.couleur === c && styles.chipActive]}
            onPress={() => setFilter('couleur', activeFilters.couleur === c ? undefined : c)}
          >
            <Text style={[styles.chipText, activeFilters.couleur === c && styles.chipTextActive]}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Clear */}
        {hasFilters && (
          <TouchableOpacity style={styles.chipClear} onPress={clearFilters}>
            <Ionicons name="close" size={13} color={Colors.brunMoyen} />
            <Text style={[styles.chipText, { color: Colors.brunMoyen }]}>Effacer</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sort */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 36 }}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 6 }}
      >
        {SORTS.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[styles.sortChip, sortBy === s.key && styles.sortChipActive]}
            onPress={() => setSortBy(s.key)}
          >
            <Text style={[styles.sortText, sortBy === s.key && styles.sortTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(b) => b._id}
        renderItem={({ item }) => (
          <BottleCard
            bottle={item}
            onPress={() => router.push({ pathname: '/bottle/[id]', params: { id: item._id } })}
          />
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchBottles} tintColor={Colors.lieDeVin} />}
        contentContainerStyle={{ paddingTop: Spacing.sm, paddingBottom: 120 }}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="wine-outline"
              title={hasFilters ? 'Aucun vin trouvé' : 'Votre cave est vide'}
              subtitle={hasFilters ? 'Essayez d\'autres filtres.' : 'Commencez par ajouter votre première bouteille.'}
              actionLabel={hasFilters ? 'Effacer les filtres' : 'Ajouter une bouteille'}
              onAction={hasFilters ? clearFilters : () => router.push('/(tabs)/add')}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cremeIvoire },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { ...Typography.h1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggleActive: { backgroundColor: Colors.lieDeVin },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.parchemin,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, ...Typography.body, color: Colors.brunMoka },

  filtersScroll: { marginBottom: Spacing.sm },
  filtersContent: { paddingHorizontal: Spacing.lg, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.champagne,
    borderWidth: 1,
    borderColor: Colors.parchemin,
  },
  chipActive: { backgroundColor: Colors.lieDeVin, borderColor: Colors.lieDeVin },
  chipClear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.cremeIvoire,
    borderWidth: 1,
    borderColor: Colors.parchemin,
  },
  chipText: { fontSize: 12, fontWeight: '500', color: Colors.brunMoyen },
  chipTextActive: { color: Colors.white },

  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.cremeIvoire,
  },
  sortChipActive: { backgroundColor: Colors.champagne },
  sortText: { fontSize: 12, color: Colors.brunMoyen },
  sortTextActive: { color: Colors.brunMoka, fontWeight: '600' },

  countRow: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 2 },
  countText: { ...Typography.caption, color: Colors.brunClair },
});
