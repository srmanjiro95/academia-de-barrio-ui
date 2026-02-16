import { NavLink } from "react-router";
import { navigationSections } from "~/data/navigation";

export function SidebarNav() {
  return (
    <aside className="hidden h-screen w-72 flex-shrink-0 border-r border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-950 lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Gym Admin
        </p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Control Operativo
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          UI lista para conectar con FastAPI y Redis.
        </p>
      </div>

      <nav className="space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {section.title}
            </p>
            <ul className="mt-3 space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      }`
                    }
                    end
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}