import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Armazenamento local (no aparelho). Quando você tiver um backend,
 * troque o corpo destas funções por chamadas à sua API: as telas
 * só dependem das assinaturas e dos tipos exportados aqui.
 */

export type Coordenadas = { latitude: number; longitude: number };

export type RegistroAnimal = {
  id: string;
  tipo: 'perdido' | 'encontrado';
  especie: 'cachorro' | 'gato' | 'outro';
  nome?: string;
  caracteristicas: string;
  fotos: string[];
  localizacao: string;
  coordenadas?: Coordenadas;
  data: string;
  contato: string;
  criadoEm: string;
};

export type Denuncia = {
  id: string;
  tipo: 'abandono' | 'maus-tratos';
  descricao: string;
  fotos: string[];
  localizacao: string;
  coordenadas?: Coordenadas;
  data: string;
  anonima: boolean;
  contato?: string;
  criadoEm: string;
};

export type Perfil = { nome: string; telefone: string; cidade: string };

const CHAVES = {
  animais: '@petcidadao:animais',
  denuncias: '@petcidadao:denuncias',
  perfil: '@petcidadao:perfil',
};

async function lerLista<T>(chave: string): Promise<T[]> {
  const bruto = await AsyncStorage.getItem(chave);
  return bruto ? (JSON.parse(bruto) as T[]) : [];
}

async function adicionar<T>(chave: string, item: T): Promise<void> {
  const lista = await lerLista<T>(chave);
  await AsyncStorage.setItem(chave, JSON.stringify([item, ...lista]));
}

const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const listarAnimais = () => lerLista<RegistroAnimal>(CHAVES.animais);
export const listarDenuncias = () => lerLista<Denuncia>(CHAVES.denuncias);

export const salvarAnimal = (r: Omit<RegistroAnimal, 'id' | 'criadoEm'>) =>
  adicionar<RegistroAnimal>(CHAVES.animais, { ...r, id: novoId(), criadoEm: new Date().toISOString() });

export const salvarDenuncia = (d: Omit<Denuncia, 'id' | 'criadoEm'>) =>
  adicionar<Denuncia>(CHAVES.denuncias, { ...d, id: novoId(), criadoEm: new Date().toISOString() });

export async function obterPerfil(): Promise<Perfil> {
  const bruto = await AsyncStorage.getItem(CHAVES.perfil);
  return bruto ? (JSON.parse(bruto) as Perfil) : { nome: '', telefone: '', cidade: '' };
}

export const salvarPerfil = (p: Perfil) => AsyncStorage.setItem(CHAVES.perfil, JSON.stringify(p));
