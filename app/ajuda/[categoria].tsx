import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { locais, type CategoriaAjuda, type Local } from '../../lib/locais';
import { colors } from '../../lib/theme';

const titulos: Record<CategoriaAjuda, string> = {
  ongs: 'ONGs e abrigos',
  veterinarios: 'Veterinários',
  vacinacao: 'Vacinação',
  castracao: 'Castração e campanhas',
};

function Card({ local }: { local: Local }) {
  return (
    <View style={s.card}>
      <Text style={s.nome}>{local.nome}</Text>
      <Text style={s.texto}>{local.endereco}</Text>
      {local.observacao && <Text style={s.texto}>{local.observacao}</Text>}
      <View style={s.acoes}>
        {local.telefone && (
          <Pressable
            accessibilityRole="button"
            onPress={() => Linking.openURL(`tel:${local.telefone}`)}
            style={s.acao}
          >
            <Feather name="phone" size={18} color={colors.teal} />
            <Text style={s.acaoTexto}>Ligar</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.endereco)}`,
            )
          }
          style={s.acao}
        >
          <Feather name="navigation" size={18} color={colors.teal} />
          <Text style={s.acaoTexto}>Ver no mapa</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Ajuda() {
  const { categoria } = useLocalSearchParams<{ categoria: string }>();
  const [busca, setBusca] = useState('');
  const valida = categoria in titulos;
  const cat = categoria as CategoriaAjuda;

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return locais.filter(
      (l) =>
        l.categoria === cat &&
        (!termo || l.nome.toLowerCase().includes(termo) || l.endereco.toLowerCase().includes(termo)),
    );
  }, [cat, busca]);

  if (!valida) {
    return (
      <View style={s.vazio}>
        <Stack.Screen options={{ title: 'Ajuda' }} />
        <Text style={s.texto}>Categoria não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: titulos[cat] }} />
      <FlatList
        data={lista}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <TextInput
            accessibilityLabel="Buscar por nome ou endereço"
            placeholder="Buscar por nome ou endereço"
            placeholderTextColor="#6B7478"
            value={busca}
            onChangeText={setBusca}
            style={s.busca}
          />
        }
        ListEmptyComponent={<Text style={[s.texto, { textAlign: 'center' }]}>Nenhum resultado encontrado.</Text>}
        renderItem={({ item }) => <Card local={item} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  busca: {
    minHeight: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  nome: { fontSize: 16, fontWeight: '800', color: colors.text },
  texto: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  acoes: { flexDirection: 'row', gap: 8, marginTop: 10 },
  acao: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.teal,
  },
  acaoTexto: { fontSize: 14, fontWeight: '600', color: colors.teal },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});
