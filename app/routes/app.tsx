import { Outlet } from "react-router";
import { AppShell } from "~/components/layout/AppShell";

export default function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
