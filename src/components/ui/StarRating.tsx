import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}

export const StarRating: React.FC<Props> = ({ value, onChange, size = 20, readonly = false }) => (
  <View style={styles.row}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => !readonly && onChange?.(star)}
        disabled={readonly}
        activeOpacity={0.7}
        style={{ marginRight: 2 }}
      >
        <Ionicons
          name={star <= value ? 'star' : 'star-outline'}
          size={size}
          color={star <= value ? Colors.ambreChaud : Colors.parchemin}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
