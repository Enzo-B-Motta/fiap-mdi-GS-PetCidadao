import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ChoiceRow, Field, FormScreen, LocationField, PhotoPicker, PrimaryButton } from '../../components/ui';
import { salvarAnimal } from '../../lib/animais';
import { dataValida, hoje, mascaraData } from '../../lib/datas';
import { useSessao } from '../../lib/sessao';
import { obterPerfil, type RegistroAnimal } from '../../lib/storage';
import { colors } from '../../lib/theme';
import { avisar } from '../../lib/aviso';

type Sexo = NonNullable<RegistroAnimal['sexo']>;

export default function NovoAnimal() {
  const router = useRouter();
  const { usuario } = useSessao();
  const { tipo } = useLocalSearchParams<{ tipo?: string }>();
  const perdido = tipo !== 'encontrado';

  const [fotos, setFotos] = useState<string[]>([]);
  const [especie, setEspecie] = useState<RegistroAnimal['especie'] | null>(null);
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState<Sexo | null>(null);
  const [caracteristicas, setCaracteristicas] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [data, setData] = useState(hoje());
  const [contato, setContato] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    obterPerfil().then((p) => p.telefone && setContato(p.telefone));
  }, []);

  async function enviar() {
    if (!usuario) return;
    if (fotos.length === 0) return avisar('Faltam dados', 'Adicione uma foto do animal.');
    if (!especie) return avisar('Faltam dados', 'Escolha a espécie do animal.');
    if (!caracteristicas.trim()) return avisar('Faltam dados', 'Descreva as características do animal.');
    if (!localizacao.trim()) return avisar('Faltam dados', 'Informe a localização.');
    if (!dataValida(data)) return avisar('Data inválida', 'Use o formato DD/MM/AAAA, sem datas futuras.');
    if (!contato.trim()) return avisar('Faltam dados', 'Informe um contato.');

    setSalvando(true);
    try {
      await salvarAnimal(usuario.id, {
        tipo: perdido ? 'perdido' : 'encontrado',
        especie,
        nome: perdido ? nome.trim() || undefined : undefined,
        raca: raca.trim() || undefined,
        sexo: sexo ?? undefined,
        caracteristicas: caracteristicas.trim(),
        fotos,
        localizacao: localizacao.trim(),
        data,
        contato: contato.trim(),
      });
      avisar('Cadastro salvo', 'Seu registro foi salvo com sucesso.');
      router.replace('/meus-cadastros');
    } catch (e) {
      avisar('Erro ao salvar', (e as { message?: string }).message ?? 'Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <FormScreen>
      <Stack.Screen options={{ title: perdido ? 'Animal desaparecido' : 'Animal encontrado' }} />

      <PhotoPicker fotos={fotos} onChange={setFotos} max={1} />

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

      {perdido && <Field label="Nome do animal (opcional)" value={nome} onChangeText={setNome} maxLength={100} />}

      <Field label="Raça (opcional)" value={raca} onChangeText={setRaca} />

      <ChoiceRow
        label="Sexo (opcional)"
        value={sexo}
        onChange={setSexo}
        options={[
          { value: 'macho', label: 'Macho' },
          { value: 'femea', label: 'Fêmea' },
          { value: 'indefinido', label: 'Não sei' },
        ]}
      />

      <Field
        label="Características"
        placeholder="Cor, porte, idade aproximada, coleira, marcas..."
        multiline
        maxLength={1000}
        value={caracteristicas}
        onChangeText={setCaracteristicas}
      />

      <LocationField value={localizacao} onChange={(texto) => setLocalizacao(texto)} />

      <Field
        label={perdido ? 'Data em que desapareceu' : 'Data em que foi encontrado'}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={(t) => setData(mascaraData(t))}
      />

      <Field label="Contato (telefone)" keyboardType="phone-pad" value={contato} onChangeText={setContato} />

      <PrimaryButton
        title="Salvar cadastro"
        color={perdido ? colors.orange : colors.teal}
        loading={salvando}
        onPress={enviar}
      />
    </FormScreen>
  );
}
