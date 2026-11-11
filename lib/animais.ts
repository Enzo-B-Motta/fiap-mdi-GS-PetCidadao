import { deISO, paraISO } from './datas';
import type { RegistroAnimal } from './storage';
import { supabase } from './supabase';

const BUCKET = 'fotos-animais';

const TIPOS_IMAGEM: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
};

export async function enviarFoto(uri: string, pasta = 'animais'): Promise<string> {
  const ext = (uri.split('?')[0].split('.').pop() ?? 'jpg').toLowerCase();
  const caminho = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const resposta = await fetch(uri);
  const arquivo = await resposta.arrayBuffer();

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, {
    contentType: TIPOS_IMAGEM[ext] ?? 'image/jpeg',
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}

type LinhaAnimal = {
  id: number;
  nome: string | null;
  especie: RegistroAnimal['especie'];
  raca: string | null;
  sexo: RegistroAnimal['sexo'] | null;
  descricao: string | null;
  foto_url: string | null;
  tipo: RegistroAnimal['tipo'];
  localizacao: string | null;
  data_ocorrencia: string | null;
  contato: string | null;
  data_cadastro: string;
};

function paraRegistro(l: LinhaAnimal): RegistroAnimal {
  return {
    id: l.id,
    tipo: l.tipo,
    especie: l.especie,
    nome: l.nome ?? undefined,
    raca: l.raca ?? undefined,
    sexo: l.sexo ?? undefined,
    caracteristicas: l.descricao ?? '',
    fotos: l.foto_url ? [l.foto_url] : [],
    localizacao: l.localizacao ?? '',
    data: l.data_ocorrencia ? deISO(l.data_ocorrencia) : '',
    contato: l.contato ?? '',
    criadoEm: l.data_cadastro,
  };
}

/** Envia a foto para o Storage e grava o animal na tabela `animal`. */
export async function salvarAnimal(
  usuarioId: number,
  r: Omit<RegistroAnimal, 'id' | 'criadoEm'>,
): Promise<void> {
  const fotoUrl = r.fotos[0] ? await enviarFoto(r.fotos[0]) : null;

  const { error } = await supabase.from('animal').insert({
    usuario_id: usuarioId,
    tipo: r.tipo,
    especie: r.especie,
    nome: r.nome ?? null,
    raca: r.raca ?? null,
    sexo: r.sexo ?? null,
    descricao: r.caracteristicas,
    foto_url: fotoUrl,
    localizacao: r.localizacao,
    data_ocorrencia: paraISO(r.data),
    contato: r.contato,
  });
  if (error) throw error;
}

/** Animais cadastrados pelo usuário (usado em "Meus cadastros"). */
export async function listarAnimais(usuarioId: number): Promise<RegistroAnimal[]> {
  const { data, error } = await supabase
    .from('animal')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('data_cadastro', { ascending: false });
  if (error) throw error;
  return (data as LinhaAnimal[]).map(paraRegistro);
}
