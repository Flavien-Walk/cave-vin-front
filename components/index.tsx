import React from "react";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  Box,
  Text,
  Icon,
  VStack,
  NativeBaseProvider,
  HStack,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import AnecdoteVin from "../components/AnecdoteVin";
import styles from "../styles/IndexScreenStyles"; // Ton fichier styles.ts renommé ici

const SecretContent: React.FC = () => {
  const router = useRouter();

  const ActionButton = ({
    onPress,
    bgDefault,
    bgPressed,
    iconAs,
    iconName,
    title,
    description,
    locked = false,
  }: {
    onPress?: () => void;
    bgDefault: string;
    bgPressed: string;
    iconAs: any;
    iconName: string;
    title: string;
    description: string;
    locked?: boolean;
  }) => (
    <Pressable onPress={!locked ? onPress : undefined}>
      {({ pressed }) => (
        <Box
          p={5}
          rounded="2xl"
          bg={pressed && !locked ? bgPressed : bgDefault}
          flexDirection="row"
          alignItems="center"
          shadow={locked ? 0 : 4}
          mb={4}
          opacity={locked ? 0.5 : 1}
        >
          <Icon as={iconAs} name={iconName} color="white" size="xl" mr={4} />
          <VStack flexShrink={1}>
            <HStack alignItems="center" space={2}>
              <Text color="white" fontSize="xl" fontWeight="bold">
                {title}
              </Text>
              {locked && (
                <Icon
                  as={Ionicons}
                  name="lock-closed-outline"
                  color="white"
                  size="sm"
                />
              )}
            </HStack>
            <Text color="gray.200" fontSize="sm" numberOfLines={2}>
              {description}
            </Text>
          </VStack>
        </Box>
      )}
    </Pressable>
  );

  return (
    <Box style={styles.container} flex={1}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }} // Padding pour la navbar
        showsVerticalScrollIndicator={false}
      >
        <Box style={styles.content}>
          {/* Bloc de bienvenue stylisé */}
          <Box style={styles.welcomeBox}>
            <Text style={styles.welcomeTitle}>Bienvenue dans votre cave à vin</Text>
            <Text style={styles.welcomeSubtitle}>
              Gérez, découvrez et savourez votre collection personnelle 🍇
            </Text>
          </Box>

          {/* Anecdote */}
          <Box mb={6}>
            <AnecdoteVin />
          </Box>

          {/* Boutons actions */}
          <VStack space={4}>
            <ActionButton
              onPress={() => router.push({ pathname: "/liste-cave" })}
              bgDefault="#6e3b3b"
              bgPressed="#8e4b4b"
              iconAs={Ionicons}
              iconName="wine-outline"
              title="Ma Cave"
              description="Visualisez toutes vos bouteilles et gérez vos stocks."
            />

            <ActionButton
              onPress={() => router.push({ pathname: "/ajouter-bouteille" })}
              bgDefault="#4a604a"
              bgPressed="#5a755a"
              iconAs={Ionicons}
              iconName="add-circle-outline"
              title="Ajouter"
              description="Ajoutez une nouvelle bouteille à votre collection."
            />

            <ActionButton
              bgDefault="#525252"
              bgPressed="#6b6b6b"
              iconAs={Ionicons}
              iconName="bar-chart-outline"
              title="Statistiques"
              description="Fonctionnalité en cours de développement"
              locked={true}
            />
          </VStack>
        </Box>
      </ScrollView>
      <Navbar />
    </Box>
  );
};

const Secret: React.FC = () => (
  <NativeBaseProvider>
    <SecretContent />
  </NativeBaseProvider>
);

export default Secret;
