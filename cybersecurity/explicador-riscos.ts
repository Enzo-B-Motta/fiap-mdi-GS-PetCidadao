
import type { ResultadoAuditoria } from "./taint-analysis";

export interface ExplicacaoRisco {
  titulo: string;
  explicacao: string;
  recomendacao: string;
  nivel: "ALTO" | "BAIXO";
}

export function explicarRisco(
  auditoria: ResultadoAuditoria
): ExplicacaoRisco {
  if (!auditoria.permitido) {
    return {
      titulo: "Seus dados pessoais precisam de proteção",
      explicacao:
        "Identificamos informações pessoais que poderiam " +
        "ser expostas em um registro público.",
      recomendacao:
        "Evite compartilhar CPF, telefone ou e-mail em " +
        "campos públicos. Utilize canais protegidos.",
      nivel: "ALTO",
    };
  }

  return {
    titulo: "Nenhum risco identificado nesta verificação",
    explicacao:
      "A análise não encontrou uma tentativa de envio " +
      "de dados pessoais para um log público.",
    recomendacao:
      "Continue evitando compartilhar informações " +
      "pessoais desnecessárias.",
    nivel: "BAIXO",
  };
}
