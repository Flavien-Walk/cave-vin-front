import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input: React.FC<Props> = ({ label, error, containerStyle, required, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor={Colors.brunClair}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    ...Typography.bodySmall,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    color: Colors.brunMoyen,
  },
  required: { color: Colors.rougeAlerte },
  input: {
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.parchemin,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
    color: Colors.brunMoka,
  },
  inputFocused: { borderColor: Colors.lieDeVin },
  inputError: { borderColor: Colors.rougeAlerte },
  errorText: { ...Typography.caption, color: Colors.rougeAlerte, marginTop: 4 },
});
