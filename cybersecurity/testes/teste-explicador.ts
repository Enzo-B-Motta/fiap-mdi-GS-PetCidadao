
import { analisarFluxo } from "../taint-analysis";
import { explicarRisco } from "../explicador-riscos";

console.log("=== PET CIDADAO - EXPLICACAO DE RISCOS ===");

// TESTE 1: Dados pessoais em saída insegura
const auditoria1 = analisarFluxo(
  "Contato ficticio: teste@exemplo.com",
  "LOG_PUBLICO"
);

const explicacao1 = explicarRisco(auditoria1);

console.log("\nTESTE 1 - RISCO IDENTIFICADO");
console.log(JSON.stringify(explicacao1, null, 2));

// TESTE 2: Mensagem sem dados pessoais
const auditoria2 = analisarFluxo(
  "Animal encontrado na praca central.",
  "LOG_PUBLICO"
);

const explicacao2 = explicarRisco(auditoria2);

console.log("\nTESTE 2 - SEM RISCO IDENTIFICADO");
console.log(JSON.stringify(explicacao2, null, 2));

// Verificações automáticas
const aprovado =
  explicacao1.nivel === "ALTO" &&
  explicacao1.recomendacao.length > 0 &&
  explicacao2.nivel === "BAIXO" &&
  explicacao2.recomendacao.length > 0;

if (!aprovado) {
  throw new Error("FALHA: explicacao de riscos incorreta.");
}

console.log("\nTESTES DE EXPLICACAO CONCLUIDOS!");
