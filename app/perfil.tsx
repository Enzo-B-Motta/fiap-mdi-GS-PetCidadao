import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Field, FormScreen, PrimaryButton } from '../components/ui';
import { useSessao } from '../lib/sessao';
import { obterPerfil, salvarPerfil } from '../lib/storage';
import { colors } from '../lib/theme';
import { avisar } from '../lib/aviso';

export default function PerfilScreen() {
  const router = useRouter();
  const { usuario, sair } = useSessao();
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');

  useEffect(() => {
    obterPerfil().then((p) => {
      setTelefone(p.telefone);
      setCidade(p.cidade);
    });
  }, []);

  async function salvar() {
    await salvarPerfil({ nome: usuario?.nome ?? '', telefone: telefone.trim(), cidade: cidade.trim() });
    avisar('Perfil salvo', 'O telefone será preenchido automaticamente nos seus cadastros.');
    router.back();
  }

  return (
    <FormScreen>
      <Stack.Screen options={{ title: 'Meu perfil' }} />
      <Text style={{ fontSize: 15, color: colors.muted }}>
        Conectado como <Text style={{ fontWeight: '800', color: colors.text }}>{usuario?.nome}</Text>
      </Text>
      <Field label="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
      <Field label="Cidade" value={cidade} onChangeText={setCidade} />
      <PrimaryButton title="Salvar perfil" onPress={salvar} />
      <PrimaryButton title="Sair da conta" color={colors.red} onPress={sair} />
    </FormScreen>
  );
}
