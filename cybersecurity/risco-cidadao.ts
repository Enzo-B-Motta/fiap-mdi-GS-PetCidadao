
import { analisarFluxo } from "./taint-analysis";

export interface IndicadoresRisco {
  totalAnalises: number;
  riscosAltos: number;
  riscosBaixos: number;
  bloqueios: number;
  indiceRisco: number;
  classificacao: "BAIXO" | "MEDIO" | "ALTO";
}

export interface EntradaAnalise {
  texto: string;
  destino: "LOG_PUBLICO" | "ARMAZENAMENTO_SEGURO";
}

export function calcularRiscoCidadao(
  entradas: EntradaAnalise[]
): IndicadoresRisco {
  const resultados = entradas.map((entrada) =>
    analisarFluxo(entrada.texto, entrada.destino)
  );

  const totalAnalises = resultados.length;
  const riscosAltos = resultados.filter(
    (r) => r.risco === "ALTO"
  ).length;
  const riscosBaixos = totalAnalises - riscosAltos;
  const bloqueios = resultados.filter(
    (r) => !r.permitido
  ).length;

  // Indicador demonstrativo: percentual de análises
  // classificadas como risco alto.
  const indiceRisco =
    totalAnalises === 0
      ? 0
      : Math.round((riscosAltos / totalAnalises) * 100);

  const classificacao =
    indiceRisco >= 70
      ? "ALTO"
      : indiceRisco >= 30
        ? "MEDIO"
        : "BAIXO";

  return {
    totalAnalises,
    riscosAltos,
    riscosBaixos,
    bloqueios,
    indiceRisco,
    classificacao,
  };
}
