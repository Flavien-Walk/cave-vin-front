import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants';
import { WineBadge, QuantityBadge, StarRating } from '../ui';
import { isUrgent, isNearUrgent, getWineGradient, getAverageNote } from '../../utils/bottle.utils';
import { useBottleStore } from '../../stores';
import type { Bottle } from '../../types';

interface Props {
  bottle: Bottle;
  onPress: () => void;
}

export const BottleCard: React.FC<Props> = ({ bottle, onPress }) => {
  const toggleFavorite = useBottleStore((s) => s.toggleFavorite);
  const urgent = isUrgent(bottle);
  const nearUrgent = isNearUrgent(bottle);
  const avgNote = getAverageNote(bottle);
  const gradient = getWineGradient(bottle.couleur);

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    toggleFavorite(bottle._id);
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      {/* Bande couleur gauche */}
      <LinearGradient
        colors={gradient}
        style={styles.colorBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name} numberOfLines={1}>{bottle.nom}</Text>
            {bottle.producteur ? (
              <Text style={styles.producer} numberOfLines={1}>{bottle.producteur}</Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={bottle.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={bottle.isFavorite ? Colors.rougeAlerte : Colors.parchemin}
            />
          </TouchableOpacity>
        </View>

        {/* Infos */}
        <View style={styles.infoRow}>
          {bottle.annee ? <Text style={styles.year}>{bottle.annee}</Text> : null}
          {bottle.region ? (
            <Text style={styles.region} numberOfLines={1}>{bottle.region}</Text>
          ) : null}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {bottle.couleur && (
              <WineBadge
                label={bottle.couleur.charAt(0).toUpperCase() + bottle.couleur.slice(1)}
                couleur={bottle.couleur}
                small
              />
            )}
            {avgNote !== null && (
              <View style={{ marginLeft: 6 }}>
                <StarRating value={Math.round(avgNote)} size={12} readonly />
              </View>
            )}
          </View>
          <View style={styles.footerRight}>
            {(urgent || nearUrgent) && (
              <Ionicons
                name="time-outline"
                size={14}
                color={urgent ? Colors.rougeAlerte : Colors.ambreChaud}
                style={{ marginRight: 4 }}
              />
            )}
            <QuantityBadge count={bottle.quantite} urgent={urgent} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cremeIvoire,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.champagne,
  },
  colorBar: { width: 6 },
  content: { flex: 1, padding: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  headerLeft: { flex: 1, marginRight: 8 },
  name: { ...Typography.h4 },
  producer: { ...Typography.caption, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  year: { ...Typography.bodySmall, fontWeight: '600', color: Colors.lieDeVin },
  region: { ...Typography.caption, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { flexDirection: 'row', alignItems: 'center' },
  footerRight: { flexDirection: 'row', alignItems: 'center' },
});
