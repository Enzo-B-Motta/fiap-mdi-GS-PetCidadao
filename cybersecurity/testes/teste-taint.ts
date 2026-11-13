import { analisarFluxo } from "../taint-analysis";

console.log("=== PET CIDADÃO - TESTE TAINT ANALYSIS ===");

// TESTE 1: Dados pessoais enviados para log público
const teste1 = analisarFluxo("Meu CPF é 123.456.789-09", "LOG_PUBLICO");

console.log("\nTESTE 1 - PII EM LOG PUBLICO");
console.log(JSON.stringify(teste1, null, 2));

// TESTE 2: Mensagem sem dados pessoais
const teste2 = analisarFluxo(
  "Encontrei um cachorro perdido na praça.",
  "LOG_PUBLICO",
);

console.log("\nTESTE 2 - MENSAGEM SEM PII");
console.log(JSON.stringify(teste2, null, 2));

// TESTE 3: Dados pessoais em armazenamento autorizado
const teste3 = analisarFluxo(
  "Contato: teste@exemplo.com",
  "ARMAZENAMENTO_SEGURO",
);

console.log("\nTESTE 3 - ARMAZENAMENTO AUTORIZADO");
console.log(JSON.stringify(teste3, null, 2));

// Verificação automática
const aprovado =
  teste1.permitido === false &&
  teste1.risco === "ALTO" &&
  teste1.tiposPII.includes("CPF") &&
  teste2.permitido === true &&
  teste2.risco === "BAIXO" &&
  teste3.permitido === true &&
  teste3.tiposPII.includes("EMAIL");

if (!aprovado) {
  throw new Error("FALHA: comportamento diferente do esperado.");
} else {
  console.log("\nTESTES DE TAINT ANALYSIS CONCLUIDOS!");
}
