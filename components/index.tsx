import React from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  Box,
  Text,
  Icon,
  VStack,
  NativeBaseProvider,
  HStack,
} from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";
import AnecdoteVin from "../components/AnecdoteVin";
import styles from "../styles/IndexScreenStyles";

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
  }: {
    onPress: () => void;
    bgDefault: string;
    bgPressed: string;
    iconAs: any;
    iconName: string;
    title: string;
    description: string;
  }) => (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Box
          p={5}
          rounded="2xl"
          bg={pressed ? bgPressed : bgDefault}
          flexDirection="row"
          alignItems="center"
          shadow={4}
          mb={4}
        >
          <Icon as={iconAs} name={iconName} color="white" size="xl" mr={4} />
          <VStack flexShrink={1}>
            <Text color="white" fontSize="xl" fontWeight="bold">
              {title}
            </Text>
            <Text color="gray.200" fontSize="sm" numberOfLines={2}>
              {description}
            </Text>
          </VStack>
        </Box>
      )}
    </Pressable>
  );

  return (
    <Box style={styles.container}>
      <Box style={styles.content}>
        {/* Titre principal */}
        <Text style={styles.title}>Bienvenue dans votre cave à vin</Text>
        <Text style={styles.paragraph}>
          Découvrez des anecdotes, gérez vos bouteilles et explorez vos
          statistiques 🍷
        </Text>

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
            onPress={() => router.push({ pathname: "/" })}
            bgDefault="#3b4a6e"
            bgPressed="#4b5e8e"
            iconAs={MaterialIcons}
            iconName="bar-chart"
            title="Statistiques"
            description="Analysez votre cave et optimisez vos achats."
          />
        </VStack>
      </Box>

      {/* Barre de navigation bas */}
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
