import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isOpen: boolean;
  text?: string;
}

const BOXING_GIF_URL = "https://media.giphy.com/media/39BdMOJMK2YVqktnlS/giphy.gif";

export function LoadingOverlay({ isOpen, text = "Cargando" }: LoadingOverlayProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 350);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center gap-6 bg-[#f8f8f6]">
      <img
        src={BOXING_GIF_URL}
        alt="Cargando"
        className="h-40 w-40 rounded-xl object-cover shadow-lg"
      />
      <p className="text-lg font-semibold tracking-wide text-zinc-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.65)]">
        {text}
        <span className="inline-block min-w-[1.5rem]">{dots}</span>
      </p>
    </div>
  );
}
