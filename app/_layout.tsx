import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SessaoProvider, useSessao } from '../lib/sessao';
import { colors } from '../lib/theme';

function Rotas() {
  const { usuario, carregando } = useSessao();
  if (carregando) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.teal,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      {/* Só acessíveis com o usuário logado */}
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="animais/novo" />
        <Stack.Screen name="denuncia/nova" />
        <Stack.Screen name="ajuda/[categoria]" />
        <Stack.Screen name="meus-cadastros" />
        <Stack.Screen name="perfil" />
      </Stack.Protected>

      {/* Só acessível sem login */}
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="entrar" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessaoProvider>
      <StatusBar style="dark" />
      <Rotas />
    </SessaoProvider>
  );
}
