// src/app/geladeira.tsx
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../Services/AppContext";
import { gerarTexto, identificarIngredientes } from "../Services/ia";

type IngredienteLocal = {
  nome: string;
  quantidade: string;
};

export default function Geladeira() {
  const { perfil, salvarFavorito, refeicaoSessao, setRefeicaoSessao } =
    useApp();

  const [ingredientes, setIngredientes] = useState<IngredienteLocal[]>([]);
  const [vencer, setVencer] = useState<string[]>([]);
  const [inputManual, setInputManual] = useState("");
  const [inputVencer, setInputVencer] = useState("");
  const [qtdSelecionada, setQtdSelecionada] = useState("médio");
  const [carregandoFoto, setCarregandoFoto] = useState(false);

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalReceita, setModalReceita] = useState(false);
  const [receitaGerada, setReceitaGerada] = useState("");
  const [gerando, setGerando] = useState(false);
  const [receitaSalva, setReceitaSalva] = useState(false);

  const totalItens = ingredientes.length + vencer.length;

  const adicionarManual = () => {
    const nome = inputManual.trim();
    if (!nome) return;
    setIngredientes([...ingredientes, { nome, quantidade: qtdSelecionada }]);
    setInputManual("");
  };

  const adicionarVencer = () => {
    const nome = inputVencer.trim();
    if (!nome) return;
    setVencer([...vencer, nome]);
    setInputVencer("");
  };

  const removerIngrediente = (idx: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== idx));
  };

  const removerVencer = (idx: number) => {
    setVencer(vencer.filter((_, i) => i !== idx));
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Precisamos da câmera para identificar ingredientes.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0].base64) return;

    setCarregandoFoto(true);
    try {
      const resposta = await identificarIngredientes(result.assets[0].base64);
      const novos: IngredienteLocal[] = resposta
        .split("\n")
        .filter(Boolean)
        .map((nome) => ({ nome: nome.trim(), quantidade: "médio" }));
      setIngredientes([...ingredientes, ...novos]);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setCarregandoFoto(false);
    }
  };

  const gerarReceita = async () => {
    setModalConfirmar(false);
    setGerando(true);
    setReceitaGerada("");
    setReceitaSalva(false);
    setModalReceita(true);

    try {
      const listaIngredientes = ingredientes
        .map((i) => `${i.nome} (${i.quantidade})`)
        .join(", ");

      const listaVencer = vencer.length
        ? `\nIngredientes perto do vencimento (priorizar): ${vencer.join(", ")}`
        : "";

      const dietaInfo = perfil?.dietas?.length
        ? `\nDieta: ${perfil.dietas.join(", ")}`
        : "";

      const alergiaInfo = perfil?.alergias?.length
        ? `\nAlergias (EVITAR): ${perfil.alergias.join(", ")}`
        : "";

      const nivelInfo = perfil?.nivel
        ? `\nNível na cozinha: ${perfil.nivel}`
        : "";
      const nomeUsuario = perfil?.nome ? `para ${perfil.nome}` : "";

      const prompt = `Você é um chef criativo. Crie uma receita deliciosa ${nomeUsuario} usando principalmente estes ingredientes: ${listaIngredientes}${listaVencer}${dietaInfo}${alergiaInfo}${nivelInfo}\nRefeição: ${refeicaoSessao}\n\nFormate a receita com: nome, tempo de preparo, ingredientes completos e modo de preparo passo a passo. Seja detalhado e motivador!`;

      const resultado = await gerarTexto(prompt);
      setReceitaGerada(resultado);
    } catch (e: any) {
      setReceitaGerada(`Erro ao gerar receita: ${e.message}`);
    } finally {
      setGerando(false);
    }
  };

  const handleSalvar = () => {
    if (!receitaGerada) return;
    const titulo =
      receitaGerada.split("\n")[0].replace(/[#*]/g, "").trim() ||
      "Receita sem título";
    salvarFavorito({
      id: Date.now().toString(),
      titulo,
      conteudo: receitaGerada,
      savedAt: new Date().toISOString(),
    });
    setReceitaSalva(true);
    Alert.alert("✅ Salvo!", "Receita adicionada aos seus favoritos.");
  };

  const QUANTIDADES = ["pouco", "médio", "bastante"];
  const REFEICOES = [
    "Café da manhã",
    "Almoço",
    "Lanche",
    "Jantar",
    "Sobremesa",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.secaoTitulo}>🧺 Ingredientes disponíveis</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: frango, arroz, cebola..."
            placeholderTextColor="#666"
            value={inputManual}
            onChangeText={setInputManual}
            onSubmitEditing={adicionarManual}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.btnAdd} onPress={adicionarManual}>
            <Text style={styles.btnAddText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.qtdRow}>
          {QUANTIDADES.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.qtdBtn,
                qtdSelecionada === q && styles.qtdBtnAtivo,
              ]}
              onPress={() => setQtdSelecionada(q)}
            >
              <Text
                style={[
                  styles.qtdText,
                  qtdSelecionada === q && styles.qtdTextAtivo,
                ]}
              >
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnFoto}
          onPress={tirarFoto}
          disabled={carregandoFoto}
        >
          {carregandoFoto ? (
            <ActivityIndicator color="#4CAF50" />
          ) : (
            <Text style={styles.btnFotoText}>📷 Identificar por foto</Text>
          )}
        </TouchableOpacity>

        <View style={styles.tagsContainer}>
          {ingredientes.map((ing, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tag}
              onPress={() => removerIngrediente(idx)}
            >
              <Text style={styles.tagText}>
                {ing.nome} · {ing.quantidade} ✕
              </Text>
            </TouchableOpacity>
          ))}
          {ingredientes.length === 0 && (
            <Text style={styles.vazio}>Nenhum ingrediente ainda.</Text>
          )}
        </View>

        <Text style={styles.secaoTitulo}>⚠️ Prestes a vencer</Text>
        <Text style={styles.secaoSub}>
          Esses ingredientes serão priorizados na receita
        </Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: leite, tomate..."
            placeholderTextColor="#666"
            value={inputVencer}
            onChangeText={setInputVencer}
            onSubmitEditing={adicionarVencer}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.btnAdd} onPress={adicionarVencer}>
            <Text style={styles.btnAddText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {vencer.map((nome, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.tag, styles.tagVencer]}
              onPress={() => removerVencer(idx)}
            >
              <Text style={styles.tagText}>{nome} ✕</Text>
            </TouchableOpacity>
          ))}
          {vencer.length === 0 && (
            <Text style={styles.vazio}>Nenhum ingrediente a vencer.</Text>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {totalItens > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnGerar}
            onPress={() => setModalConfirmar(true)}
          >
            <Text style={styles.btnGerarText}>
              ✨ Gerar receita ({totalItens}{" "}
              {totalItens === 1 ? "item" : "itens"})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL: Confirmar refeição */}
      <Modal
        visible={modalConfirmar}
        transparent
        animationType="slide"
        onRequestClose={() => setModalConfirmar(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalConfirmar(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>🍽️ Qual refeição?</Text>
            {REFEICOES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.refeicaoBtn,
                  refeicaoSessao === r && styles.refeicaoBtnAtivo,
                ]}
                onPress={() => setRefeicaoSessao(r)}
              >
                <Text
                  style={[
                    styles.refeicaoText,
                    refeicaoSessao === r && styles.refeicaoTextAtivo,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.btnConfirmar}
              onPress={gerarReceita}
            >
              <Text style={styles.btnConfirmarText}>Gerar agora ✨</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* MODAL: Receita gerada */}
      <Modal
        visible={modalReceita}
        transparent
        animationType="slide"
        onRequestClose={() => setModalReceita(false)}
      >
        <View style={styles.modalFullScreen}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>✨ Sua Receita</Text>
            <TouchableOpacity onPress={() => setModalReceita(false)}>
              <Text style={styles.fechar}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.receitaScroll}
            contentContainerStyle={{ padding: 20 }}
          >
            {gerando ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>
                  Criando sua receita com IA...
                </Text>
              </View>
            ) : (
              <Text style={styles.receitaTexto}>{receitaGerada}</Text>
            )}
          </ScrollView>

          {!gerando && receitaGerada ? (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.btnSalvar, receitaSalva && styles.btnSalvarJa]}
                onPress={handleSalvar}
                disabled={receitaSalva}
              >
                <Text style={styles.btnSalvarText}>
                  {receitaSalva ? "✅ Salvo!" : "⭐ Salvar receita"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  scroll: { padding: 16 },
  secaoTitulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 4,
  },
  secaoSub: { color: "#888", fontSize: 12, marginBottom: 10 },
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  input: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    fontSize: 15,
  },
  btnAdd: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  btnAddText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  qtdRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  qtdBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  qtdBtnAtivo: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  qtdText: { color: "#888", fontSize: 13 },
  qtdTextAtivo: { color: "#fff", fontWeight: "700" },
  btnFoto: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  btnFotoText: { color: "#4CAF50", fontSize: 15, fontWeight: "600" },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#444",
  },
  tagVencer: { borderColor: "#FF9800" },
  tagText: { color: "#ddd", fontSize: 13 },
  vazio: { color: "#555", fontSize: 13, fontStyle: "italic" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  btnGerar: {
    backgroundColor: "#4CAF50",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  btnGerarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 10,
  },
  modalTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  refeicaoBtn: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  refeicaoBtnAtivo: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  refeicaoText: { color: "#aaa", fontSize: 15 },
  refeicaoTextAtivo: { color: "#fff", fontWeight: "700" },
  btnConfirmar: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnConfirmarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalFullScreen: { flex: 1, backgroundColor: "#111" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  modalHeaderText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  fechar: { color: "#888", fontSize: 20 },
  receitaScroll: { flex: 1 },
  loadingBox: { alignItems: "center", paddingTop: 80, gap: 16 },
  loadingText: { color: "#888", fontSize: 15 },
  receitaTexto: { color: "#ddd", fontSize: 15, lineHeight: 24 },
  modalFooter: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  btnSalvar: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  btnSalvarJa: { backgroundColor: "#2a2a2a" },
  btnSalvarText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
