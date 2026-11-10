const pad = (n: number) => String(n).padStart(2, '0');

export function hoje(): string {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Aplica a máscara DD/MM/AAAA enquanto o usuário digita. */
export function mascaraData(texto: string): string {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

/** Valida DD/MM/AAAA e não aceita datas futuras. */
export function dataValida(texto: string): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return false;
  const [, d, mo, y] = m.map(Number);
  const dt = new Date(y, mo - 1, d);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === mo - 1 &&
    dt.getDate() === d &&
    dt <= new Date()
  );
}
