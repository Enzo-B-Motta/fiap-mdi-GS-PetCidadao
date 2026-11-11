import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { Field, FormScreen, PrimaryButton } from '../components/ui';
import { useSessao } from '../lib/sessao';
import { colors } from '../lib/theme';
import { avisar } from '../lib/aviso';

export default function Entrar() {
  const { entrar, cadastrar } = useSessao();
  const [criar, setCriar] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar() {
    if (criar && !nome.trim()) return avisar('Faltam dados', 'Informe seu nome.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return avisar('E-mail inválido', 'Confira o e-mail digitado.');
    if (senha.length < 6) return avisar('Senha curta', 'Use pelo menos 6 caracteres.');

    setErro('');
    setCarregando(true);
    try {
      if (criar) await cadastrar(nome.trim(), email.trim(), senha);
      else await entrar(email.trim(), senha);
      // ao logar, o layout leva o usuário para a Home automaticamente
    } catch (e) {
      console.warn('Erro de autenticação:', e);
      setErro((e as { message?: string }).message ?? 'Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <FormScreen>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 48 }}>
        Pet <Text style={{ color: colors.teal }}>Cidadão</Text>
      </Text>
      <Text style={{ fontSize: 15, color: colors.muted }}>
        {criar ? 'Crie sua conta para cadastrar animais.' : 'Entre para cadastrar e acompanhar animais.'}
      </Text>

      {criar && <Field label="Nome" value={nome} onChangeText={setNome} maxLength={100} />}
      <Field
        label="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      <Field label="Senha" secureTextEntry autoCapitalize="none" value={senha} onChangeText={setSenha} />

      {erro ? <Text style={{ color: colors.red, fontWeight: '600' }}>{erro}</Text> : null}

      <PrimaryButton title={criar ? 'Criar conta' : 'Entrar'} loading={carregando} onPress={enviar} />

      <Pressable
        accessibilityRole="button"
        onPress={() => setCriar((v) => !v)}
        style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.teal }}>
          {criar ? 'Já tenho conta' : 'Criar uma conta'}
        </Text>
      </Pressable>
    </FormScreen>
  );
}
