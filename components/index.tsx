import React from "react";
import { Pressable, ScrollView, Dimensions } from "react-native";
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
import styles from "../styles/IndexScreenStyles";

const { width } = Dimensions.get("window");

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
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Box
          p={5}
          rounded="2xl"
          bg={pressed ? bgPressed : bgDefault}
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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        <Box style={styles.content}>
          {/* Encadré Bienvenue responsive avec tes couleurs */}
          <Box
            alignSelf="center"
            w={width > 500 ? 420 : "90%"}
            minW={250}
            borderRadius={20}
            backgroundColor="#fffaf0" // couleur fond welcomeBox
            py={5}
            px={4}
            mb={6}
            shadow={3}
            alignItems="center"
          >
            <Text
              fontSize={26}
              fontWeight="bold"
              color="#6e3b3b"
              textAlign="center"
              letterSpacing={1}
              textTransform="uppercase"
              mb={1.5}
            >
              Bienvenue dans votre cave à vin
            </Text>
            <Text
              fontSize={15}
              color="#4b3832"
              textAlign="center"
              fontStyle="italic"
            >
              Gérez, découvrez et savourez votre collection personnelle 🍇
            </Text>
          </Box>

          <Box mb={6}>
            <AnecdoteVin />
          </Box>

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
              onPress={() => router.push({ pathname: "/cave-conseils" })}
              bgDefault="#525252"
              bgPressed="#6b6b6b"
              iconAs={Ionicons}
              iconName="bar-chart-outline"
              title="Statistiques"
              description="Découvrez vos recommandations et vos accords mets-vins."
              locked={false}
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
