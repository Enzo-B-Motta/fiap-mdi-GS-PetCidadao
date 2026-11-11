import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { listarAnimais } from '../lib/animais';
import { useSessao } from '../lib/sessao';
import { listarDenuncias } from '../lib/denuncias';
import type { Denuncia, RegistroAnimal } from '../lib/storage';
import { colors } from '../lib/theme';

const especies = { cachorro: 'Cachorro', gato: 'Gato', outro: 'Outro' } as const;

function ItemAnimal({ a }: { a: RegistroAnimal }) {
  return (
    <View style={s.card}>
      {a.fotos[0] && <Image source={{ uri: a.fotos[0] }} style={s.foto} accessibilityLabel="Foto do animal" />}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.titulo}>
          {a.tipo === 'perdido' ? 'Desaparecido' : 'Encontrado'} · {especies[a.especie]}
          {a.nome ? ` (${a.nome})` : ''}
        </Text>
        <Text style={s.texto}>{a.localizacao}</Text>
        <Text style={s.texto}>{a.data}</Text>
      </View>
    </View>
  );
}

function ItemDenuncia({ d }: { d: Denuncia }) {
  return (
    <View style={s.card}>
      {d.fotos[0] && <Image source={{ uri: d.fotos[0] }} style={s.foto} accessibilityLabel="Foto da denúncia" />}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.titulo}>{d.tipo === 'abandono' ? 'Abandono' : 'Maus-tratos'}</Text>
        <Text style={s.texto}>{d.localizacao}</Text>
        <Text style={s.texto}>
          {d.data}
          {d.anonima ? ' · anônima' : ''}
        </Text>
      </View>
    </View>
  );
}

export default function MeusCadastros() {
  const [animais, setAnimais] = useState<RegistroAnimal[]>([]);
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const { usuario } = useSessao();

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      listarAnimais(usuario.id).then(setAnimais).catch(() => setAnimais([]));
      listarDenuncias(usuario.id).then(setDenuncias).catch(() => setDenuncias([]));
    }, [usuario]),
  );

  const vazio = animais.length === 0 && denuncias.length === 0;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Stack.Screen options={{ title: 'Meus cadastros' }} />

      {vazio && <Text style={[s.texto, { textAlign: 'center' }]}>Você ainda não fez nenhum cadastro.</Text>}

      {animais.length > 0 && <Text style={s.secao}>Animais</Text>}
      {animais.map((a) => (
        <ItemAnimal key={a.id} a={a} />
      ))}

      {denuncias.length > 0 && <Text style={s.secao}>Denúncias</Text>}
      {denuncias.map((d) => (
        <ItemDenuncia key={d.id} d={d} />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  secao: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 8 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  foto: { width: 64, height: 64, borderRadius: 12 },
  titulo: { fontSize: 15, fontWeight: '800', color: colors.text },
  texto: { fontSize: 14, color: colors.muted },
});
