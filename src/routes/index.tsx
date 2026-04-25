import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  Database,
  Loader2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ServidorCard } from "@/components/ServidorCard";
import { ServidorDialog } from "@/components/ServidorDialog";
import {
  fetchInstituicoes,
  fetchMovimentacoes,
  type Instituicao,
  type Servidor,
} from "@/lib/portovelho-api";
import logoUrl from "../../logo.svg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Consulta de Servidores | Porto Velho" },
      {
        name: "description",
        content:
          "Consulte servidores p�blicos de Porto Velho por institui��o, per�odo e filtro de nome.",
      },
    ],
  }),
});

const MESES = [
  { v: "01", l: "Janeiro" },
  { v: "02", l: "Fevereiro" },
  { v: "03", l: "Mar�o" },
  { v: "04", l: "Abril" },
  { v: "05", l: "Maio" },
  { v: "06", l: "Junho" },
  { v: "07", l: "Julho" },
  { v: "08", l: "Agosto" },
  { v: "09", l: "Setembro" },
  { v: "10", l: "Outubro" },
  { v: "11", l: "Novembro" },
  { v: "12", l: "Dezembro" },
];

const LINKS_RAPIDOS = ["Transpar�ncia", "Portal do Servidor", "Ouvidoria", "Acesso � Informa��o"];

const MENU_PRINCIPAL = ["In�cio", "Not�cias", "Servi�os", "Secretarias", "Concursos", "Legisla��o"];

const ANO_ATUAL = new Date().getFullYear();
const ANOS = Array.from({ length: 6 }, (_, i) => String(ANO_ATUAL - i));

function Index() {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loadingInst, setLoadingInst] = useState(true);
  const [errorInst, setErrorInst] = useState<string | null>(null);

  const [portalId, setPortalId] = useState<string>("");
  const [ano, setAno] = useState<string>(String(ANO_ATUAL));
  const [mes, setMes] = useState<string>(String(new Date().getMonth() + 1).padStart(2, "0"));

  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loadingServ, setLoadingServ] = useState(false);
  const [errorServ, setErrorServ] = useState<string | null>(null);

  const [filtro, setFiltro] = useState("");
  const [selecionado, setSelecionado] = useState<Servidor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInstituicoes()
      .then((d) => setInstituicoes(d.sort((a, b) => a.titulo.localeCompare(b.titulo))))
      .catch((e) => setErrorInst(e.message))
      .finally(() => setLoadingInst(false));
  }, []);

  useEffect(() => {
    if (!portalId) return;
    setLoadingServ(true);
    setErrorServ(null);
    setServidores([]);
    fetchMovimentacoes(Number(portalId), ano, mes)
      .then(setServidores)
      .catch((e) => setErrorServ(e.message))
      .finally(() => setLoadingServ(false));
  }, [portalId, ano, mes]);

  const filtrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return servidores;
    return servidores.filter(
      (s) =>
        s.nome?.toLowerCase().includes(q) ||
        s.cargo?.toLowerCase().includes(q) ||
        s.matricula?.toLowerCase().includes(q),
    );
  }, [servidores, filtro]);

  const handleView = (s: Servidor) => {
    setSelecionado(s);
    setDialogOpen(true);
  };

  const mesLabel = MESES.find((item) => item.v === mes)?.l ?? "--";

  return (
    <div className="min-h-screen bg-background">
      <header className="pv-topbar">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src={logoUrl} alt="Prefeitura de Porto Velho" className="h-14 w-auto sm:h-16" />
              <div className="space-y-1">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Portal Institucional
                </p>
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Consulta de Servidores
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {LINKS_RAPIDOS.map((link) => (
                <a key={link} href="#" className="transition-colors hover:text-primary">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pv-mainnav">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <nav className="flex items-center gap-1 overflow-x-auto py-2">
              {MENU_PRINCIPAL.map((item) => (
                <a key={item} href="#" className="pv-mainnav-link">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <section className="pv-hero">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/85">
              Transpar�ncia ativa
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-primary-foreground sm:text-4xl">
              Dados p�blicos de servidores do munic�pio de Porto Velho
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/90 sm:text-base">
              Selecione institui��o, ano e m�s para consultar v�nculos, cargos e informa��es
              funcionais. Tudo em uma interface simples, no padr�o visual oficial.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pv-chip">
                <ShieldCheck className="h-3.5 w-3.5" />
                Dados oficiais
              </span>
              <span className="pv-chip">
                <Database className="h-3.5 w-3.5" />
                Base p�blica
              </span>
              <span className="pv-chip">
                <CalendarClock className="h-3.5 w-3.5" />
                Consulta por per�odo
              </span>
            </div>
          </div>

          <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <InfoTile
              label="Institui��es dispon�veis"
              value={loadingInst ? "--" : String(instituicoes.length)}
            />
            <InfoTile label="Ano de refer�ncia" value={ano} />
            <InfoTile label="M�s selecionado" value={mesLabel} />
          </div>
        </section>

        <Card className="pv-filter-card mt-6 border-border/70 shadow-[var(--shadow-card)]">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Filtro de consulta</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha os par�metros para listar os servidores.
                </p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                Painel RH
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-6">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Institui��o
                </label>
                <Select value={portalId} onValueChange={setPortalId} disabled={loadingInst}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={loadingInst ? "Carregando..." : "Selecione uma institui��o"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {instituicoes.map((i) => (
                      <SelectItem key={i.id} value={String(i.id)}>
                        {i.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Ano
                </label>
                <Select value={ano} onValueChange={setAno}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  M�s
                </label>
                <Select value={mes} onValueChange={setMes}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESES.map((m) => (
                      <SelectItem key={m.v} value={m.v}>
                        {m.l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Filtrar
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Nome, cargo..."
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {errorInst && (
              <p className="mt-3 text-sm text-destructive">
                Erro ao carregar institui��es: {errorInst}
              </p>
            )}
          </CardContent>
        </Card>

        {!portalId && !loadingInst && (
          <EmptyState
            icon={<Building2 className="h-10 w-10" />}
            title="Selecione uma institui��o"
            description="Escolha uma institui��o acima para listar os servidores do per�odo."
          />
        )}

        {loadingServ && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando servidores...
          </div>
        )}

        {errorServ && (
          <Card className="border-destructive/40 bg-destructive/5 shadow-none">
            <CardContent className="p-5 text-sm text-destructive">
              N�o foi poss�vel carregar os servidores: {errorServ}
            </CardContent>
          </Card>
        )}

        {!loadingServ && portalId && !errorServ && filtrados.length === 0 && (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="Nenhum servidor encontrado"
            description="Tente outro m�s, ano ou ajuste o filtro."
          />
        )}

        {!loadingServ && filtrados.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Servidores localizados</h3>
                <p className="text-sm text-muted-foreground">
                  {filtrados.length} servidor
                  {filtrados.length !== 1 && "es"} encontrado
                  {filtrados.length !== 1 && "s"}
                </p>
              </div>
              <span className="rounded-md bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                {mesLabel}/{ano}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((s, idx) => (
                <ServidorCard key={`${s.matricula}-${idx}`} servidor={s} onView={handleView} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-10 border-t-4 border-accent bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4 text-center md:text-left">
              <img src={logoUrl} alt="Prefeitura de Porto Velho" className="h-16 w-auto" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/90">
                  Cidade de Porto Velho
                </p>
                <p className="text-sm text-primary-foreground/90">
                  Avenida 7 de Setembro, 237 - Porto Velho, RO
                </p>
              </div>
            </div>
            <p className="text-xs text-primary-foreground/80">
              � {ANO_ATUAL} Prefeitura de Porto Velho. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <ServidorDialog servidor={selecionado} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/35 bg-white/15 p-4 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-primary-foreground/85">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-primary-foreground">{value}</p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/30 bg-card/60 py-14 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
