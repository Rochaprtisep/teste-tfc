// Listas partilhadas entre o Studio e o site. A ordem aqui é a ordem no site.

export const DEPARTAMENTOS = [
  { title: 'Direção', value: 'direcao' },
  { title: 'Mecânica', value: 'mecanica' },
  { title: 'Elétrica e Eletrónica', value: 'eletrica' },
  { title: 'Hidrogénio e Fuel Cell', value: 'fuelcell' },
  { title: 'Software e Dados', value: 'software' },
  { title: 'Marketing e Parcerias', value: 'marketing' },
] as const;

export const NIVEIS_PARCEIRO = [
  { title: 'Parceiro principal', value: 'principal' },
  { title: 'Ouro', value: 'ouro' },
  { title: 'Prata', value: 'prata' },
  { title: 'Apoio', value: 'apoio' },
] as const;
