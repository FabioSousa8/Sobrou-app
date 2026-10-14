import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppProvider } from "../Services/AppContext";

function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const navegar = (rota: string) => {
    setVisible(false);
    // replace em vez de push: evita stack orfão ao usar o botão voltar
    router.replace(rota as any);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ marginRight: 16 }}
      >
        <Ionicons name="menu" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>⚙️ Configurações</Text>
            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navegar("/meu-perfil")}
            >
              <Ionicons name="person-outline" size={20} color="#ccc" />
              <Text style={styles.menuText}>Meu perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="star-outline" size={20} color="#ccc" />
              <View style={styles.menuItemRow}>
                <Text style={styles.menuText}>Modo Fit Premium</Text>
                <View style={styles.badgeEmBreve}>
                  <Text style={styles.badgeText}>Em breve</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navegar("/sobre")}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#ccc"
              />
              <Text style={styles.menuText}>Sobre o Sobrou?</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default function Layout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#1a1a1a" },
          headerTintColor: "#fff",
          tabBarStyle: { backgroundColor: "#1a1a1a", borderTopColor: "#333" },
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "#888",
          headerRight: () => <HamburgerMenu />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ href: null, headerShown: false }}
        />
        <Tabs.Screen name="onboarding" options={{ href: null }} />

        {/* Telas do menu hamburguer: ficam fora das abas mas têm header */}
        <Tabs.Screen
          name="meu-perfil"
          options={{
            href: null,
            title: "Meu perfil",
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="sobre"
          options={{
            href: null,
            title: "Sobre o Sobrou?",
            tabBarStyle: { display: "none" },
          }}
        />

        {/* Abas principais */}
        <Tabs.Screen
          name="geladeira"
          options={{
            title: "Geladeira",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="snow-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favoritos"
          options={{
            title: "Salvos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />

      </Tabs>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 12,
  },
  menu: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 8,
    minWidth: 240,
  },
  menuTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuText: {
    color: "#ccc",
    fontSize: 15,
  },
  badgeEmBreve: {
    backgroundColor: "#333",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#888",
    fontSize: 11,
  },
});
