
import { registrarLogPublico } from "../log-seguro";

console.log("=== PET CIDADAO - TESTE DE LOG SEGURO ===");

// TESTE 1: Mensagem contendo CPF
console.log("\nTESTE 1 - TENTATIVA DE EXPOSICAO DE CPF");

const resultado1 = registrarLogPublico(
  "Contato do denunciante: CPF 123.456.789-09"
);

console.log("Resultado:", resultado1);

// TESTE 2: Mensagem sem dados pessoais
console.log("\nTESTE 2 - MENSAGEM SEM DADOS PESSOAIS");

const resultado2 = registrarLogPublico(
  "Animal encontrado na praca central."
);

console.log("Resultado:", resultado2);

// TESTE 3: Mensagem contendo e-mail
console.log("\nTESTE 3 - TENTATIVA DE EXPOSICAO DE EMAIL");

const resultado3 = registrarLogPublico(
  "Contato: teste@exemplo.com"
);

console.log("Resultado:", resultado3);

// Verificacao automatica
const aprovado =
  resultado1.gravado === false &&
  resultado2.gravado === true &&
  resultado3.gravado === false;

if (!aprovado) {
  throw new Error("FALHA: politica de seguranca nao aplicada.");
}

console.log("\nTESTES DE BLOQUEIO CONCLUIDOS!");
