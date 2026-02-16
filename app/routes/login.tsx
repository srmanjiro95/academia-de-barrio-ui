import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

export default function Login() {
 const navigate = useNavigate();
 const [mounted, setMounted] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 
   useEffect(() => {
     setMounted(true);
   }, []);
 
   if (!mounted) return null;
 
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");
  
      if (!email || !password) {
        setError("Ingresa correo y contraseña.");
        return;
      }
  
      setIsSubmitting(true);
      setError(null);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/");
      }, 300);
    };
  
   return (
     <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <form
          onSubmit={handleSubmit}
         className="w-full max-w-sm rounded-xl border p-6 bg-white dark:bg-zinc-900"
       >
          <h1 className="text-xl font-bold mb-4">Ingreso administrativo</h1>
 
         <input
           name="email"
            placeholder="Correo"
           className="mb-3 w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800"
         />
         <input
           name="password"
           type="password"
            placeholder="Contraseña"
           className="mb-4 w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800"
         />
 
          <button
            className="w-full rounded bg-zinc-900 text-white py-2 dark:bg-zinc-700"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Validando..." : "Entrar"}
         </button>
 
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
 
         <p className="mt-3 text-sm text-zinc-500">
            Conecta el backend para validar credenciales.
         </p>
        </form>
     </main>
   );
 }
