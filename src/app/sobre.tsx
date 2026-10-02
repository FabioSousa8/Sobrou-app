import { Ionicons } from "@expo/vector-icons";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FUNCIONALIDADES = [
  "Gerar receitas personalizadas com IA",
  "Identificar ingredientes por foto",
  "Priorizar ingredientes a vencer",
  "Salvar e avaliar receitas favoritas",
  "Compartilhar receitas com amigos",
  "Adicionar anotações às receitas",
  "Perfil com dieta e alergias",
];

const EM_BREVE = [
  "Modo Fit Premium com metas calóricas",
  "Lista de compras automática",
  "Histórico e estatísticas de cozinha",
  "Receitas por voz",
  "Modo offline com receitas salvas",
];

export default function Sobre() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🥗</Text>
        <Text style={styles.heroNome}>Sobrou?</Text>
        <Text style={styles.heroVersao}>Versão 1.0.0</Text>
        <Text style={styles.heroSlogan}>
          Transforme o que tem na geladeira em pratos incríveis.
        </Text>
      </View>

      {/* Sobre */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>O que é</Text>
        <Text style={styles.secaoTexto}>
          O Sobrou? usa inteligência artificial para criar receitas
          personalizadas a partir dos ingredientes que você já tem em casa —
          evitando desperdício e tornando cada refeição uma experiência especial.
        </Text>
      </View>

      {/* Tecnologia */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Tecnologia</Text>
        <View style={styles.techCard}>
          <Ionicons name="sparkles" size={20} color="#4CAF50" />
          <View style={{ flex: 1 }}>
            <Text style={styles.techNome}>Google Gemini 2.0 Flash</Text>
            <Text style={styles.techDesc}>
              Modelo de IA generativa de última geração para criação de receitas
              criativas e identificação de ingredientes por foto.
            </Text>
          </View>
        </View>
      </View>

      {/* Funcionalidades atuais */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Funcionalidades</Text>
        {FUNCIONALIDADES.map((f, i) => (
          <View key={i} style={styles.item}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.itemTexto}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Em breve */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Em breve ✨</Text>
        {EM_BREVE.map((f, i) => (
          <View key={i} style={styles.item}>
            <Ionicons name="time-outline" size={18} color="#888" />
            <Text style={[styles.itemTexto, { color: "#777" }]}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Link */}
      <TouchableOpacity
        style={styles.btnLink}
        onPress={() =>
          Linking.openURL("https://aistudio.google.com/app/apikey")
        }
      >
        <Ionicons name="open-outline" size={17} color="#4CAF50" />
        <Text style={styles.btnLinkText}>Powered by Google AI Studio</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Feito com 💚 para quem quer usar o que tem e não desperdiçar nada.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { padding: 20, paddingBottom: 48 },
  hero: { alignItems: "center", paddingVertical: 32 },
  heroEmoji: { fontSize: 56, marginBottom: 12 },
  heroNome: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  heroVersao: { fontSize: 12, color: "#555", marginBottom: 12 },
  heroSlogan: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  secao: { marginBottom: 28 },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4CAF50",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  secaoTexto: { color: "#aaa", fontSize: 14, lineHeight: 24 },
  techCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
  },
  techNome: { color: "#fff", fontSize: 15, fontWeight: "600", marginBottom: 4 },
  techDesc: { color: "#888", fontSize: 13, lineHeight: 20 },
  item: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  itemTexto: { color: "#ccc", fontSize: 14, flex: 1, lineHeight: 20 },
  btnLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  btnLinkText: { color: "#4CAF50", fontSize: 14 },
  rodape: {
    color: "#444",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
