
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { calcularRiscoCidadao } from "../risco-cidadao";

// Dados fictícios utilizados na demonstração
const entradas = [
  { texto: "Contato: teste@exemplo.com", destino: "LOG_PUBLICO" as const },
  { texto: "Animal encontrado na praça.", destino: "LOG_PUBLICO" as const },
  { texto: "CPF: 123.456.789-09", destino: "LOG_PUBLICO" as const },
  { texto: "Cachorro perdido no bairro.", destino: "LOG_PUBLICO" as const },
  { texto: "Telefone: (11) 98765-4321", destino: "LOG_PUBLICO" as const },
];

const indicadores = calcularRiscoCidadao(entradas);

export default function DashboardRisco() {

  const [explicacaoIA, setExplicacaoIA] = useState("");
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState("");

  async function explicarComIA() {
    setCarregandoIA(true);
    setErroIA("");
    setExplicacaoIA("");

    try {
      // Exemplo fictício para demonstração.
      // Nenhum CPF ou e-mail real é enviado.
      const resposta = await fetch(
        "http://127.0.0.1:3001/explicar-risco",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipoPII: "EMAIL",
            risco: "ALTO",
            destino: "LOG_PUBLICO",
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error("Falha ao consultar o servidor de IA.");
      }

      const dados = await resposta.json();

      if (
        dados.sucesso !== true ||
        typeof dados.explicacao !== "string"
      ) {
        throw new Error("Resposta inesperada do servidor.");
      }

      setExplicacaoIA(dados.explicacao);
    } catch {
      setErroIA(
        "Não foi possível gerar a explicação. Verifique se o servidor de IA está funcionando."
      );
    } finally {
      setCarregandoIA(false);
    }
  }

  const corRisco =
    indicadores.classificacao === "ALTO"
      ? "#B91C1C"
      : indicadores.classificacao === "MEDIO"
        ? "#D97706"
        : "#15803D";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>PET CIDADÃO</Text>
      <Text style={styles.subtitulo}>
        Dashboard Executivo — Risco Cidadão
      </Text>

      <View style={styles.destaque}>
        <Text style={styles.rotulo}>ÍNDICE DE RISCO</Text>
        <Text style={[styles.indice, { color: corRisco }]}>
          {indicadores.indiceRisco}%
        </Text>
        <Text style={[styles.classificacao, { color: corRisco }]}>
          RISCO {indicadores.classificacao}
        </Text>
      </View>

      <View style={styles.grade}>
        <View style={styles.cartao}>
          <Text style={styles.numero}>
            {indicadores.totalAnalises}
          </Text>
          <Text style={styles.legenda}>Análises realizadas</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.numero}>
            {indicadores.riscosAltos}
          </Text>
          <Text style={styles.legenda}>Riscos altos</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.numero}>
            {indicadores.riscosBaixos}
          </Text>
          <Text style={styles.legenda}>Riscos baixos</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.numero}>
            {indicadores.bloqueios}
          </Text>
          <Text style={styles.legenda}>Bloqueios previstos</Text>
        </View>
      </View>

      <View style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#0F766E",
          marginBottom: 12,
        }}>
          Orientação de segurança com IA
        </Text>

        <Text style={{
          color: "#64748B",
          marginBottom: 16,
        }}>
          Demonstração: risco potencial de exposição
          de e-mail em log público.
        </Text>

        <Pressable
          onPress={explicarComIA}
          disabled={carregandoIA}
          style={{
            backgroundColor: carregandoIA ? "#94A3B8" : "#0F766E",
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
            {carregandoIA ? "Consultando Gemini..." : "Explicar risco com IA"}
          </Text>
        </Pressable>

        {carregandoIA && (
          <ActivityIndicator
            color="#0F766E"
            style={{ marginTop: 16 }}
          />
        )}

        {erroIA !== "" && (
          <Text style={{ color: "#B91C1C", marginTop: 16 }}>
            {erroIA}
          </Text>
        )}

        {explicacaoIA !== "" && (
          <View style={{
            backgroundColor: "#F0FDFA",
            padding: 16,
            borderRadius: 10,
            marginTop: 16,
          }}>
            <Text style={{ color: "#134E4A", lineHeight: 23 }}>
              {explicacaoIA}
            </Text>
          </View>
        )}
      </View>


      <Text style={styles.observacao}>
        Indicadores demonstrativos calculados a partir
        de cinco mensagens fictícias. Não representam
        uma auditoria completa do aplicativo.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F766E",
  },
  subtitulo: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 24,
  },
  destaque: {
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "bold",
  },
  indice: {
    fontSize: 56,
    fontWeight: "bold",
    marginVertical: 10,
  },
  classificacao: {
    fontSize: 18,
    fontWeight: "bold",
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cartao: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
  },
  numero: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
  },
  legenda: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
  },
  observacao: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 20,
    marginBottom: 40,
  },
});
