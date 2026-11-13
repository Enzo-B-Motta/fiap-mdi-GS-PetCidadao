
import { calcularRiscoCidadao } from "../risco-cidadao";

console.log("=== PET CIDADAO - DASHBOARD RISCO CIDADAO ===");

// Dados fictícios para simular uma auditoria
const entradas = [
  {
    texto: "Contato: teste@exemplo.com",
    destino: "LOG_PUBLICO" as const,
  },
  {
    texto: "Animal encontrado na praça central.",
    destino: "LOG_PUBLICO" as const,
  },
  {
    texto: "CPF: 123.456.789-09",
    destino: "LOG_PUBLICO" as const,
  },
  {
    texto: "Cachorro perdido no bairro.",
    destino: "LOG_PUBLICO" as const,
  },
  {
    texto: "Telefone: (11) 98765-4321",
    destino: "LOG_PUBLICO" as const,
  },
];

const indicadores = calcularRiscoCidadao(entradas);

console.log("\nINDICADORES:");
console.log(JSON.stringify(indicadores, null, 2));

// Verificação automática dos resultados
const aprovado =
  indicadores.totalAnalises === 5 &&
  indicadores.riscosAltos === 3 &&
  indicadores.riscosBaixos === 2 &&
  indicadores.bloqueios === 3 &&
  indicadores.indiceRisco === 60 &&
  indicadores.classificacao === "MEDIO";

if (!aprovado) {
  throw new Error("FALHA: indicadores incorretos.");
}

console.log("\nTESTE DO DASHBOARD CONCLUIDO!");
