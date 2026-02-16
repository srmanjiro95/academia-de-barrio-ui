import { useEffect, useState } from "react";
import { Badge } from "~/components/common/Badge";

export function RealtimeStatus() {
  const [status, setStatus] = useState("Conectando");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("Conectado");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
      <Badge variant={status === "Conectado" ? "success" : "warning"}>
        Tiempo real
      </Badge>
      <span>Socket: {status} (pendiente de FastAPI + Redis)</span>
    </div>
  );
}
