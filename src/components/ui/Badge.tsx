import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../../constants';
import { getWineColorHex, getWineColorLight } from '../../utils/bottle.utils';

interface Props {
  label: string;
  couleur?: string;
  small?: boolean;
}

export const WineBadge: React.FC<Props> = ({ label, couleur, small = false }) => {
  const color = couleur ? getWineColorHex(couleur) : Colors.brunMoyen;
  const bgColor = couleur ? getWineColorLight(couleur) : Colors.champagne;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, small && styles.small]}>
      <Text style={[styles.text, { color }, small && styles.textSmall]}>{label}</Text>
    </View>
  );
};

interface QuantityBadgeProps {
  count: number;
  urgent?: boolean;
}

export const QuantityBadge: React.FC<QuantityBadgeProps> = ({ count, urgent }) => (
  <View style={[styles.badge, { backgroundColor: urgent ? Colors.rougeAlerteLight : Colors.champagne }]}>
    <Text style={[styles.text, { color: urgent ? Colors.rougeAlerte : Colors.brunMoyen }]}>
      {count}x
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  small: { paddingHorizontal: 7, paddingVertical: 2 },
  text: { fontSize: 12, fontWeight: '600' },
  textSmall: { fontSize: 11 },
});
