import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.brunMoka,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.brunMoka,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.brunMoka,
  },
  h4: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brunMoka,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.brunMoka,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.brunMoyen,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.brunClair,
    lineHeight: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.brunMoyen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.ambreChaud,
  },
});
