import { User, Briefcase, MapPin, Building2, Calendar, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type Servidor,
  formatName,
  buildGoogleSearch,
} from "@/lib/portovelho-api";

interface Props {
  servidor: Servidor;
  onView: (s: Servidor) => void;
}

export function ServidorCard({ servidor, onView }: Props) {
  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <User className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold leading-tight text-foreground">
              {formatName(servidor.nome)}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {servidor.cargo ?? "Cargo não informado"}
            </p>
            {servidor.situacao && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {servidor.situacao}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          {servidor.lotacao && (
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{servidor.lotacao}</span>
            </div>
          )}
          {servidor.local_trabalho && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{servidor.local_trabalho}</span>
            </div>
          )}
          {servidor.regime && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{servidor.regime}</span>
            </div>
          )}
          {servidor.data_admissao && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Admissão: {servidor.data_admissao}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() => onView(servidor)}
          >
            Ver dados
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            title="Buscar no Google"
          >
            <a
              href={buildGoogleSearch(servidor.nome, servidor.cpf)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Search className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}