import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';

export type UsuarioApp = { id: number; nome: string };

type Sessao = {
  usuario: UsuarioApp | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const CHAVE = '@petcidadao:usuario';
const Contexto = createContext<Sessao | null>(null);

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioApp | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((bruto) => bruto && setUsuario(JSON.parse(bruto) as UsuarioApp))
      .finally(() => setCarregando(false));
  }, []);

  async function guardar(u: UsuarioApp) {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(u));
    setUsuario(u);
  }

  async function entrar(email: string, senha: string) {
    const { data, error } = await supabase.rpc('login_usuario', { p_email: email, p_senha: senha });
    if (error) throw error;
    const linha = (data as { id: number; nome: string }[] | null)?.[0];
    if (!linha) throw new Error('E-mail ou senha incorretos.');
    await guardar({ id: linha.id, nome: linha.nome });
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    const { data, error } = await supabase.rpc('cadastrar_usuario', {
      p_nome: nome,
      p_email: email,
      p_senha: senha,
    });
    if (error) {
      if (error.code === '23505') throw new Error('Este e-mail já está cadastrado.');
      throw error;
    }
    await guardar({ id: data as number, nome });
  }

  async function sair() {
    await AsyncStorage.removeItem(CHAVE);
    setUsuario(null);
  }

  return (
    <Contexto.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </Contexto.Provider>
  );
}

export function useSessao(): Sessao {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useSessao deve ser usado dentro de <SessaoProvider>');
  return ctx;
}
