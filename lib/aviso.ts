import { Alert, Platform } from 'react-native';

/**
 * Alert.alert não faz nada na web. Este helper usa o alert do navegador
 * na web e o Alert nativo no celular.
 */
export function avisar(titulo: string, mensagem?: string) {
  if (Platform.OS === 'web') {
    const alertaWeb = (globalThis as { alert?: (texto: string) => void }).alert;
    alertaWeb?.(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}
