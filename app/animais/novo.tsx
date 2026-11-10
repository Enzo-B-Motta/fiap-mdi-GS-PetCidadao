import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ChoiceRow, Field, FormScreen, LocationField, PhotoPicker, PrimaryButton } from '../../components/ui';
import { dataValida, hoje, mascaraData } from '../../lib/datas';
import { obterPerfil, salvarAnimal, type Coordenadas, type RegistroAnimal } from '../../lib/storage';
import { colors } from '../../lib/theme';

export default function NovoAnimal() {
  const router = useRouter();
  const { tipo } = useLocalSearchParams<{ tipo?: string }>();
  const perdido = tipo !== 'encontrado';

  const [fotos, setFotos] = useState<string[]>([]);
  const [especie, setEspecie] = useState<RegistroAnimal['especie'] | null>(null);
  const [nome, setNome] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [coordenadas, setCoordenadas] = useState<Coordenadas | undefined>();
  const [data, setData] = useState(hoje());
  const [contato, setContato] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    obterPerfil().then((p) => p.telefone && setContato(p.telefone));
  }, []);

  async function enviar() {
    if (fotos.length === 0) return Alert.alert('Faltam dados', 'Adicione pelo menos uma foto.');
    if (!especie) return Alert.alert('Faltam dados', 'Escolha a espécie do animal.');
    if (!caracteristicas.trim()) return Alert.alert('Faltam dados', 'Descreva as características do animal.');
    if (!localizacao.trim()) return Alert.alert('Faltam dados', 'Informe a localização.');
    if (!dataValida(data)) return Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA, sem datas futuras.');
    if (!contato.trim()) return Alert.alert('Faltam dados', 'Informe um contato.');

    setSalvando(true);
    try {
      await salvarAnimal({
        tipo: perdido ? 'perdido' : 'encontrado',
        especie,
        nome: perdido ? nome.trim() || undefined : undefined,
        caracteristicas: caracteristicas.trim(),
        fotos,
        localizacao: localizacao.trim(),
        coordenadas,
        data,
        contato: contato.trim(),
      });
      Alert.alert('Cadastro salvo', 'Seu registro foi salvo com sucesso.');
      router.replace('/meus-cadastros');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <FormScreen>
      <Stack.Screen options={{ title: perdido ? 'Animal desaparecido' : 'Animal encontrado' }} />

      <PhotoPicker fotos={fotos} onChange={setFotos} />

      <ChoiceRow
        label="Espécie"
        value={especie}
        onChange={setEspecie}
        options={[
          { value: 'cachorro', label: 'Cachorro' },
          { value: 'gato', label: 'Gato' },
          { value: 'outro', label: 'Outro' },
        ]}
      />

      {perdido && <Field label="Nome do animal (opcional)" value={nome} onChangeText={setNome} />}

      <Field
        label="Características"
        placeholder="Cor, porte, idade aproximada, coleira, marcas..."
        multiline
        value={caracteristicas}
        onChangeText={setCaracteristicas}
      />

      <LocationField
        value={localizacao}
        onChange={(texto, coords) => {
          setLocalizacao(texto);
          if (coords) setCoordenadas(coords);
        }}
      />

      <Field
        label={perdido ? 'Data em que desapareceu' : 'Data em que foi encontrado'}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={(t) => setData(mascaraData(t))}
      />

      <Field
        label="Contato (telefone)"
        keyboardType="phone-pad"
        value={contato}
        onChangeText={setContato}
      />

      <PrimaryButton
        title="Salvar cadastro"
        color={perdido ? colors.orange : colors.teal}
        loading={salvando}
        onPress={enviar}
      />
    </FormScreen>
  );
}
