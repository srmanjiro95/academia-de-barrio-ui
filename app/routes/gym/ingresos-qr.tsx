import { useEffect, useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { LoadingOverlay } from "~/components/common/LoadingOverlay";
import { QrScannerPanel } from "~/components/gym/QrScannerPanel";
import { api } from "~/services/api";
import type { CheckIn } from "~/types/gym/checkin";

export default function IngresosQr() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannerInput, setScannerInput] = useState("");
  const [entries, setEntries] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastScan, setLastScan] = useState<{ value: string; time: string } | null>(
    null
  );



  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const response = await api.listCheckIns();
      if (!isMounted) return;
      if (response.ok) {
        setEntries(response.data);
      } else {
        setMessage(response.message ?? "No se pudieron cargar los ingresos.");
      }
      setIsLoading(false);
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (scanValue?: string) => {
    const value = (scanValue ?? scannerInput).trim();
    if (!value) {
      setMessage("Escanea un código válido para registrar el ingreso.");
      return;
    }
    setIsSubmitting(true);
    setMessage(null);

    const timestamp = new Date().toISOString();
    const newCheckIn: CheckIn = {
      id: `CHK-${Date.now()}`,
      memberName: value,
      date: timestamp,
      status: "Aceptado",
    };

    const response = await api.registerCheckIn(newCheckIn);
    if (!response.ok) {
      setMessage(response.message ?? "No se pudo registrar el ingreso.");
      setIsSubmitting(false);
      return;
    }

    setMessage(response.message ?? "Ingreso registrado.");
    setEntries((prev) => [response.data, ...prev]);
    setScannerInput("");
    setLastScan({ value, time: timestamp });
    setIsSubmitting(false);
  };

  const simulatedId = useMemo(
    () => `MBR-${String(Date.now()).slice(-4)}`,
    []
  );

  return (
    <div className="space-y-8">
      <LoadingOverlay isOpen={isLoading} />
      <PageHeader
        title="Ingresos con código QR"
        description="Registro rápido de entradas con validación de membresía."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <QrScannerPanel
            value={scannerInput}
            isSubmitting={isSubmitting}
            lastScan={lastScan}
            onChange={setScannerInput}
            onSubmit={() => handleSubmit()}
            onSimulate={() => handleSubmit(simulatedId)}
          />
          {message ? (
            <p className="text-sm text-emerald-600">{message}</p>
          ) : null}
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Últimos accesos
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            {entries.map((checkIn) => (
              <li
                key={checkIn.id}
                className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {checkIn.memberName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {checkIn.date}
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600">
                  {checkIn.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
