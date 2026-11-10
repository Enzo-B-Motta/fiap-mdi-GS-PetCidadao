import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Ellipse, Rect } from 'react-native-svg';

type IconName = React.ComponentProps<typeof Feather>['name'];

const colors = {
  bg: '#FFF8F0',
  text: '#1F2A2E',
  muted: '#4F5D62',
  teal: '#0F766E',
  orange: '#C2410C',
  red: '#B91C1C',
  border: '#EADFD2',
  white: '#FFFFFF',
};

function Logo() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" accessibilityLabel="Logo Pet Cidadão">
      <Rect width={48} height={48} rx={14} fill={colors.teal} />
      <Ellipse cx={24} cy={31} rx={8} ry={6.5} fill="#fff" />
      <Ellipse cx={14.5} cy={23} rx={3.2} ry={4} fill="#fff" />
      <Ellipse cx={33.5} cy={23} rx={3.2} ry={4} fill="#fff" />
      <Ellipse cx={20} cy={15.5} rx={3.2} ry={4.2} fill="#fff" />
      <Ellipse cx={28} cy={15.5} rx={3.2} ry={4.2} fill="#fff" />
    </Svg>
  );
}

type BigCardProps = {
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
  onPress: () => void;
};

function BigCard({ title, subtitle, icon, color, onPress }: BigCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [styles.bigCard, { backgroundColor: color, opacity: pressed ? 0.85 : 1 }]}
    >
      <Feather name={icon} size={26} color={colors.white} />
      <View>
        <Text style={styles.bigTitle}>{title}</Text>
        <Text style={styles.bigSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

type SmallCardProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
};

function SmallCard({ label, icon, onPress }: SmallCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.smallCard, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Feather name={icon} size={24} color={colors.teal} />
      <Text style={styles.smallLabel}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  const go = (href: string) => router.push(href as Href);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Logo />
          <View>
            <Text style={styles.brand}>
              Pet <Text style={{ color: colors.teal }}>Cidadão</Text>
            </Text>
            <Text style={styles.tagline}>Juntos pelo bem-estar animal</Text>
          </View>
        </View>

        <Text style={styles.headline}>Como podemos ajudar um animal hoje?</Text>

        <View style={styles.row}>
          <BigCard
            title="Perdi meu pet"
            subtitle="Cadastrar desaparecido"
            icon="search"
            color={colors.orange}
            onPress={() => go('/animais/novo?tipo=perdido')}
          />
          <BigCard
            title="Encontrei um pet"
            subtitle="Cadastrar encontrado"
            icon="map-pin"
            color={colors.teal}
            onPress={() => go('/animais/novo?tipo=encontrado')}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Denunciar abandono ou maus-tratos"
          onPress={() => go('/denuncia/nova')}
          style={({ pressed }) => [styles.alertCard, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Feather name="alert-triangle" size={26} color={colors.white} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bigTitle}>Denunciar abandono ou maus-tratos</Text>
            <Text style={styles.bigSubtitle}>Registre a situação com fotos e local</Text>
          </View>
        </Pressable>

        <Text style={styles.section}>Encontre ajuda perto de você</Text>

        <View style={styles.grid}>
          <SmallCard label="ONGs e abrigos" icon="home" onPress={() => go('/ajuda/ongs')} />
          <SmallCard label="Veterinários" icon="plus-circle" onPress={() => go('/ajuda/veterinarios')} />
          <SmallCard label="Vacinação" icon="shield" onPress={() => go('/ajuda/vacinacao')} />
          <SmallCard label="Castração e campanhas" icon="calendar" onPress={() => go('/ajuda/castracao')} />
        </View>

        <View style={styles.footer}>
          <Pressable accessibilityRole="link" onPress={() => go('/meus-cadastros')} style={styles.link}>
            <Text style={styles.linkText}>Meus cadastros</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => go('/perfil')} style={styles.link}>
            <Text style={styles.linkText}>Meu perfil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brand: { fontSize: 24, fontWeight: '800', color: colors.text },
  tagline: { fontSize: 13, color: colors.muted },
  headline: { fontSize: 26, fontWeight: '800', lineHeight: 31, color: colors.text },
  row: { flexDirection: 'row', gap: 12 },
  bigCard: {
    flex: 1,
    minHeight: 116,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  bigTitle: { fontSize: 17, fontWeight: '800', color: colors.white },
  bigSubtitle: { fontSize: 13, color: colors.white, marginTop: 2 },
  alertCard: {
    backgroundColor: colors.red,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  section: { fontSize: 15, fontWeight: '800', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  smallCard: {
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 76,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { minHeight: 44, justifyContent: 'center' },
  linkText: { fontSize: 14, fontWeight: '600', color: colors.teal },
});
