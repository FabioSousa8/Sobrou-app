import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ReceitaSalva, useApp } from "../Services/AppContext";

// ─── Componente estrelas ───────────────────────────────────────────────────
function Estrelas({
  nota,
  onSelecionar,
  tamanho = 22,
}: {
  nota?: number;
  onSelecionar?: (n: number) => void;
  tamanho?: number;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          onPress={() => onSelecionar?.(n)}
          disabled={!onSelecionar}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Ionicons
            name={nota && n <= nota ? "star" : "star-outline"}
            size={tamanho}
            color={nota && n <= nota ? "#FFD700" : "#555"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatarData(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

// ─── Tela principal ──────────────────────────────────────────────────────
export default function Favoritos() {
  const { favoritos, removerFavorito, atualizarFavorito } = useApp();
  const [receitaAberta, setReceitaAberta] = useState<ReceitaSalva | null>(null);
  const [comentarioEditando, setComentarioEditando] = useState("");

  function abrirDetalhe(r: ReceitaSalva) {
    setReceitaAberta(r);
    setComentarioEditando(r.comentario ?? "");
  }

  function fecharDetalhe() {
    setReceitaAberta(null);
    setComentarioEditando("");
  }

  async function remover(id: string) {
    Alert.alert("Remover receita", "Deseja remover esta receita dos salvos?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await removerFavorito(id);
          fecharDetalhe();
        },
      },
    ]);
  }

  async function salvarNota(id: string, nota: number) {
    await atualizarFavorito(id, { nota });
    if (receitaAberta?.id === id) {
      setReceitaAberta((prev) => (prev ? { ...prev, nota } : prev));
    }
  }

  async function salvarComentario(id: string) {
    const comentario = comentarioEditando.trim();
    await atualizarFavorito(id, { comentario });
    if (receitaAberta?.id === id) {
      setReceitaAberta((prev) =>
        prev ? { ...prev, comentario } : prev
      );
    }
    Alert.alert("✅ Salvo!", "Comentário salvo com sucesso.");
  }

  async function compartilhar(receita: ReceitaSalva) {
    try {
      await Share.share({
        message: `🍽️ ${receita.titulo}\n\n${receita.conteudo}\n\n— Compartilhado via Sobrou?`,
        title: receita.titulo,
      });
    } catch (e: any) {
      Alert.alert("Erro ao compartilhar", e.message);
    }
  }

  // ── Lista vazia ──────────────────────────────────────────────────────────
  if (favoritos.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        <Text style={styles.emptyIcon}>🍽️</Text>
        <Text style={styles.emptyTitle}>Nenhuma receita salva ainda</Text>
        <Text style={styles.emptyHint}>
          Gere uma receita na aba Geladeira e toque em "Salvar" para ela
          aparecer aqui.
        </Text>
      </View>
    );
  }

  // ── Lista de receitas ────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <ScrollView contentContainerStyle={styles.lista}>
        <Text style={styles.cabecalho}>
          ⭐ {favoritos.length}{" "}
          {favoritos.length === 1 ? "receita salva" : "receitas salvas"}
        </Text>

        {favoritos.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.card}
            onPress={() => abrirDetalhe(r)}
            activeOpacity={0.85}
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardTitulo} numberOfLines={2}>
                {r.titulo}
              </Text>
              <TouchableOpacity
                onPress={() => compartilhar(r)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="share-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardData}>{formatarData(r.savedAt)}</Text>

            {r.nota ? (
              <Estrelas nota={r.nota} tamanho={16} />
            ) : (
              <Text style={styles.semNota}>Sem avaliação</Text>
            )}

            {r.comentario ? (
              <Text style={styles.comentarioPreview} numberOfLines={1}>
                💬 {r.comentario}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Modal de detalhe ─────────────────────────────────────────────── */}
      <Modal
        visible={receitaAberta !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={fecharDetalhe}
      >
        {receitaAberta && (
          <View style={styles.modal}>
            {/* Cabeçalho */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={fecharDetalhe}>
                <Ionicons name="chevron-down" size={28} color="#888" />
              </TouchableOpacity>
              <Text style={styles.modalTitulo} numberOfLines={1}>
                {receitaAberta.titulo}
              </Text>
              <TouchableOpacity onPress={() => compartilhar(receitaAberta)}>
                <Ionicons name="share-outline" size={22} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Data */}
              <Text style={styles.modalData}>
                Salva em {formatarData(receitaAberta.savedAt)}
              </Text>

              {/* Avaliação */}
              <View style={styles.secao}>
                <Text style={styles.secaoLabel}>Sua avaliação</Text>
                <Estrelas
                  nota={receitaAberta.nota}
                  onSelecionar={(n) => salvarNota(receitaAberta.id, n)}
                  tamanho={28}
                />
              </View>

              {/* Comentário */}
              <View style={styles.secao}>
                <Text style={styles.secaoLabel}>Anotações / comentários</Text>
                <TextInput
                  style={styles.comentarioInput}
                  value={comentarioEditando}
                  onChangeText={setComentarioEditando}
                  placeholder="Adicione uma nota sobre essa receita..."
                  placeholderTextColor="#555"
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={styles.btnSalvarComentario}
                  onPress={() => salvarComentario(receitaAberta.id)}
                >
                  <Text style={styles.btnSalvarComentarioText}>
                    Salvar anotação
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Texto da receita */}
              <View style={styles.secao}>
                <Text style={styles.secaoLabel}>Receita completa</Text>
                <Text style={styles.receitaTexto}>{receitaAberta.conteudo}</Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.btnRemover}
                onPress={() => remover(receitaAberta.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#FF5252" />
                <Text style={styles.btnRemoverText}>Remover receita</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  emptyWrapper: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  lista: { padding: 16, paddingBottom: 32 },
  cabecalho: {
    color: "#888",
    fontSize: 13,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cardData: { fontSize: 12, color: "#555" },
  semNota: { fontSize: 12, color: "#555", fontStyle: "italic" },
  comentarioPreview: { fontSize: 12, color: "#888", fontStyle: "italic" },

  // Modal
  modal: { flex: 1, backgroundColor: "#0a0a0a" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  modalTitulo: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginHorizontal: 8,
  },
  modalScroll: { flex: 1 },
  modalData: { color: "#555", fontSize: 12, marginBottom: 20 },
  secao: { marginBottom: 24 },
  secaoLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  comentarioInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    color: "#ddd",
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  btnSalvarComentario: {
    backgroundColor: "#1a3d1a",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 8,
  },
  btnSalvarComentarioText: { color: "#4CAF50", fontSize: 14, fontWeight: "600" },
  receitaTexto: { color: "#ddd", fontSize: 14, lineHeight: 26 },
  modalFooter: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  btnRemover: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FF5252",
    borderRadius: 12,
    padding: 14,
  },
  btnRemoverText: { color: "#FF5252", fontSize: 15, fontWeight: "600" },
});
