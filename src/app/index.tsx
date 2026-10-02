import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { onboardingConcluido } from "../Services/storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const verificar = async () => {
      try {
        const concluido = await onboardingConcluido();
        if (concluido) {
          router.replace("/geladeira" as any);
        } else {
          router.replace("/onboarding" as any);
        }
      } catch {
        router.replace("/onboarding" as any);
      }
    };
    verificar();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
});
