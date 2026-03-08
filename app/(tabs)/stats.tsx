import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, Typography } from '../../src/constants';
import { statsApi } from '../../src/api';
import type { CaveStats } from '../../src/types';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = width - 120;

const COLOR_MAP: Record<string, string> = {
  rouge: Colors.rougeVin,
  blanc: Colors.blancDore,
  rosé: Colors.rosePale,
  effervescent: Colors.effervescent,
  moelleux: Colors.moelleux,
  autre: Colors.brunMoyen,
};

export default function StatsScreen() {
  const [stats, setStats] = useState<CaveStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await statsApi.getSummary();
      setStats(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.lieDeVin} />}
      >
        <Text style={styles.title}>Statistiques</Text>

        {stats && (
          <>
            {/* KPIs */}
            <View style={styles.kpiRow}>
              <KpiCard icon="wine-outline" label="Bouteilles" value={stats.totalBottles} color={Colors.lieDeVin} />
              <KpiCard icon="library-outline" label="Références" value={stats.totalReferences} color={Colors.brunMoka} />
              <KpiCard icon="pricetag-outline" label="Valeur (€)" value={`${Math.round(stats.totalValue)}`} color={Colors.ambreChaud} />
            </View>

            <View style={styles.kpiRow}>
              <KpiCard icon="heart-outline" label="Favoris" value={stats.favorites} color={Colors.rougeAlerte} />
              <KpiCard icon="time-outline" label="À consommer" value={stats.urgent} color={stats.urgent > 0 ? Colors.rougeAlerte : Colors.vertSauge} />
              <KpiCard icon="checkmark-circle-outline" label="Bues (année)" value={stats.consumed.thisYear} color={Colors.vertSauge} />
            </View>

            {/* Couleurs */}
            {stats.byColor.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Répartition par couleur</Text>
                {stats.byColor.map((item) => (
                  <View key={item.couleur} style={styles.barRow}>
                    <Text style={styles.barLabel}>{item.couleur.charAt(0).toUpperCase() + item.couleur.slice(1)}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: (item.percentage / 100) * BAR_MAX_WIDTH,
                            backgroundColor: COLOR_MAP[item.couleur] || Colors.brunMoyen,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barValue}>{item.count}</Text>
                    <Text style={styles.barPct}>{item.percentage}%</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Régions */}
            {stats.byRegion.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Top régions</Text>
                {stats.byRegion.slice(0, 8).map((item, i) => {
                  const maxCount = stats.byRegion[0].count;
                  return (
                    <View key={item.region} style={styles.barRow}>
                      <Text style={styles.barLabel} numberOfLines={1}>{item.region}</Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: (item.count / maxCount) * BAR_MAX_WIDTH,
                              backgroundColor: i === 0 ? Colors.lieDeVin : Colors.cramoisDoux,
                              opacity: 1 - i * 0.08,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.barValue}>{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Consommation */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Consommation</Text>
              <View style={styles.consumRow}>
                <ConsumeItem label="Ce mois" value={stats.consumed.thisMonth} />
                <ConsumeItem label="Cette année" value={stats.consumed.thisYear} />
                <ConsumeItem label="Total" value={stats.consumed.total} />
              </View>
            </View>

            {/* Millésimes */}
            {stats.byYear.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Millésimes en cave</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.yearRow}>
                    {stats.byYear.slice(-12).map((item) => {
                      const maxCount = Math.max(...stats.byYear.map((y) => y.count));
                      const barH = Math.max(4, (item.count / maxCount) * 60);
                      return (
                        <View key={item.annee} style={styles.yearItem}>
                          <Text style={styles.yearCount}>{item.count}</Text>
                          <View style={[styles.yearBar, { height: barH }]} />
                          <Text style={styles.yearLabel}>{item.annee}</Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}
          </>
        )}

        {!stats && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={48} color={Colors.parchemin} />
            <Text style={styles.emptyText}>Ajoutez des bouteilles pour voir vos statistiques.</Text>
          </View>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const KpiCard = ({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) => (
  <View style={kpiStyles.card}>
    <Ionicons name={icon as any} size={20} color={color} />
    <Text style={kpiStyles.value}>{value}</Text>
    <Text style={kpiStyles.label}>{label}</Text>
  </View>
);

const ConsumeItem = ({ label, value }: { label: string; value: number }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.lieDeVin }}>{value}</Text>
    <Text style={Typography.caption}>{label}</Text>
  </View>
);

const kpiStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.champagne,
  },
  value: { fontSize: 20, fontWeight: '700', color: Colors.brunMoka },
  label: { fontSize: 11, color: Colors.brunMoyen },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cremeIvoire },
  scroll: { padding: Spacing.lg },
  title: { ...Typography.h1, marginBottom: Spacing.xl },

  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.champagne,
  },
  cardTitle: { ...Typography.h4, marginBottom: Spacing.md },

  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  barLabel: { width: 80, ...Typography.caption, color: Colors.brunMoyen },
  barTrack: { flex: 1, height: 8, backgroundColor: Colors.champagne, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  barValue: { width: 24, ...Typography.caption, color: Colors.brunMoka, textAlign: 'right', fontWeight: '600' },
  barPct: { width: 30, ...Typography.caption, color: Colors.brunClair, textAlign: 'right' },

  consumRow: { flexDirection: 'row', justifyContent: 'space-around' },

  yearRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingVertical: Spacing.sm },
  yearItem: { alignItems: 'center', gap: 4 },
  yearCount: { fontSize: 10, color: Colors.brunMoyen, fontWeight: '600' },
  yearBar: { width: 24, backgroundColor: Colors.lieDeVin, borderRadius: 4, opacity: 0.7 },
  yearLabel: { fontSize: 10, color: Colors.brunMoyen },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { ...Typography.body, color: Colors.brunMoyen, textAlign: 'center' },
});
