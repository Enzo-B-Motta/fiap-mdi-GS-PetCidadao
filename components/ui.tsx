import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Coordenadas } from '../lib/storage';
import { colors } from '../lib/theme';
import { avisar } from '../lib/aviso';
import { buscarCep, mascaraCep } from '../lib/viacep';

export function FormScreen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 28 + insets.bottom, gap: 18 }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#6B7478"
        style={[s.input, props.multiline && s.multiline, style]}
        {...props}
      />
    </View>
  );
}

type Option<T extends string> = { value: T; label: string };

export function ChoiceRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.label}>{label}</Text>
      <View style={s.choices}>
        {options.map((o) => {
          const ativo = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativo }}
              onPress={() => onChange(o.value)}
              style={[s.chip, ativo && s.chipAtivo]}
            >
              <Text style={[s.chipText, ativo && { color: colors.white }]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function PhotoPicker({
  fotos,
  onChange,
  max = 4,
}: {
  fotos: string[];
  onChange: (fotos: string[]) => void;
  max?: number;
}) {
  const restante = max - fotos.length;

  async function daGaleria() {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: restante,
      quality: 0.7,
    });
    if (!r.canceled) onChange([...fotos, ...r.assets.map((a) => a.uri)].slice(0, max));
  }

  async function daCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      avisar('Permissão necessária', 'Permita o acesso à câmera para tirar fotos.');
      return;
    }
    const r = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!r.canceled) onChange([...fotos, r.assets[0].uri].slice(0, max));
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={s.label}>{max === 1 ? 'Foto' : `Fotos (até ${max})`}</Text>
      <View style={s.photos}>
        {fotos.map((uri) => (
          <View key={uri}>
            <Image source={{ uri }} style={s.photo} accessibilityLabel="Foto selecionada" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remover foto"
              onPress={() => onChange(fotos.filter((f) => f !== uri))}
              style={s.remove}
            >
              <Feather name="x" size={14} color={colors.white} />
            </Pressable>
          </View>
        ))}
      </View>
      {restante > 0 && (
        <View style={s.row}>
          <Pressable accessibilityRole="button" onPress={daCamera} style={s.ghost}>
            <Feather name="camera" size={18} color={colors.teal} />
            <Text style={s.ghostText}>Tirar foto</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={daGaleria} style={s.ghost}>
            <Feather name="image" size={18} color={colors.teal} />
            <Text style={s.ghostText}>Galeria</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function LocationField({
  value,
  onChange,
}: {
  value: string;
  onChange: (texto: string, coords?: Coordenadas) => void;
}) {
  const [carregando, setCarregando] = useState(false);
  const [cep, setCep] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState('');
  const [avisoCep, setAvisoCep] = useState('');

  async function buscarEndereco() {
    setErroCep('');
    setAvisoCep('');
    setBuscandoCep(true);
    try {
      const e = await buscarCep(cep);
      const partes = [e.rua, e.bairro, `${e.cidade} - ${e.estado}`].filter(Boolean);
      onChange(partes.join(', '));
      setAvisoCep(
        e.rua
          ? 'Endereço preenchido. Acrescente o número, se quiser.'
          : 'Esse CEP não traz o nome da rua. Complete o endereço abaixo.',
      );
    } catch (e) {
      setErroCep((e as { message?: string }).message ?? 'Não foi possível consultar o CEP.');
    } finally {
      setBuscandoCep(false);
    }
  }

  async function usarMinhaLocalizacao() {
    setCarregando(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        avisar('Permissão necessária', 'Permita o acesso à localização ou digite o endereço.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;
      const [end] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const texto = end
        ? [end.street, end.streetNumber, end.district, end.city, end.region].filter(Boolean).join(', ')
        : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      onChange(texto, { latitude, longitude });
    } catch {
      avisar('Não foi possível obter a localização', 'Digite o endereço manualmente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <Field
        label="CEP (opcional)"
        placeholder="00000-000"
        keyboardType="number-pad"
        returnKeyType="search"
        value={cep}
        onChangeText={(t) => setCep(mascaraCep(t))}
        onSubmitEditing={buscarEndereco}
      />
      <Pressable accessibilityRole="button" disabled={buscandoCep} onPress={buscarEndereco} style={s.ghost}>
        {buscandoCep ? (
          <ActivityIndicator color={colors.teal} />
        ) : (
          <Feather name="search" size={18} color={colors.teal} />
        )}
        <Text style={s.ghostText}>{buscandoCep ? 'Buscando...' : 'Buscar endereço pelo CEP'}</Text>
      </Pressable>
      {erroCep ? (
        <Text accessibilityRole="alert" style={s.erroTexto}>
          {erroCep}
        </Text>
      ) : null}
      {avisoCep ? <Text style={s.infoTexto}>{avisoCep}</Text> : null}

      <Field
        label="Localização"
        placeholder="Rua, bairro e cidade"
        value={value}
        onChangeText={(t) => onChange(t)}
      />
      <Pressable accessibilityRole="button" onPress={usarMinhaLocalizacao} style={s.ghost}>
        {carregando ? (
          <ActivityIndicator color={colors.teal} />
        ) : (
          <Feather name="crosshair" size={18} color={colors.teal} />
        )}
        <Text style={s.ghostText}>Usar minha localização</Text>
      </Pressable>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  color = colors.teal,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [s.primary, { backgroundColor: color, opacity: pressed || loading ? 0.8 : 1 }]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={s.primaryText}>{title}</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  input: {
    minHeight: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 96, paddingTop: 12, textAlignVertical: 'top' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipAtivo: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photo: { width: 76, height: 76, borderRadius: 12 },
  remove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', gap: 8 },
  ghost: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.teal,
    alignSelf: 'flex-start',
  },
  ghostText: { fontSize: 14, fontWeight: '600', color: colors.teal },
  erroTexto: { fontSize: 13, color: colors.red },
  infoTexto: { fontSize: 13, color: colors.muted },
  primary: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '800', color: colors.white },
});
