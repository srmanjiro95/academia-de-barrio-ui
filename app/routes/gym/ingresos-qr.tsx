import { useEffect, useMemo, useState } from "react";
import { Card } from "~/components/common/Card";
import { PageHeader } from "~/components/common/PageHeader";
import { LoadingOverlay } from "~/components/common/LoadingOverlay";
import { QrScannerPanel } from "~/components/gym/QrScannerPanel";
import { api } from "~/services/api";
import type { CheckIn } from "~/types/gym/checkin";

const QR_UUID_REGEX = /\b([a-f0-9]{32})\b/i;

function extractQrUuid(rawValue: string): string | null {
  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  if (QR_UUID_REGEX.test(trimmed)) {
    const match = trimmed.match(QR_UUID_REGEX);
    return match?.[1]?.toLowerCase() ?? null;
  }

  try {
    const parsedUrl = new URL(trimmed);
    const candidate =
      parsedUrl.searchParams.get("qr_uuid") ??
      parsedUrl.searchParams.get("qr") ??
      (() => {
        const parts = parsedUrl.pathname.split("/").filter(Boolean);
        return parts.length > 0 ? parts[parts.length - 1] : null;
      })();

    if (candidate && QR_UUID_REGEX.test(candidate)) {
      return candidate.match(QR_UUID_REGEX)?.[1]?.toLowerCase() ?? null;
    }
  } catch {
    // no-op: input may not be a URL
  }

  return null;
}

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
    const qrUuid = extractQrUuid(value);

    if (!qrUuid) {
      setMessage("Escanea un QR válido (uuid hex de 32 caracteres).");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const response = await api.registerCheckIn(qrUuid);
    if (!response.ok) {
      setMessage(response.message ?? "No se pudo registrar el ingreso.");
      setIsSubmitting(false);
      return;
    }

    const timestamp = new Date().toISOString();

    setMessage(response.message ?? "Ingreso registrado.");
    setEntries((prev) => [response.data, ...prev]);
    setScannerInput("");
    setLastScan({ value: qrUuid, time: timestamp });
    setIsSubmitting(false);
  };

  const simulatedQrUuid = useMemo(
    () => "c503fe3c0161486fbe4527b931bb8609",
    []
  );

  return (
    <div className="space-y-8">
      <LoadingOverlay isOpen={isLoading} />
      <PageHeader
        title="Ingresos con código QR"
        description="Registro automático de entradas a partir de qr_uuid."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <QrScannerPanel
            value={scannerInput}
            isSubmitting={isSubmitting}
            lastScan={lastScan}
            onChange={setScannerInput}
            onSubmit={() => handleSubmit()}
            onSimulate={() => handleSubmit(simulatedQrUuid)}
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
