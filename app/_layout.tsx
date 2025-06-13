import React from "react";
import { NativeBaseProvider } from "native-base";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <NativeBaseProvider>
      <Slot />
    </NativeBaseProvider>
  );
}
