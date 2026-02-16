import { useMemo } from "react";
import { Badge } from "~/components/common/Badge";
import { Card } from "~/components/common/Card";

interface QrScannerPanelProps {
  value: string;
  isSubmitting: boolean;
  lastScan?: { value: string; time: string } | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSimulate: () => void;
}

export function QrScannerPanel({
  value,
  isSubmitting,
  lastScan,
  onChange,
  onSubmit,
  onSimulate,
}: QrScannerPanelProps) {
  const formattedTime = useMemo(() => {
    if (!lastScan?.time) return "Sin lecturas recientes";
    return new Date(lastScan.time).toLocaleString("es-MX");
  }, [lastScan]);

  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Escaneo de QR
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Conecta el lector USB y escanea el código del miembro.
          </p>
        </div>
        <Badge variant="success">Escáner listo</Badge>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          <span className="font-medium">Área de escaneo</span>
          <input
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Escanea el QR o escribe el ID"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-base text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Los lectores tipo POS envían el valor y presionan Enter automáticamente.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Compatible con lectores USB tipo teclado (HID). Si tu lector requiere
            driver especial, confirma la configuración.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Última lectura
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {lastScan?.value ?? "Sin datos"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formattedTime}
              </p>
            </div>
            <button
              type="button"
              onClick={onSimulate}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Simular escaneo
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrar ingreso"}
        </button>
      </form>
    </Card>
  );
}
