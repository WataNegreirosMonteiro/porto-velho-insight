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
import {
  type Servidor,
  formatName,
  formatDate,
  buildGoogleSearch,
} from "@/lib/portovelho-api";

interface Props {
  servidor: Servidor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-foreground">{value || "—"}</div>
    </div>
  );
}

export function ServidorDialog({ servidor, open, onOpenChange }: Props) {
  if (!servidor) return null;
  const googleUrl = buildGoogleSearch(servidor.nome, servidor.cpf);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{formatName(servidor.nome)}</DialogTitle>
          <DialogDescription>{servidor.cargo}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Matrícula" value={servidor.matricula} />
          <Field label="CPF" value={servidor.cpf} />
          <Field label="Regime" value={servidor.regime} />
          <Field label="Situação" value={servidor.situacao} />
          <Field label="Lotação" value={servidor.lotacao} />
          <Field label="Local de trabalho" value={servidor.local_trabalho} />
          <Field label="Horas semanais" value={servidor.horas_semanais ?? "—"} />
          <Field label="Data de admissão" value={formatDate(servidor.data_admissao)} />
          <Field label="Data de demissão" value={formatDate(servidor.data_demissao)} />
          <Field label="Referência" value={`${servidor.nome_mes}/${servidor.ano}`} />
        </div>

        {servidor.unidade_gestora && (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 text-sm font-semibold">Unidade Gestora</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Nome" value={servidor.unidade_gestora.nome} />
                <Field label="CNPJ" value={servidor.unidade_gestora.cnpj} />
                <Field label="Endereço" value={servidor.unidade_gestora.endereco} />
                <Field label="Telefone" value={servidor.unidade_gestora.telefone} />
              </div>
            </div>
          </>
        )}

        <Separator />

        <Button asChild className="w-full" size="lg">
          <a href={googleUrl} target="_blank" rel="noopener noreferrer">
            <Search className="mr-2 h-4 w-4" />
            Buscar na internet
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Pesquisa no Google: <code className="font-mono">"{servidor.nome}""{servidor.cpf}"</code>
        </p>
      </DialogContent>
    </Dialog>
  );
}