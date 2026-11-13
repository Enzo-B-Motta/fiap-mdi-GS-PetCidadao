
export type TipoPII = "CPF" | "EMAIL" | "TELEFONE";

export interface DeteccaoPII {
  tipo: TipoPII;
  valorMascarado: string;
  inicio: number;
  fim: number;
}

const padroes: Record<TipoPII, RegExp> = {
  CPF: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
  EMAIL: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  TELEFONE: /(?<!\d)(?:\+55\s?)?(?:\(?\d{2}\)?[\s-]?)?9?\d{4}[\s-]?\d{4}(?!\d)/g,
};

function mascarar(valor: string): string {
  return valor.replace(/[A-Za-z0-9]/g, "*");
}

export function detectarPII(texto: string): DeteccaoPII[] {
  const resultados: DeteccaoPII[] = [];

  for (const [tipo, regex] of Object.entries(padroes)) {
    for (const match of texto.matchAll(regex)) {
      resultados.push({
        tipo: tipo as TipoPII,
        valorMascarado: mascarar(match[0]),
        inicio: match.index,
        fim: match.index + match[0].length,
      });
    }
  }

  return resultados.sort((a, b) => a.inicio - b.inicio);
}
