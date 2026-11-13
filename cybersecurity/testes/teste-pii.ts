
import { detectarPII } from "../pii-detector";

const mensagem = `
Encontrei um cachorro perdido.
Meu e-mail é teste@exemplo.com.
Meu CPF é 123.456.789-09.
Meu telefone é (11) 98765-4321.
`;

console.log("=== TESTE DE SEGURANÇA PET CIDADÃO ===");

const resultados = detectarPII(mensagem);

console.log(JSON.stringify(resultados, null, 2));

if (resultados.length >= 3) {
  console.log("TESTE CONCLUÍDO: dados pessoais detectados!");
} else {
  console.log("ATENÇÃO: alguns dados não foram detectados.");
}
