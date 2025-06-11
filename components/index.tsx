// components/Secret.tsx

import React from "react";
import { Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Box, Text, Icon, VStack, HStack, Alert, NativeBaseProvider } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

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
          rounded="xl"
          bg={pressed ? bgPressed : bgDefault}
          flexDirection="row"
          alignItems="center"
          shadow={3}
        >
          <Icon as={iconAs} name={iconName} color="white" size="lg" mr={4} />
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
    <Box flex={1} bg="brown.900">
      {/* Header statique (plus de clic) */}
      <Box
        px={4}
        pt={0}
        pb={2}
        bg="brown.800"
        borderBottomRadius="3xl"
        shadow={3}
        alignItems="center"
      >
        <Image
          source={require("../assets/wine_cellar.png")}
          style={{
            width: 180,
            height: 180,
            resizeMode: "contain",
            marginBottom: 10,
          }}
        />
      </Box>

      {/* Navbar avec titre */}
      <Navbar title="Ma Cave à Vin" />

      {/* Alertes */}
      <Box px={4} mt={4} mb={4}>
        <Alert
          w="100%"
          status="info"
          variant="left-accent"
          rounded="md"
          backgroundColor="info.100"
        >
          <HStack space={2} alignItems="center">
            <Icon
              as={Ionicons}
              name="information-circle-outline"
              size="md"
              color="info.600"
            />
            <Text fontSize="sm" color="info.800" flexShrink={1}>
              📌 Nouveau : Ajoutez vos bouteilles et gérez votre stock depuis cette app.
            </Text>
          </HStack>
        </Alert>
      </Box>

      {/* Modules principaux */}
      <VStack space={4} px={4}>
        <ActionButton
          onPress={() => router.push({ pathname: "/liste-cave" })}
          bgDefault="red.700"
          bgPressed="red.600"
          iconAs={Ionicons}
          iconName="wine-outline"
          title="Ma Cave"
          description="Visualisez toutes vos bouteilles et gérez vos stocks."
        />

        <ActionButton
          onPress={() => router.push({ pathname: "/ajouter-bouteille" })}
          bgDefault="green.700"
          bgPressed="green.600"
          iconAs={Ionicons}
          iconName="add-circle-outline"
          title="Ajouter"
          description="Ajoutez une nouvelle bouteille à votre collection."
        />

        <ActionButton
          onPress={() => router.push({ pathname: "/" })}
          bgDefault="blue.700"
          bgPressed="blue.600"
          iconAs={MaterialIcons}
          iconName="bar-chart"
          title="Statistiques"
          description="Analysez votre cave et optimisez vos achats."
        />
      </VStack>

      {/* Footer Navbar */}
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
