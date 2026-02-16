import type { ReactNode } from "react";
import { SidebarNav } from "~/components/layout/SidebarNav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="flex">
        <SidebarNav />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Plataforma administrativa
              </p>
              <h2 className="text-lg font-semibold">Panel principal</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                Redis activo (local)
              </span>
              <button className="rounded-xl border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
                Exportar reporte
              </button>
            </div>
          </header>
          <main className="flex-1 space-y-8 px-6 py-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}