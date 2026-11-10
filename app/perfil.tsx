import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Field, FormScreen, PrimaryButton } from '../components/ui';
import { obterPerfil, salvarPerfil } from '../lib/storage';

export default function PerfilScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');

  useEffect(() => {
    obterPerfil().then((p) => {
      setNome(p.nome);
      setTelefone(p.telefone);
      setCidade(p.cidade);
    });
  }, []);

  async function salvar() {
    await salvarPerfil({ nome: nome.trim(), telefone: telefone.trim(), cidade: cidade.trim() });
    Alert.alert('Perfil salvo', 'O telefone será preenchido automaticamente nos seus cadastros.');
    router.back();
  }

  return (
    <FormScreen>
      <Stack.Screen options={{ title: 'Meu perfil' }} />
      <Field label="Nome" value={nome} onChangeText={setNome} />
      <Field label="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
      <Field label="Cidade" value={cidade} onChangeText={setCidade} />
      <PrimaryButton title="Salvar perfil" onPress={salvar} />
    </FormScreen>
  );
}
