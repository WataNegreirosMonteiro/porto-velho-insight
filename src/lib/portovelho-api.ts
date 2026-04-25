const BASE = "https://api.portovelho.ro.gov.br/api/v1";

export interface Instituicao {
  id: number;
  nome: string;
  titulo: string;
  url: string;
}

export interface UnidadeGestora {
  id: string;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  telefone: string | null;
}

export interface Servidor {
  unidade_gestora_id: string;
  ano: string;
  mes: string;
  nome_mes: string;
  matricula: string;
  cpf: string;
  nome: string;
  regime: string | null;
  cargo: string | null;
  situacao: string | null;
  lotacao: string | null;
  local_trabalho: string | null;
  horas_semanais: number | null;
  data_admissao: string | null;
  data_demissao: string | null;
  unidade_gestora?: UnidadeGestora;
  portal?: Instituicao;
}

interface ApiResponse<T> {
  data: T;
}

export async function fetchInstituicoes(): Promise<Instituicao[]> {
  const res = await fetch(`${BASE}/recursos-humanos/instituicoes`);
  if (!res.ok) throw new Error(`Erro ao buscar institui��es (${res.status})`);
  const json: ApiResponse<Instituicao[]> = await res.json();
  return json.data ?? [];
}

export async function fetchMovimentacoes(
  portalId: number,
  ano: string,
  mes: string,
): Promise<Servidor[]> {
  const res = await fetch(`${BASE}/recursos-humanos/movimentacoes/${portalId}/${ano}/${mes}`);
  if (!res.ok) throw new Error(`Erro ao buscar servidores (${res.status})`);
  const json: ApiResponse<Servidor[]> = await res.json();
  return json.data ?? [];
}

export function formatName(name: string): string {
  if (!name) return "";
  const lower = name.toLowerCase();
  const small = new Set(["de", "da", "do", "das", "dos", "e"]);
  return lower
    .split(" ")
    .map((w, i) => (small.has(w) && i > 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function formatDate(d: string | null): string {
  if (!d) return "�";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

export function buildGoogleSearch(nome: string, cpf: string): string {
  const query = `"${nome}""cpf"`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
