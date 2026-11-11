import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chave = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !chave) {
  throw new Error('Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env');
}

// O login do app é próprio (tabela `usuario`), então não usamos o Supabase Auth.
export const supabase = createClient(url, chave, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
