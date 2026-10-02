import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from "../Services/AppContext";
import { gerarTexto } from "../Services/ia";

export default function Gerar() {
  const {
    ingredientes,
    vencer,
    dietas,
    alergias,
    nivel,
    tempo,
    refeicao,
    favoritos,
    setFavoritos,
    ultimaReceita,
    setUltimaReceita,
  } = useApp();
  const [gerando, setGerando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  async function gerarReceita() {
    if (ingredientes.length === 0) {
      Alert.alert(
        "Adicione ingredientes",
        "Vá na aba Geladeira e adicione o que você tem em casa.",
      );
      return;
    }
    setGerando(true);
    setSalvo(false);
    setUltimaReceita("");

    const ingsDesc = ingredientes.map((i) => `${i.nome} (${i.qty})`).join(", ");
    const dietaStr = dietas.length ? `Dieta: ${dietas.join(", ")}.` : "";
    const alergStr = alergias.length
      ? `ALERGIAS — NUNCA USE: ${alergias.join(", ")}.`
      : "";
    const vencerStr = vencer.length
      ? `Priorize estes ingredientes que vencem em breve: ${vencer.join(", ")}.`
      : "";

    const prompt = `Você é um chef acolhedor e criativo. Crie uma receita personalizada em português do Brasil.

INGREDIENTES DISPONÍVEIS: ${ingsDesc}
REFEIÇÃO: ${refeicao}
${dietaStr}
${alergStr}
NÍVEL DO COZINHEIRO: ${nivel}
TEMPO MÁXIMO: ${tempo === "120" ? "sem limite de tempo" : tempo + " minutos"}
${vencerStr}

Use APENAS os ingredientes listados (suponha que há sal, azeite/óleo e condimentos básicos). Adapte ao nível do cozinheiro. Não use markdown (sem asteriscos ou #).

Responda neste formato:

🍽️ NOME DA RECEITA
[nome criativo]

⏱️ Tempo: X min | 👨‍🍳 Dificuldade: Fácil/Médio/Difícil | 🍴 Porções: N

📝 INGREDIENTES
[lista com quantidades]

👨‍🍳 MODO DE PREPARO
[passo a passo numerado]

💡 DICA ESPECIAL
[dica para deixar incrível]`;

    try {
      const texto = await gerarTexto(prompt);
      setUltimaReceita(texto);
    } catch (e: any) {
      Alert.alert(
        "Erro ao gerar receita",
        e?.message || "Verifique sua conexão.",
      );
    }
    setGerando(false);
  }

  function salvarReceita() {
    if (!ultimaReceita) return;
    const linhas = ultimaReceita.split("\n");
    let nome = "Receita salva";
    for (const linha of linhas) {
      const l = linha.trim();
      if (
        l &&
        !l.startsWith("🍽️") &&
        !l.startsWith("⏱️") &&
        !l.startsWith("📝") &&
        !l.startsWith("👨‍🍳") &&
        !l.startsWith("💡") &&
        !l.includes("NOME")
      ) {
        nome = l;
        break;
      }
    }
    const nova = {
      nome,
      texto: ultimaReceita,
      ingredientes: ingredientes.map((i) => i.nome).join(", "),
      data: new Date().toLocaleDateString("pt-BR"),
    };
    setFavoritos([nova, ...favoritos]);
    setSalvo(true);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>✨ Gerar receita</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Ingredientes</Text>
            <Text style={styles.gridVal}>{ingredientes.length}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Refeição</Text>
            <Text style={styles.gridVal}>{refeicao}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Nível</Text>
            <Text style={styles.gridVal}>{nivel}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Tempo</Text>
            <Text style={styles.gridVal}>
              {tempo === "120" ? "Livre" : tempo + "min"}
            </Text>
          </View>
        </View>
        {dietas.length > 0 && (
          <Text style={styles.dietaLine}>🥗 {dietas.join(", ")}</Text>
        )}
        {alergias.length > 0 && (
          <Text style={styles.alergiaLine}>⚠️ Sem: {alergias.join(", ")}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.mainBtn, gerando && styles.mainBtnDisabled]}
        onPress={gerarReceita}
        disabled={gerando}
      >
        {gerando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.mainBtnText}>✨ Gerar receita com IA</Text>
        )}
      </TouchableOpacity>

      {ultimaReceita !== "" && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>{ultimaReceita}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, salvo && styles.actionBtnSalvo]}
              onPress={salvarReceita}
              disabled={salvo}
            >
              <Text style={styles.actionBtnText}>
                {salvo ? "✅ Salva!" : "⭐ Salvar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={gerarReceita}
              disabled={gerando}
            >
              <Text style={styles.actionBtnText}>🔄 Outra</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
  },
  gridLabel: { fontSize: 11, color: "#666", marginBottom: 2 },
  gridVal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
  dietaLine: { fontSize: 13, color: "#4CAF50", marginTop: 10 },
  alergiaLine: { fontSize: 13, color: "#f0a030", marginTop: 4 },
  mainBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  mainBtnDisabled: { opacity: 0.6 },
  mainBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  resultCard: { backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16 },
  resultText: { color: "#ddd", fontSize: 14, lineHeight: 24 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderWidth: 0.5,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  actionBtnSalvo: { borderColor: "#4CAF50", backgroundColor: "#1a3d1a" },
  actionBtnText: { color: "#aaa", fontSize: 14, fontWeight: "500" },
});
