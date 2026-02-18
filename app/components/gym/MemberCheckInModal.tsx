import type { CheckInMemberPreview } from "~/types/gym/checkin";

interface MemberCheckInModalProps {
  isOpen: boolean;
  checkInDate: string;
  checkInStatus: string;
  preview: CheckInMemberPreview | null;
  onClose: () => void;
}

export function MemberCheckInModal({
  isOpen,
  checkInDate,
  checkInStatus,
  preview,
  onClose,
}: MemberCheckInModalProps) {
  if (!isOpen || !preview) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Cerrar ficha"
      />
      <article className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-950">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Ficha del miembro
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            {preview.imageUrl ? (
              <img src={preview.imageUrl} alt={preview.fullName} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{preview.fullName}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">ID: {preview.memberId}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {preview.membershipName ?? "Sin membresía"} · {preview.status ?? "Sin estatus"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-100 p-3 text-xs dark:border-zinc-800">
          <p>Ingreso: {checkInDate}</p>
          <p>Estatus: {checkInStatus}</p>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-100 p-3 text-xs dark:border-zinc-800">
          <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">Récord de peleas</p>
          <p>
            G: {preview.recordSummary?.wins ?? 0} · P: {preview.recordSummary?.losses ?? 0} · E:{" "}
            {preview.recordSummary?.draws ?? 0}
          </p>
          <p>
            KO: {preview.recordSummary?.winsByKo ?? 0} · Puntos:{" "}
            {preview.recordSummary?.winsByPoints ?? 0}
          </p>
          {preview.records?.length ? (
            <ul className="mt-2 space-y-1">
              {preview.records.slice(0, 3).map((record) => (
                <li key={record.id}>
                  {record.category}: {record.wins}-{record.losses}-{record.draws}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </div>
  );
}
