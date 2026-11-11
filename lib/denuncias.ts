import { enviarFoto } from './animais';
import { deISO, paraISO } from './datas';
import type { Denuncia } from './storage';
import { supabase } from './supabase';

type LinhaDenuncia = {
  id: number;
  tipo: Denuncia['tipo'];
  descricao: string;
  fotos: string[];
  localizacao: string;
  data_ocorrencia: string;
  anonima: boolean;
  contato: string | null;
  data_cadastro: string;
};

function paraDenuncia(l: LinhaDenuncia): Denuncia {
  return {
    id: l.id,
    tipo: l.tipo,
    descricao: l.descricao,
    fotos: l.fotos,
    localizacao: l.localizacao,
    data: deISO(l.data_ocorrencia),
    anonima: l.anonima,
    contato: l.contato ?? undefined,
    criadoEm: l.data_cadastro,
  };
}

/** Envia as fotos para o Storage e grava a denúncia na tabela `denuncia`. */
export async function salvarDenuncia(
  usuarioId: number,
  d: Omit<Denuncia, 'id' | 'criadoEm'>,
): Promise<void> {
  const urls = await Promise.all(d.fotos.map((uri) => enviarFoto(uri, 'denuncias')));

  const { error } = await supabase.from('denuncia').insert({
    usuario_id: usuarioId,
    tipo: d.tipo,
    descricao: d.descricao,
    fotos: urls,
    localizacao: d.localizacao,
    data_ocorrencia: paraISO(d.data),
    anonima: d.anonima,
    contato: d.anonima ? null : d.contato ?? null,
  });
  if (error) throw error;
}

/** Denúncias do usuário (a leitura passa por uma função; a tabela não é pública). */
export async function listarDenuncias(usuarioId: number): Promise<Denuncia[]> {
  const { data, error } = await supabase.rpc('minhas_denuncias', { p_usuario_id: usuarioId });
  if (error) throw error;
  return (data as LinhaDenuncia[]).map(paraDenuncia);
}
