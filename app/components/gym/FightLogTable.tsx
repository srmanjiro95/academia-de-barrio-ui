import type { FightLog } from "~/components/gym/MemberDrawer";

interface FightLogTableProps {
  logs: FightLog[];
}

export function FightLogTable({ logs }: FightLogTableProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Aún no hay registros de peleas para este miembro.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/60 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Resultado</th>
            <th className="px-4 py-3">Método</th>
            <th className="px-4 py-3">Contrincante</th>
            <th className="px-4 py-3">Arena</th>
            <th className="px-4 py-3">Evidencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {logs.map((log) => (
            <tr key={log.id} className="text-zinc-600 dark:text-zinc-300">
              <td className="px-4 py-3 whitespace-nowrap">{log.date}</td>
              <td className="px-4 py-3">{log.category}</td>
              <td className="px-4 py-3">{log.result}</td>
              <td className="px-4 py-3">{log.method}</td>
              <td className="px-4 py-3">{log.opponent || "Sin nombre"}</td>
              <td className="px-4 py-3">{log.location || "Sin ubicación"}</td>
              <td className="px-4 py-3">
                {log.hasEvidence ? `${log.evidenceCount} archivos` : "Sin evidencia"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
