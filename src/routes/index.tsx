import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Building2, Loader2, Search, Users } from "lucide-react";
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

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Consulta Servidores — Porto Velho" },
      {
        name: "description",
        content:
          "Consulte servidores públicos de Porto Velho por instituição e realize buscas avançadas no Google.",
      },
    ],
  }),
});

const MESES = [
  { v: "01", l: "Janeiro" },
  { v: "02", l: "Fevereiro" },
  { v: "03", l: "Março" },
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

const ANO_ATUAL = new Date().getFullYear();
const ANOS = Array.from({ length: 6 }, (_, i) => String(ANO_ATUAL - i));

function Index() {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loadingInst, setLoadingInst] = useState(true);
  const [errorInst, setErrorInst] = useState<string | null>(null);

  const [portalId, setPortalId] = useState<string>("");
  const [ano, setAno] = useState<string>(String(ANO_ATUAL));
  const [mes, setMes] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, "0"),
  );

  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [loadingServ, setLoadingServ] = useState(false);
  const [errorServ, setErrorServ] = useState<string | null>(null);

  const [filtro, setFiltro] = useState("");
  const [selecionado, setSelecionado] = useState<Servidor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInstituicoes()
      .then((d) =>
        setInstituicoes(d.sort((a, b) => a.titulo.localeCompare(b.titulo))),
      )
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

  return (
    <div className="min-h-screen bg-background">
      <header
        className="border-b border-border/50 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Consulta de Servidores
          </h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">
            Pesquise servidores públicos do município de Porto Velho por
            instituição, ano e mês. Visualize dados públicos e amplie a busca na
            internet com aspas duplas.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6 border-border/50 shadow-[var(--shadow-card)]">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-6">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Instituição
                </label>
                <Select value={portalId} onValueChange={setPortalId} disabled={loadingInst}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingInst ? "Carregando..." : "Selecione uma instituição"
                      }
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
                  Mês
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
                Erro ao carregar instituições: {errorInst}
              </p>
            )}
          </CardContent>
        </Card>

        {!portalId && !loadingInst && (
          <EmptyState
            icon={<Building2 className="h-10 w-10" />}
            title="Selecione uma instituição"
            description="Escolha uma instituição acima para listar os servidores do período."
          />
        )}

        {loadingServ && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando servidores...
          </div>
        )}

        {errorServ && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-5 text-sm text-destructive">
              Não foi possível carregar os servidores: {errorServ}
            </CardContent>
          </Card>
        )}

        {!loadingServ && portalId && !errorServ && filtrados.length === 0 && (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="Nenhum servidor encontrado"
            description="Tente outro mês, ano ou ajuste o filtro."
          />
        )}

        {!loadingServ && filtrados.length > 0 && (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              {filtrados.length} servidor{filtrados.length !== 1 && "es"} encontrado
              {filtrados.length !== 1 && "s"}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtrados.map((s, idx) => (
                <ServidorCard
                  key={`${s.matricula}-${idx}`}
                  servidor={s}
                  onView={handleView}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <ServidorDialog
        servidor={selecionado}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
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
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/50 py-16 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
