
import { detectarPII } from "./pii-detector";

export type Destino = "LOG_PUBLICO" | "ARMAZENAMENTO_SEGURO";

export interface ResultadoAuditoria {
  permitido: boolean;
  destino: Destino;
  risco: "ALTO" | "BAIXO";
  tiposPII: string[];
  mensagem: string;
}

export function analisarFluxo(
  texto: string,
  destino: Destino
): ResultadoAuditoria {
  const deteccoes = detectarPII(texto);
  const contemPII = deteccoes.length > 0;

  const bloqueado =
    contemPII && destino === "LOG_PUBLICO";

  return {
    permitido: !bloqueado,
    destino,
    risco: bloqueado ? "ALTO" : "BAIXO",
    tiposPII: [...new Set(deteccoes.map(d => d.tipo))],
    mensagem: bloqueado
      ? "Bloqueado: dados pessoais em saída insegura."
      : "Fluxo permitido pela política de demonstração.",
  };
}
