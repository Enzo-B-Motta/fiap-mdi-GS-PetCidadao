import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { ChoiceRow, Field, FormScreen, LocationField, PhotoPicker, PrimaryButton } from '../../components/ui';
import { dataValida, hoje, mascaraData } from '../../lib/datas';
import { salvarDenuncia, type Coordenadas, type Denuncia } from '../../lib/storage';
import { colors } from '../../lib/theme';

export default function NovaDenuncia() {
  const router = useRouter();

  const [tipo, setTipo] = useState<Denuncia['tipo'] | null>(null);
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [localizacao, setLocalizacao] = useState('');
  const [coordenadas, setCoordenadas] = useState<Coordenadas | undefined>();
  const [data, setData] = useState(hoje());
  const [anonima, setAnonima] = useState(false);
  const [contato, setContato] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function enviar() {
    if (!tipo) return Alert.alert('Faltam dados', 'Escolha o tipo de situação.');
    if (!descricao.trim()) return Alert.alert('Faltam dados', 'Descreva o que aconteceu.');
    if (!localizacao.trim()) return Alert.alert('Faltam dados', 'Informe o local da ocorrência.');
    if (!dataValida(data)) return Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA, sem datas futuras.');
    if (!anonima && !contato.trim()) return Alert.alert('Faltam dados', 'Informe um contato ou marque como anônima.');

    setSalvando(true);
    try {
      await salvarDenuncia({
        tipo,
        descricao: descricao.trim(),
        fotos,
        localizacao: localizacao.trim(),
        coordenadas,
        data,
        anonima,
        contato: anonima ? undefined : contato.trim(),
      });
      Alert.alert('Registro salvo', 'Sua denúncia foi registrada.');
      router.replace('/meus-cadastros');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <FormScreen>
      <Stack.Screen options={{ title: 'Denunciar' }} />

      <View
        style={{
          backgroundColor: '#FDECEC',
          borderRadius: 12,
          padding: 14,
          gap: 4,
        }}
      >
        <Text style={{ fontWeight: '800', color: colors.red }}>Risco imediato?</Text>
        <Text style={{ color: colors.text, lineHeight: 20 }}>
          Maus-tratos a animais são crime no Brasil (Lei 9.605/1998). Se houver risco imediato para pessoas ou
          animais, ligue 190.
        </Text>
      </View>

      <ChoiceRow
        label="Tipo de situação"
        value={tipo}
        onChange={setTipo}
        options={[
          { value: 'abandono', label: 'Abandono' },
          { value: 'maus-tratos', label: 'Maus-tratos' },
        ]}
      />

      <Field
        label="O que aconteceu?"
        placeholder="Descreva a situação, os animais envolvidos e o que você observou."
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <PhotoPicker fotos={fotos} onChange={setFotos} />

      <LocationField
        value={localizacao}
        onChange={(texto, coords) => {
          setLocalizacao(texto);
          if (coords) setCoordenadas(coords);
        }}
      />

      <Field
        label="Data da ocorrência"
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={(t) => setData(mascaraData(t))}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Fazer denúncia anônima</Text>
        <Switch
          accessibilityLabel="Fazer denúncia anônima"
          value={anonima}
          onValueChange={setAnonima}
          trackColor={{ true: colors.teal }}
        />
      </View>

      {!anonima && (
        <Field label="Contato (telefone)" keyboardType="phone-pad" value={contato} onChangeText={setContato} />
      )}

      <PrimaryButton title="Enviar denúncia" color={colors.red} loading={salvando} onPress={enviar} />
    </FormScreen>
  );
}
