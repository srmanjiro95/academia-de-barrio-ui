import { useState } from "react";
import { Card } from "~/components/common/Card";
import { FightLogModal } from "~/components/gym/FightLogModal";
import { FightLogCards } from "~/components/gym/FightLogCards";
import { FightLogTable } from "~/components/gym/FightLogTable";
import { PlansSection } from "~/components/gym/PlansSection";
import type { GymMember } from "~/types/gym/member";
import type { DevelopmentPlan } from "~/types/gym/plan";

export type FightCategory =
  | "Sparring"
  | "Amateur"
  | "Semiprofesional"
  | "Profesional";

export type CategoryRecord = {
  wins: number;
  losses: number;
  draws: number;
  winsByKo: number;
  winsByPoints: number;
  lossesByKo: number;
  lossesByPoints: number;
};

export const categories: FightCategory[] = [
  "Sparring",
  "Amateur",
  "Semiprofesional",
  "Profesional",
];

export const createEmptyRecord = () =>
  categories.reduce((acc, category) => {
    acc[category] = {
      wins: 0,
      losses: 0,
      draws: 0,
      winsByKo: 0,
      winsByPoints: 0,
      lossesByKo: 0,
      lossesByPoints: 0,
    };
    return acc;
  }, {} as Record<FightCategory, CategoryRecord>);

export interface MemberDrawerProps {
  member: GymMember;
  activeRecord: Record<FightCategory, CategoryRecord>;
  plansCatalog: DevelopmentPlan[];
  assignedPlan?: DevelopmentPlan | null;
  onClose: () => void;
  onUpdateRecord: (
    memberId: string,
    category: FightCategory,
    updater: (record: CategoryRecord) => CategoryRecord
  ) => void;
  onLogFight: (memberId: string, log: FightLogInput) => void;
  fightLogs: FightLog[];
  onAssignPlan: (memberId: string, planId: string) => void;
  onCreateCustomPlan: (
    memberId: string,
    plan: DevelopmentPlan,
    addToCatalog: boolean
  ) => void;
}

export type FightLog = {
  id: string;
  date: string;
  category: FightCategory;
  result: "Victoria" | "Derrota" | "Empate";
  method: "KO" | "Puntos" | "N/A";
  opponent: string;
  location: string;
  notes: string;
  evidenceCount: number;
  hasEvidence: boolean;
};

export type FightLogInput = Omit<FightLog, "id">;

export function MemberDrawer({
  member,
  activeRecord,
  plansCatalog,
  assignedPlan,
  onClose,
  onUpdateRecord,
  onLogFight,
  fightLogs,
  onAssignPlan,
  onCreateCustomPlan,
}: MemberDrawerProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logDefaults, setLogDefaults] = useState<{
    category: FightCategory;
    result: FightLog["result"];
    method: FightLog["method"];
  } | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("Todos");
  const [methodFilter, setMethodFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const openLogModal = (
    category: FightCategory,
    result: FightLog["result"],
    method: FightLog["method"]
  ) => {
    setLogDefaults({ category, result, method });
    setIsLogModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar perfil"
        onClick={onClose}
      />
      <aside className="relative ml-auto h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Perfil del miembro
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {member.membership?.name ?? "Sin membresía"} · {member.status}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Contacto
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {member.email}
              </p>
              <p>{member.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Dirección
              </p>
              <p>{member.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Record personal
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const record = activeRecord[category];
              return (
                <Card key={category} className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {category}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Ganadas {record.wins} · Perdidas {record.losses} · Empatadas {record.draws}
                    </p>
                  </div>

                  <div className="grid gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span>Victorias KO</span>
                      <span className="font-semibold text-emerald-600">
                        {record.winsByKo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Victorias por puntos</span>
                      <span className="font-semibold text-emerald-600">
                        {record.winsByPoints}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Derrotas KO</span>
                      <span className="font-semibold text-amber-600">
                        {record.lossesByKo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Derrotas por puntos</span>
                      <span className="font-semibold text-amber-600">
                        {record.lossesByPoints}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          openLogModal(category, "Victoria", "KO")
                        }
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      >
                        + Victoria KO
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openLogModal(category, "Victoria", "Puntos")
                        }
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      >
                        + Victoria puntos
                      </button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          openLogModal(category, "Derrota", "KO")
                        }
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                      >
                        + Derrota KO
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openLogModal(category, "Derrota", "Puntos")
                        }
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                      >
                        + Derrota puntos
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openLogModal(category, "Empate", "N/A")
                      }
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      + Empate
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Bitácora de peleas
          </h3>
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Fecha</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Resultado</span>
                <select
                  value={resultFilter}
                  onChange={(event) => setResultFilter(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option>Todos</option>
                  <option>Victoria</option>
                  <option>Derrota</option>
                  <option>Empate</option>
                </select>
              </div>
              <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-medium">Método</span>
                <select
                  value={methodFilter}
                  onChange={(event) => setMethodFilter(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option>Todos</option>
                  <option>KO</option>
                  <option>Puntos</option>
                  <option>N/A</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  viewMode === "cards"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  viewMode === "table"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Tabla
              </button>
            </div>
          </div>

          {(() => {
            const filteredLogs = fightLogs.filter((log) => {
              const matchesDate = dateFilter
                ? log.date.startsWith(dateFilter)
                : true;
              const matchesResult =
                resultFilter === "Todos" ? true : log.result === resultFilter;
              const matchesMethod =
                methodFilter === "Todos" ? true : log.method === methodFilter;
              return matchesDate && matchesResult && matchesMethod;
            });

            return viewMode === "table" ? (
              <FightLogTable logs={filteredLogs} />
            ) : (
              <FightLogCards logs={filteredLogs} />
            );
          })()}
        </div>

        <PlansSection
          memberId={member.id}
          memberName={`${member.firstName} ${member.lastName}`}
          assignedPlan={assignedPlan}
          plansCatalog={plansCatalog}
          onAssignPlan={onAssignPlan}
          onCreateCustomPlan={onCreateCustomPlan}
        />
      </aside>

      <FightLogModal
        isOpen={isLogModalOpen}
        categories={categories}
        initialCategory={logDefaults?.category}
        initialResult={logDefaults?.result}
        initialMethod={logDefaults?.method}
        onClose={() => {
          setIsLogModalOpen(false);
          setLogDefaults(null);
        }}
        onSubmit={(log) => {
          onLogFight(member.id, log);
          onUpdateRecord(member.id, log.category, (current) => {
            if (log.result === "Victoria") {
              return {
                ...current,
                wins: current.wins + 1,
                winsByKo: current.winsByKo + (log.method === "KO" ? 1 : 0),
                winsByPoints: current.winsByPoints + (log.method === "Puntos" ? 1 : 0),
              };
            }
            if (log.result === "Derrota") {
              return {
                ...current,
                losses: current.losses + 1,
                lossesByKo: current.lossesByKo + (log.method === "KO" ? 1 : 0),
                lossesByPoints:
                  current.lossesByPoints + (log.method === "Puntos" ? 1 : 0),
              };
            }
            return {
              ...current,
              draws: current.draws + 1,
            };
          });
          setIsLogModalOpen(false);
          setLogDefaults(null);
        }}
      />
    </div>
  );
}
