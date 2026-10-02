// src/Services/AppContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  carregarFavoritosStorage,
  carregarPerfil,
  PerfilUsuario,
  ReceitaSalva,
  salvarFavoritosStorage,
} from "./storage";

export type { ReceitaSalva };

export type Ingrediente = {
  nome: string;
  qty: string;
};

export type AppState = {
  perfil: PerfilUsuario | null;
  setPerfil: (v: PerfilUsuario) => void;
  perfilCarregado: boolean;

  ingredientes: Ingrediente[];
  setIngredientes: (v: Ingrediente[]) => void;
  vencer: string[];
  setVencer: (v: string[]) => void;
  tempo: string;
  setTempo: (v: string) => void;
  refeicaoSessao: string;
  setRefeicaoSessao: (v: string) => void;

  historico: string[];
  setHistorico: (v: string[]) => void;

  favoritos: ReceitaSalva[];
  salvarFavorito: (r: ReceitaSalva) => Promise<void>;
  removerFavorito: (id: string) => Promise<void>;
  atualizarFavorito: (
    id: string,
    updates: Partial<ReceitaSalva>
  ) => Promise<void>;

  ultimaReceita: string;
  setUltimaReceita: (v: string) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfilState] = useState<PerfilUsuario | null>(null);
  const [perfilCarregado, setPerfilCarregado] = useState(false);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [vencer, setVencer] = useState<string[]>([]);
  const [tempo, setTempo] = useState("30");
  const [refeicaoSessao, setRefeicaoSessao] = useState("almoço");
  const [historico, setHistorico] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<ReceitaSalva[]>([]);
  const [ultimaReceita, setUltimaReceita] = useState("");

  useEffect(() => {
    Promise.all([carregarPerfil(), carregarFavoritosStorage()]).then(
      ([p, favs]) => {
        if (p) {
          setPerfilState(p);
          setRefeicaoSessao(p.refeicaoPreferida || "almoço");
        }
        setFavoritos(favs);
        setPerfilCarregado(true);
      }
    );
  }, []);

  function setPerfil(p: PerfilUsuario) {
    setPerfilState(p);
    setRefeicaoSessao(p.refeicaoPreferida || "almoço");
  }

  async function salvarFavorito(r: ReceitaSalva): Promise<void> {
    const novaLista = [r, ...favoritos];
    setFavoritos(novaLista);
    await salvarFavoritosStorage(novaLista);
  }

  async function removerFavorito(id: string): Promise<void> {
    const novaLista = favoritos.filter((f) => f.id !== id);
    setFavoritos(novaLista);
    await salvarFavoritosStorage(novaLista);
  }

  async function atualizarFavorito(
    id: string,
    updates: Partial<ReceitaSalva>
  ): Promise<void> {
    const novaLista = favoritos.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    setFavoritos(novaLista);
    await salvarFavoritosStorage(novaLista);
  }

  return (
    <AppContext.Provider
      value={{
        perfil,
        setPerfil,
        perfilCarregado,
        ingredientes,
        setIngredientes,
        vencer,
        setVencer,
        tempo,
        setTempo,
        refeicaoSessao,
        setRefeicaoSessao,
        historico,
        setHistorico,
        favoritos,
        salvarFavorito,
        removerFavorito,
        atualizarFavorito,
        ultimaReceita,
        setUltimaReceita,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
