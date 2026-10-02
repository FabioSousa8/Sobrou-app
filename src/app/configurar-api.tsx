import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { carregarApiKey, salvarApiKey } from "../Services/storage";

const PASSOS = [
  {
    num: "1",
    texto: 'Acesse o link abaixo e faça login com sua conta Google.',
  },
  {
    num: "2",
    texto: 'Clique em "Create API key" (Criar chave da API).',
  },
  {
    num: "3",
    texto: 'Copie a chave gerada (começa com "AIza...").',
  },
  {
    num: "4",
    texto: "Cole a chave no campo abaixo e toque em Salvar.",
  },
  {
    num: "5",
    texto: "Pronto! O Sobrou? já vai conseguir gerar suas receitas. 🎉",
  },
];

export default function ConfigurarApi() {
  const router = useRouter();
  const [chave, setChave] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [chaveCarregada, setChaveCarregada] = useState(false);

  useEffect(() => {
    carregarApiKey().then((k) => {
      if (k) {
        setChave(k);
        setChaveCarregada(true);
      }
    });
  }, []);

  async function handleSalvar() {
    const trimmed = chave.trim();
    if (!trimmed) {
      Alert.alert("Chave inválida", "Cole sua chave da API antes de salvar.");
      return;
    }
    if (!trimmed.startsWith("AIza")) {
      Alert.alert(
        "Formato inválido",
        'A chave Gemini começa com "AIza". Verifique se copiou corretamente.'
      );
      return;
    }
    setSalvando(true);
    try {
      await salvarApiKey(trimmed);
      Alert.alert(
        "✅ Chave salva!",
        "Sua chave foi salva. Agora você pode gerar receitas.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a chave. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Info box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#4CAF50" />
        <Text style={styles.infoText}>
          A API do Google Gemini é gratuita para uso pessoal. Nenhum cartão de
          crédito necessário.
        </Text>
      </View>

      {/* Campo da chave */}
      <Text style={styles.label}>Sua chave da API Gemini</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="AIzaSy..."
          placeholderTextColor="#555"
          value={chave}
          onChangeText={setChave}
          secureTextEntry={!mostrar}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.olhoBtn}
          onPress={() => setMostrar((v) => !v)}
        >
          <Ionicons
            name={mostrar ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {chaveCarregada && (
        <Text style={styles.jaConfigurado}>
          ✅ Chave já configurada — você pode substituí-la abaixo.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.btnSalvar, salvando && styles.btnDesabilitado]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        <Text style={styles.btnSalvarText}>
          {salvando ? "Salvando..." : "Salvar chave"}
        </Text>
      </TouchableOpacity>

      {/* Divisor */}
      <View style={styles.divider}>
        <View style={styles.linha} />
        <Text style={styles.dividerText}>Como conseguir sua chave</Text>
        <View style={styles.linha} />
      </View>

      {/* Passos */}
      {PASSOS.map((p) => (
        <View key={p.num} style={styles.passo}>
          <View style={styles.passoBadge}>
            <Text style={styles.passoBadgeText}>{p.num}</Text>
          </View>
          <Text style={styles.passoTexto}>{p.texto}</Text>
        </View>
      ))}

      {/* Botão para abrir o site */}
      <TouchableOpacity
        style={styles.btnLink}
        onPress={() =>
          Linking.openURL("https://aistudio.google.com/app/apikey")
        }
      >
        <Ionicons name="open-outline" size={18} color="#4CAF50" />
        <Text style={styles.btnLinkText}>Abrir Google AI Studio</Text>
      </TouchableOpacity>

      <View style={{ height: Platform.OS === "ios" ? 40 : 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  content: { padding: 20 },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#0d2b0d",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  infoText: { color: "#9ef09e", fontSize: 13, flex: 1, lineHeight: 20 },
  label: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingRight: 12,
    marginBottom: 8,
  },
  input: {
    color: "#fff",
    fontSize: 15,
    padding: 14,
  },
  olhoBtn: { padding: 4 },
  jaConfigurado: { color: "#4CAF50", fontSize: 12, marginBottom: 16 },
  btnSalvar: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  btnDesabilitado: { opacity: 0.5 },
  btnSalvarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  linha: { flex: 1, height: 1, backgroundColor: "#2a2a2a" },
  dividerText: { color: "#666", fontSize: 12, flexShrink: 0 },
  passo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  passoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1a3d1a",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  passoBadgeText: { color: "#4CAF50", fontSize: 13, fontWeight: "700" },
  passoTexto: { color: "#ccc", fontSize: 14, lineHeight: 22, flex: 1 },
  btnLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  btnLinkText: { color: "#4CAF50", fontSize: 15, fontWeight: "600" },
});
