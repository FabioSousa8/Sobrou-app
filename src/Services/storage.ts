import AsyncStorage from "@react-native-async-storage/async-storage";

export type PerfilUsuario = {
  nome: string;
  dietas: string[];
  alergias: string[];
  nivel: string;
  refeicaoPreferida: string;
  comidasFavoritas: string;
};

export type ReceitaSalva = {
  id: string;
  titulo: string;
  conteudo: string;
  savedAt: string;
  nota?: number;
  comentario?: string;
};

const KEYS = {
  PERFIL: "@salvaalmoco:perfil",
  ONBOARDING: "@salvaalmoco:onboarding",
  FAVORITOS: "@salvaalmoco:favoritos",
  API_KEY: "@salvaalmoco:gemini_key",
};

// Legado — mantido para compatibilidade com AsyncStorage que usava outra chave
const CHAVE_PERFIL_LEGADO = "@salvaalmoço_perfil";
const CHAVE_ONBOARDING_LEGADO = "@salvaalmoço_onboarding_concluido";

export async function salvarPerfil(perfil: PerfilUsuario): Promise<void> {
  await AsyncStorage.setItem(KEYS.PERFIL, JSON.stringify(perfil));
}

export async function carregarPerfil(): Promise<PerfilUsuario | null> {
  let json = await AsyncStorage.getItem(KEYS.PERFIL);
  if (!json) {
    // tenta chave legada
    json = await AsyncStorage.getItem(CHAVE_PERFIL_LEGADO);
  }
  return json ? JSON.parse(json) : null;
}

export async function onboardingConcluido(): Promise<boolean> {
  let val = await AsyncStorage.getItem(KEYS.ONBOARDING);
  if (!val) {
    val = await AsyncStorage.getItem(CHAVE_ONBOARDING_LEGADO);
  }
  return val === "true";
}

export async function marcarOnboardingConcluido(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING, "true");
}

export async function resetarApp(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.PERFIL,
    KEYS.ONBOARDING,
    KEYS.FAVORITOS,
    KEYS.API_KEY,
    CHAVE_PERFIL_LEGADO,
    CHAVE_ONBOARDING_LEGADO,
  ]);
}

export async function salvarFavoritosStorage(
  favoritos: ReceitaSalva[]
): Promise<void> {
  await AsyncStorage.setItem(KEYS.FAVORITOS, JSON.stringify(favoritos));
}

export async function carregarFavoritosStorage(): Promise<ReceitaSalva[]> {
  const raw = await AsyncStorage.getItem(KEYS.FAVORITOS);
  return raw ? JSON.parse(raw) : [];
}

export async function salvarApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.API_KEY, key.trim());
}

export async function carregarApiKey(): Promise<string> {
  const val = await AsyncStorage.getItem(KEYS.API_KEY);
  return val ?? "";
}
