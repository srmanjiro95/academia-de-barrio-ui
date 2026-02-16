import { Card } from "~/components/common/Card";
import type { FightLog } from "~/components/gym/MemberDrawer";

interface FightLogCardsProps {
  logs: FightLog[];
}

export function FightLogCards({ logs }: FightLogCardsProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Aún no hay registros de peleas para este miembro.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id} className="flex gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800">
            {log.hasEvidence ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400/40 to-emerald-600/40 text-emerald-700 dark:text-emerald-200">
                Evidencia
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                Sin evidencia
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {log.category} · {log.result}
              </p>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {log.date}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Método: {log.method} · Evidencias: {log.evidenceCount}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Contrincante: {log.opponent || "Sin nombre"} · Arena: {log.location || "Sin ubicación"}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{log.notes}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
