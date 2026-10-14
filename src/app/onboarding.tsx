import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../Services/AppContext";
import { marcarOnboardingConcluido, salvarPerfil } from "../Services/storage";

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
  "🟫 Glúten",
  "🥛 Leite",
  "🌰 Nozes",
];

// Valores normalizados — mesmos usados em meu-perfil.tsx
const NIVEIS = [
  { label: "🔰 Iniciante", val: "iniciante" },
  { label: "🍳 Intermediário", val: "intermediário" },
  { label: "👨‍🍳 Avançado", val: "avançado" },
];

const REFEICOES = [
  { label: "☀️ Café da manhã", val: "café da manhã" },
  { label: "🌤️ Almoço", val: "almoço" },
  { label: "🌙 Jantar", val: "jantar" },
  { label: "🍎 Lanche", val: "lanche" },
];

export default function Onboarding() {
  const router = useRouter();
  const { setPerfil } = useApp();

  const [etapa, setEtapa] = useState(0);
  const [nome, setNome] = useState("");
  const [dietas, setDietas] = useState<string[]>([]);
  const [alergias, setAlergias] = useState<string[]>([]);
  const [outrasAlergias, setOutrasAlergias] = useState("");
  const [nivel, setNivel] = useState("");
  const [refeicaoPreferida, setRefeicaoPreferida] = useState("");
  const [comidasFavoritas, setComidasFavoritas] = useState("");

  const totalEtapas = 5;

  const toggle = (
    list: string[],
    setList: (l: string[]) => void,
    item: string,
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const avancar = async () => {
    // Validações por etapa
    if (etapa === 0 && !nome.trim()) {
      Alert.alert("Nome obrigatório", "Por favor, insira seu nome para continuar.");
      return;
    }

    if (etapa < totalEtapas - 1) {
      setEtapa(etapa + 1);
    } else {
      const todasAlergias = [
        ...alergias,
        ...outrasAlergias
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      ];
      const perfilFinal = {
        nome: nome.trim(),
        dietas,
        alergias: todasAlergias,
        nivel,
        refeicaoPreferida,
        comidasFavoritas,
      };
      await salvarPerfil(perfilFinal);
      await marcarOnboardingConcluido();
      setPerfil(perfilFinal);
      router.replace("/geladeira" as any);
    }
  };

  const renderDots = () => (
    <View style={styles.dots}>
      {Array.from({ length: totalEtapas }).map((_, i) => (
        <View key={i} style={[styles.dot, i === etapa && styles.dotAtivo]} />
      ))}
    </View>
  );

  const renderEtapa = () => {
    switch (etapa) {
      case 0:
        return (
          <View style={styles.etapaContainer}>
            <Text style={styles.titulo}>👋 Olá! Bem-vindo ao Sobrou?</Text>
            <Text style={styles.subtitulo}>Como devo te chamar?</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome ou apelido..."
              placeholderTextColor="#666"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={avancar}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.etapaContainer}>
            <Text style={styles.titulo}>🥗 Tipo de dieta</Text>
            <Text style={styles.subtitulo}>
              Você segue alguma dieta especial?{"\n"}
              <Text style={styles.opcional}>(Opcional — pule se não se aplica)</Text>
            </Text>
            <View style={styles.chips}>
              {DIETAS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, dietas.includes(d) && styles.chipAtivo]}
                  onPress={() => toggle(dietas, setDietas, d)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      dietas.includes(d) && styles.chipTextAtivo,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.etapaContainer}>
            <Text style={styles.titulo}>⚠️ Alergias</Text>
            <Text style={styles.subtitulo}>
              Você tem alguma alergia alimentar?{"\n"}
              <Text style={styles.opcional}>(Opcional — a IA vai evitar esses ingredientes)</Text>
            </Text>
            <View style={styles.chips}>
              {ALERGIAS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[
                    styles.chip,
                    alergias.includes(a) && styles.chipAlergia,
                  ]}
                  onPress={() => toggle(alergias, setAlergias, a)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      alergias.includes(a) && styles.chipTextAtivo,
                    ]}
                  >
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>
              Outras alergias (separadas por vírgula):
            </Text>
            <TextInput
              style={styles.input}
              value={outrasAlergias}
              onChangeText={setOutrasAlergias}
              placeholder="Ex: pimenta, camarão, gergelim..."
              placeholderTextColor="#666"
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.etapaContainer}>
            <Text style={styles.titulo}>👨‍🍳 Nível na cozinha</Text>
            <Text style={styles.subtitulo}>
              Como você se define na cozinha?
            </Text>
            <View style={styles.chips}>
              {NIVEIS.map((n) => (
                <TouchableOpacity
                  key={n.val}
                  style={[styles.chip, nivel === n.val && styles.chipAtivo]}
                  onPress={() => setNivel(n.val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      nivel === n.val && styles.chipTextAtivo,
                    ]}
                  >
                    {n.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.etapaContainer}>
            <Text style={styles.titulo}>❤️ Seus gostos</Text>
            <Text style={styles.subtitulo}>Refeição preferida:</Text>
            <View style={styles.chips}>
              {REFEICOES.map((r) => (
                <TouchableOpacity
                  key={r.val}
                  style={[
                    styles.chip,
                    refeicaoPreferida === r.val && styles.chipAtivo,
                  ]}
                  onPress={() => setRefeicaoPreferida(r.val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      refeicaoPreferida === r.val && styles.chipTextAtivo,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Comidas favoritas:</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              value={comidasFavoritas}
              onChangeText={setComidasFavoritas}
              placeholder="Ex: frango à milanesa, macarrão, churrasco..."
              placeholderTextColor="#666"
              multiline
            />
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {renderDots()}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderEtapa()}
        </ScrollView>
        <View style={styles.botoes}>
          {etapa > 0 && (
            <TouchableOpacity
              style={styles.btnVoltar}
              onPress={() => setEtapa(etapa - 1)}
            >
              <Text style={styles.btnVoltarText}>← Voltar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnAvancar} onPress={avancar}>
            <Text style={styles.btnAvancarText}>
              {etapa === totalEtapas - 1 ? "✅ Começar!" : "Avançar →"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingTop: 60 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#444" },
  dotAtivo: { backgroundColor: "#4CAF50", width: 20 },
  etapaContainer: { paddingHorizontal: 24, paddingBottom: 24 },
  titulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitulo: { color: "#aaa", fontSize: 15, marginBottom: 20, lineHeight: 22 },
  opcional: { color: "#555", fontSize: 13 },
  label: { color: "#aaa", fontSize: 14, marginTop: 16, marginBottom: 8 },
  input: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipAtivo: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  chipAlergia: { backgroundColor: "#b45309", borderColor: "#b45309" },
  chipText: { color: "#ccc", fontSize: 13 },
  chipTextAtivo: { color: "#fff", fontWeight: "bold" },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  btnVoltar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
  },
  btnVoltarText: { color: "#aaa", fontSize: 15 },
  btnAvancar: {
    flex: 2,
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnAvancarText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
});
