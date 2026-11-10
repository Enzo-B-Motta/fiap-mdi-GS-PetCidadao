export type CategoriaAjuda = 'ongs' | 'veterinarios' | 'vacinacao' | 'castracao';

export type Local = {
  id: string;
  categoria: CategoriaAjuda;
  nome: string;
  endereco: string;
  telefone?: string;
  observacao?: string;
};

/**
 * DADOS DE EXEMPLO: substitua por uma chamada à sua API ou a uma base real
 * (prefeitura, ONGs parceiras etc.).
 */
export const locais: Local[] = [
  { id: '1', categoria: 'ongs', nome: '[Exemplo] ONG Amigos dos Bichos', endereco: '[Endereço de exemplo]', observacao: 'Atendimento em horário comercial' },
  { id: '2', categoria: 'veterinarios', nome: '[Exemplo] Clínica Veterinária 24h', endereco: '[Endereço de exemplo]' },
  { id: '3', categoria: 'vacinacao', nome: '[Exemplo] Campanha de vacinação antirrábica', endereco: '[Endereço de exemplo]', observacao: 'Data: [a definir]' },
  { id: '4', categoria: 'castracao', nome: '[Exemplo] Mutirão de castração', endereco: '[Endereço de exemplo]', observacao: 'Inscrição: [a definir]' },
];
