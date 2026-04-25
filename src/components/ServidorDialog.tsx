import { Search, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Servidor, formatName, formatDate, buildGoogleSearch } from "@/lib/portovelho-api";

interface Props {
  servidor: Servidor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/70 p-3">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground">{value || "-"}</div>
    </div>
  );
}

export function ServidorDialog({ servidor, open, onOpenChange }: Props) {
  if (!servidor) return null;
  const googleUrl = buildGoogleSearch(servidor.nome, servidor.cpf);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden border-primary/30 p-0 [&>button]:text-primary-foreground [&>button]:ring-offset-primary [&>button]:data-[state=open]:bg-white/20 [&>button]:data-[state=open]:text-primary-foreground">
        <div className="border-t-4 border-accent bg-primary px-6 py-5 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary-foreground">
              {formatName(servidor.nome)}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/85">
              {servidor.cargo ?? "Cargo nao informado"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Matricula" value={servidor.matricula} />
            <Field label="CPF" value={servidor.cpf} />
            <Field label="Regime" value={servidor.regime} />
            <Field label="Situacao" value={servidor.situacao} />
            <Field label="Lotacao" value={servidor.lotacao} />
            <Field label="Local de trabalho" value={servidor.local_trabalho} />
            <Field label="Horas semanais" value={servidor.horas_semanais ?? "-"} />
            <Field label="Data de admissao" value={formatDate(servidor.data_admissao)} />
            <Field label="Data de demissao" value={formatDate(servidor.data_demissao)} />
            <Field label="Referencia" value={`${servidor.nome_mes}/${servidor.ano}`} />
          </div>

          {servidor.unidade_gestora && (
            <>
              <Separator className="bg-border" />
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Unidade Gestora</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Nome" value={servidor.unidade_gestora.nome} />
                  <Field label="CNPJ" value={servidor.unidade_gestora.cnpj} />
                  <Field label="Endereco" value={servidor.unidade_gestora.endereco} />
                  <Field label="Telefone" value={servidor.unidade_gestora.telefone} />
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border" />

          <Button asChild className="w-full" size="lg">
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
              <Search className="mr-2 h-4 w-4" />
              Buscar na internet
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Pesquisa no Google: <code className="font-mono">"{servidor.nome}" "cpf"</code>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
