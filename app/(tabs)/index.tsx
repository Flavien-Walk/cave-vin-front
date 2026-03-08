import React, { useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../src/constants';
import { useBottleStore } from '../../src/stores';
import { BottleCard } from '../../src/components/bottle/BottleCard';
import { isUrgent } from '../../src/utils/bottle.utils';

const anecdotes = [
  "Au Moyen Âge, le vin servait de médicament, de désinfectant, et parfois de monnaie d'échange entre nobles.",
  "Il faut plus de 600 baies de raisin pour produire une seule bouteille de vin.",
  "Les premières traces de vinification remontent à plus de 8000 ans en Géorgie.",
  "Les Romains ne buvaient jamais leur vin pur. Ils le coupaient avec de l'eau, parfois de l'eau de mer.",
  "La France détient la plus grande diversité viticole d'Europe avec plus de 400 cépages.",
  "Une bouteille de Champagne subit une pression de 6 bars, soit 3 fois celle d'un pneu de voiture.",
  "Le mot sommelier vient du vieux provençal saumalier, le serviteur chargé de transporter les provisions.",
  "Les tanins responsables de l'astringence du vin rouge proviennent des peaux, pépins et rafles du raisin.",
];

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { bottles, isLoading, fetchBottles, getFavorites, getUrgent } = useBottleStore();
  const favorites = getFavorites();
  const urgent = getUrgent();
  const anecdote = anecdotes[Math.floor(Math.random() * anecdotes.length)];

  useEffect(() => { fetchBottles(); }, []);

  const totalBottles = bottles.reduce((sum, b) => sum + b.quantite, 0);
  const totalValue = bottles.reduce((sum, b) => sum + (b.prixAchat || 0) * b.quantite, 0);
  const recentBottles = [...bottles].slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchBottles} tintColor={Colors.lieDeVin} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonsoir,</Text>
            <Text style={styles.title}>Ma Cave à Vin</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={() => router.push('/(tabs)/cave')}>
            <Ionicons name="search-outline" size={20} color={Colors.brunMoka} />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <LinearGradient
          colors={[Colors.lieDeVin, Colors.bordeaux]}
          style={styles.statsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalBottles}</Text>
              <Text style={styles.statLabel}>bouteilles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{bottles.length}</Text>
              <Text style={styles.statLabel}>références</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalValue > 0 ? `${Math.round(totalValue)}€` : '—'}</Text>
              <Text style={styles.statLabel}>valeur</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/stats')} style={styles.statsLink}>
            <Text style={styles.statsLinkText}>Voir les statistiques</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.cremeIvoire} style={{ opacity: 0.8 }} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Alertes urgentes */}
        {urgent.length > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => router.push('/(tabs)/cave')}
            activeOpacity={0.85}
          >
            <View style={styles.alertLeft}>
              <Ionicons name="time-outline" size={18} color={Colors.rougeAlerte} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.alertTitle}>{urgent.length} bouteille{urgent.length > 1 ? 's' : ''} à consommer</Text>
                <Text style={styles.alertSub}>Appuyez pour voir la liste</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.rougeAlerte} />
          </TouchableOpacity>
        )}

        {/* Actions rapides */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/add')} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.lieDeVin }]}>
              <Ionicons name="add" size={22} color={Colors.white} />
            </View>
            <Text style={styles.actionLabel}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/cave')} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.champagne }]}>
              <Ionicons name="wine-outline" size={22} color={Colors.brunMoka} />
            </View>
            <Text style={styles.actionLabel}>Ma Cave</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/discover')} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.effervescentLight }]}>
              <Ionicons name="compass-outline" size={22} color={Colors.effervescent} />
            </View>
            <Text style={styles.actionLabel}>Découvrir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/stats')} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.blancDoreLight }]}>
              <Ionicons name="bar-chart-outline" size={22} color={Colors.brunMoka} />
            </View>
            <Text style={styles.actionLabel}>Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Favoris */}
        {favorites.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes coups de cœur</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/cave')}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {favorites.slice(0, 2).map((b) => (
              <BottleCard
                key={b._id}
                bottle={b}
                onPress={() => router.push({ pathname: '/bottle/[id]', params: { id: b._id } })}
              />
            ))}
          </View>
        )}

        {/* Récemment ajoutées */}
        {recentBottles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Récemment ajoutées</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/cave')}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {recentBottles.map((b) => (
              <BottleCard
                key={b._id}
                bottle={b}
                onPress={() => router.push({ pathname: '/bottle/[id]', params: { id: b._id } })}
              />
            ))}
          </View>
        )}

        {/* Anecdote */}
        <View style={styles.anecdoteCard}>
          <View style={styles.anecdoteHeader}>
            <Ionicons name="bulb-outline" size={16} color={Colors.ambreChaud} />
            <Text style={styles.anecdoteLabel}>Le savez-vous ?</Text>
          </View>
          <Text style={styles.anecdoteText}>{anecdote}</Text>
        </View>

        {/* Empty state */}
        {bottles.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="wine-outline" size={60} color={Colors.parchemin} />
            <Text style={styles.emptyTitle}>Votre cave vous attend</Text>
            <Text style={styles.emptySub}>Commencez par ajouter votre première bouteille.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/add')}>
              <Text style={styles.emptyBtnText}>Ajouter une bouteille</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cremeIvoire },
  scroll: { paddingTop: Spacing.lg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  greeting: { ...Typography.bodySmall, color: Colors.brunMoyen },
  title: { ...Typography.h1, marginTop: 2 },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: Colors.cremeIvoire },
  statLabel: { fontSize: 11, color: Colors.cremeIvoire, opacity: 0.75, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  statsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: 4,
  },
  statsLinkText: { fontSize: 12, color: Colors.cremeIvoire, opacity: 0.8 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.rougeAlerteLight,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F0C0BC',
  },
  alertLeft: { flexDirection: 'row', alignItems: 'center' },
  alertTitle: { ...Typography.bodySmall, fontWeight: '600', color: Colors.rougeAlerte },
  alertSub: { ...Typography.caption, color: Colors.rougeAlerte, opacity: 0.75 },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  actionLabel: { ...Typography.caption, color: Colors.brunMoyen },

  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.h3 },
  seeAll: { ...Typography.caption, color: Colors.lieDeVin, fontWeight: '500' },

  anecdoteCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.champagne,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  anecdoteHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  anecdoteLabel: { ...Typography.label, color: Colors.ambreChaud, textTransform: 'uppercase', fontSize: 11 },
  anecdoteText: { ...Typography.body, color: Colors.brunMoka, fontStyle: 'italic', lineHeight: 22 },

  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.section, paddingHorizontal: Spacing.xxxl },
  emptyTitle: { ...Typography.h3, marginTop: Spacing.lg, textAlign: 'center' },
  emptySub: { ...Typography.body, color: Colors.brunMoyen, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
  emptyBtn: {
    backgroundColor: Colors.lieDeVin,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  emptyBtnText: { ...Typography.buttonText, color: Colors.white },
});
