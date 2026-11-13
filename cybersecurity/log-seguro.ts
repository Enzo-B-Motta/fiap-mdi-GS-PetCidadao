
import { analisarFluxo } from "./taint-analysis";

export interface ResultadoLog {
  gravado: boolean;
  mensagem: string;
}

export function registrarLogPublico(
  conteudo: string
): ResultadoLog {
  const auditoria = analisarFluxo(
    conteudo,
    "LOG_PUBLICO"
  );

  if (!auditoria.permitido) {
    console.warn(
      "[SEGURANCA] Escrita bloqueada. Tipos de PII:",
      auditoria.tiposPII.join(", ")
    );

    return {
      gravado: false,
      mensagem: "Log bloqueado por conter dados pessoais.",
    };
  }

  // A escrita só acontece após a verificação.
  console.log("[LOG PUBLICO]", conteudo);

  return {
    gravado: true,
    mensagem: "Log registrado com sucesso.",
  };
}
