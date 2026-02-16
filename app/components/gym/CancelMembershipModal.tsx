import { useState } from "react";

interface CancelMembershipModalProps {
  isOpen: boolean;
  memberName: string;
  onClose: () => void;
  onConfirm: (payload: { reason: string; description: string }) => void;
}

export function CancelMembershipModal({
  isOpen,
  memberName,
  onClose,
  onConfirm,
}: CancelMembershipModalProps) {
  const [reason, setReason] = useState("Pago");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({ reason, description });
    setReason("Pago");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar baja de membresía"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Dar de baja membresía
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Registra el motivo de baja para {memberName}.
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

        <div className="mt-4 space-y-4">
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Motivo</span>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option>Pago</option>
              <option>Lesión</option>
              <option>Desinterés</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium">Descripción</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="Detalla el motivo de la baja..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Confirmar baja
          </button>
        </div>
      </div>
    </div>
  );
}
