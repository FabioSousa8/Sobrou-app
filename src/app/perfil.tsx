import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from "../Services/AppContext";

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
const TEMPOS = [
  { label: "⚡ 15 min", val: "15" },
  { label: "🕐 30 min", val: "30" },
  { label: "🍲 1 hora", val: "60" },
  { label: "👨‍🍳 Sem pressa", val: "120" },
];
const REFEICOES = [
  { label: "Qualquer", val: "qualquer" },
  { label: "☕ Café", val: "café da manhã" },
  { label: "🍱 Almoço", val: "almoço" },
  { label: "🌙 Jantar", val: "jantar" },
  { label: "🥪 Lanche", val: "lanche" },
  { label: "🍮 Sobremesa", val: "sobremesa" },
];

export default function Perfil() {
  const {
    dietas,
    setDietas,
    alergias,
    setAlergias,
    nivel,
    setNivel,
    tempo,
    setTempo,
    refeicao,
    setRefeicao,
  } = useApp();

  function toggleDieta(val: string) {
    setDietas(
      dietas.includes(val) ? dietas.filter((d) => d !== val) : [...dietas, val],
    );
  }

  function toggleAlergia(val: string) {
    setAlergias(
      alergias.includes(val)
        ? alergias.filter((a) => a !== val)
        : [...alergias, val],
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Seu perfil</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🥗 Tipo de dieta</Text>
        <View style={styles.chipWrap}>
          {DIETAS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, dietas.includes(d) && styles.chipSelGreen]}
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
        <Text style={styles.cardTitle}>⚠️ Alergias</Text>
        <View style={styles.chipWrap}>
          {ALERGIAS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.chip, alergias.includes(a) && styles.chipSelAmber]}
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
        <Text style={styles.cardTitle}>👨‍🍳 Nível na cozinha</Text>
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
        <Text style={styles.cardTitle}>⏱️ Tempo disponível</Text>
        <View style={styles.chipWrap}>
          {TEMPOS.map((t) => (
            <TouchableOpacity
              key={t.val}
              style={[styles.chip, tempo === t.val && styles.chipSelBlue]}
              onPress={() => setTempo(t.val)}
            >
              <Text
                style={[
                  styles.chipText,
                  tempo === t.val && styles.chipTextBlue,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, { marginBottom: 40 }]}>
        <Text style={styles.cardTitle}>🍽️ Refeição</Text>
        <View style={styles.chipWrap}>
          {REFEICOES.map((r) => (
            <TouchableOpacity
              key={r.val}
              style={[styles.chip, refeicao === r.val && styles.chipSelGreen]}
              onPress={() => setRefeicao(r.val)}
            >
              <Text
                style={[
                  styles.chipText,
                  refeicao === r.val && styles.chipTextGreen,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", padding: 16 },
  title: { fontSize: 22, fontWeight: "600", color: "#fff", marginBottom: 16 },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
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
});
