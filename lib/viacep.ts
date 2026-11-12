export type Endereco = {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export const limparCep = (texto: string) => texto.replace(/\D/g, '').slice(0, 8);

/** Aplica a máscara 00000-000 enquanto o usuário digita. */
export function mascaraCep(texto: string): string {
  const n = limparCep(texto);
  return n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n;
}

/** Consulta a API pública ViaCEP (https://viacep.com.br). */
export async function buscarCep(cep: string): Promise<Endereco> {
  const limpo = limparCep(cep);
  if (limpo.length !== 8) throw new Error('Digite um CEP com 8 números.');

  let resposta: Response;
  try {
    resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
  } catch {
    throw new Error('Sem conexão. Verifique a internet e tente de novo.');
  }
  if (!resposta.ok) throw new Error('Não foi possível consultar o CEP agora. Tente novamente.');

  const dados = (await resposta.json()) as {
    erro?: boolean | string;
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  };

  // CEP com formato válido, mas que não existe: a API responde { "erro": true }
  if (dados.erro) throw new Error('CEP não encontrado. Confira os números ou digite o endereço.');

  return {
    cep: dados.cep,
    rua: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    estado: dados.uf,
  };
}
