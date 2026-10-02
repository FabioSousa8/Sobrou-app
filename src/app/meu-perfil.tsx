import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from "../Services/AppContext";
import { salvarPerfil } from "../Services/storage";

const DIETAS = [
  "🌱 Vegana",
  "🥦 Vegetariana",
  "🌾 Sem glúten",
  "🥛 Sem lactose",
  "🥑 Cetogênica",
  "📉 Low carb",
];
const ALERGIAS = [
  "🥜 Amendoim",
  "🦐 Frutos do mar",
  "🥚 Ovo",
  "🫘 Soja",
  "🍞 Glúten",
  "🥛 Leite",
  "🌰 Nozes",
];
const NIVEIS = [
  { label: "🔰 Iniciante", val: "iniciante" },
  { label: "🍳 Intermediário", val: "intermediário" },
  { label: "👨‍🍳 Avançado", val: "avançado" },
];
const REFEICOES = [
  { label: "☕ Café", val: "café da manhã" },
  { label: "🍱 Almoço", val: "almoço" },
  { label: "🌙 Jantar", val: "jantar" },
  { label: "🥪 Lanche", val: "lanche" },
];

export default function MeuPerfil() {
  const { perfil, setPerfil } = useApp();

  const [nome, setNome] = useState(perfil?.nome || "");
  const [dietas, setDietas] = useState<string[]>(perfil?.dietas || []);
  const [alergias, setAlergias] = useState<string[]>(perfil?.alergias || []);
  const [nivel, setNivel] = useState(perfil?.nivel || "iniciante");
  const [refeicaoPreferida, setRefeicaoPreferida] = useState(
    perfil?.refeicaoPreferida || "almoço",
  );
  const [comidasFavoritas, setComidasFavoritas] = useState(
    perfil?.comidasFavoritas || "",
  );

  function toggleDieta(val: string) {
    setDietas((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val],
    );
  }

  function toggleAlergia(val: string) {
    setAlergias((prev) =>
      prev.includes(val) ? prev.filter((a) => a !== val) : [...prev, val],
    );
  }

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert("Nome obrigatório", "Por favor, insira seu nome.");
      return;
    }
    const perfilAtualizado = {
      nome,
      dietas,
      alergias,
      nivel,
      refeicaoPreferida,
      comidasFavoritas,
    };
    await salvarPerfil(perfilAtualizado);
    setPerfil(perfilAtualizado);
    Alert.alert("✅ Perfil salvo!", "Suas preferências foram atualizadas.", [
      { text: "OK", onPress: () => router.replace('/geladeira' as any) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/geladeira' as any)}>
            <Text style={styles.voltar}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Meu perfil</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>👤 Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome..."
              placeholderTextColor="#555"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>🥗 Restrições alimentares</Text>
            <View style={styles.chipWrap}>
              {DIETAS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.chip,
                    dietas.includes(d) && styles.chipSelGreen,
                  ]}
                  onPress={() => toggleDieta(d)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      dietas.includes(d) && styles.chipTextGreen,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>⚠️ Alergias</Text>
            <View style={styles.chipWrap}>
              {ALERGIAS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[
                    styles.chip,
                    alergias.includes(a) && styles.chipSelAmber,
                  ]}
                  onPress={() => toggleAlergia(a)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      alergias.includes(a) && styles.chipTextAmber,
                    ]}
                  >
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>👨‍🍳 Nível na cozinha</Text>
            <View style={styles.chipWrap}>
              {NIVEIS.map((n) => (
                <TouchableOpacity
                  key={n.val}
                  style={[styles.chip, nivel === n.val && styles.chipSelBlue]}
                  onPress={() => setNivel(n.val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      nivel === n.val && styles.chipTextBlue,
                    ]}
                  >
                    {n.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>🍽️ Refeição preferida</Text>
            <View style={styles.chipWrap}>
              {REFEICOES.map((r) => (
                <TouchableOpacity
                  key={r.val}
                  style={[
                    styles.chip,
                    refeicaoPreferida === r.val && styles.chipSelGreen,
                  ]}
                  onPress={() => setRefeicaoPreferida(r.val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      refeicaoPreferida === r.val && styles.chipTextGreen,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>❤️ Pratos favoritos</Text>
            <Text style={styles.cardDica}>
              A IA vai sugerir versões adaptadas dos seus pratos preferidos.
            </Text>
            <TextInput
              style={[
                styles.input,
                { height: 100, textAlignVertical: "top", paddingTop: 12 },
              ]}
              value={comidasFavoritas}
              onChangeText={setComidasFavoritas}
              placeholder="Ex: frango à milanesa, lasanha, tacos..."
              placeholderTextColor="#555"
              multiline
            />
          </View>

          <TouchableOpacity style={styles.salvarBtn} onPress={salvar}>
            <Text style={styles.salvarBtnText}>💾 Salvar alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  voltar: { color: "#4CAF50", fontSize: 15, width: 60 },
  headerTitulo: { fontSize: 17, fontWeight: "700", color: "#fff" },
  scroll: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  cardDica: { fontSize: 13, color: "#888", marginBottom: 10 },
  input: {
    backgroundColor: "#111",
    borderWidth: 0.5,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 15,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 0.5,
    borderColor: "#333",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#111",
  },
  chipText: { fontSize: 13, color: "#888" },
  chipSelGreen: { backgroundColor: "#1a3d1a", borderColor: "#4CAF50" },
  chipTextGreen: { color: "#4CAF50", fontWeight: "600" },
  chipSelAmber: { backgroundColor: "#3d2a0a", borderColor: "#f0a030" },
  chipTextAmber: { color: "#f0a030", fontWeight: "600" },
  chipSelBlue: { backgroundColor: "#0d2a3d", borderColor: "#378ADD" },
  chipTextBlue: { color: "#378ADD", fontWeight: "600" },
  salvarBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  salvarBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
